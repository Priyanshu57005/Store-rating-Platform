import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { CreateUserInput } from '../schemas/user.schema';
import { Role, Prisma } from '@prisma/client';

export const createUser = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        address,
        role: role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: `User created successfully with role ${role}.`,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      name,
      email,
      address,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query as {
      search?: string;
      name?: string;
      email?: string;
      address?: string;
      role?: Role;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: string;
      limit?: string;
    };

    const where: Prisma.UserWhereInput = {};

    // Filtering by specific field or general search
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } },
      ];
    }

    if (name) {
      where.name = { contains: name };
    }
    if (email) {
      where.email = { contains: email };
    }
    if (address) {
      where.address = { contains: address };
    }
    if (role && ['ADMIN', 'USER', 'STORE_OWNER'].includes(role)) {
      where.role = role;
    }

    // Dynamic sorting
    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir = sortOrder === 'asc' ? 'asc' : 'desc';

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          createdAt: true,
          stores: {
            select: {
              id: true,
              name: true,
              ratings: {
                select: {
                  value: true,
                },
              },
            },
          },
        },
        orderBy: { [sortField]: sortDir },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    // Format response and attach store owner rating if applicable
    const formattedUsers = users.map((user) => {
      let ratingInfo = null;

      if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
        let totalRatingSum = 0;
        let totalRatingCount = 0;

        user.stores.forEach((store) => {
          store.ratings.forEach((r) => {
            totalRatingSum += r.value;
            totalRatingCount += 1;
          });
        });

        const avgRating = totalRatingCount > 0 ? Number((totalRatingSum / totalRatingCount).toFixed(2)) : 0;
        ratingInfo = {
          averageRating: avgRating,
          totalRatings: totalRatingCount,
          storeCount: user.stores.length,
        };
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        ownerRating: ratingInfo,
      };
    });

    return res.status(200).json({
      success: true,
      users: formattedUsers,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                id: true,
                value: true,
                comment: true,
                createdAt: true,
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let ownerRatingData = null;
    if (user.role === 'STORE_OWNER') {
      let totalRatingSum = 0;
      let totalRatingCount = 0;
      const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      user.stores.forEach((store) => {
        store.ratings.forEach((r) => {
          totalRatingSum += r.value;
          totalRatingCount += 1;
          if (r.value >= 1 && r.value <= 5) {
            ratingBreakdown[r.value as 1 | 2 | 3 | 4 | 5] += 1;
          }
        });
      });

      ownerRatingData = {
        averageRating: totalRatingCount > 0 ? Number((totalRatingSum / totalRatingCount).toFixed(2)) : 0,
        totalRatings: totalRatingCount,
        stores: user.stores.map((s) => ({
          id: s.id,
          name: s.name,
          ratingsCount: s.ratings.length,
          avgRating:
            s.ratings.length > 0
              ? Number((s.ratings.reduce((sum, item) => sum + item.value, 0) / s.ratings.length).toFixed(2))
              : 0,
        })),
        breakdown: ratingBreakdown,
      };
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        ownerRating: ownerRatingData,
      },
    });
  } catch (error) {
    next(error);
  }
};
