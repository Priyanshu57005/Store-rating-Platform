import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { CreateStoreInput } from '../schemas/store.schema';
import { Prisma } from '@prisma/client';

export const createStore = async (req: Request<{}, {}, CreateStoreInput>, res: Response, next: NextFunction) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Verify owner exists if ownerId is provided
    if (ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
      });
      if (!owner || owner.role !== 'STORE_OWNER') {
        return res.status(400).json({
          success: false,
          message: 'Selected owner must be a user with STORE_OWNER role.',
        });
      }
    }

    const store = await prisma.store.create({
      data: {
        name,
        email: email.toLowerCase(),
        address,
        ownerId: ownerId || null,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Store added successfully.',
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const getStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Auto-sync: Ensure all registered STORE_OWNER users have a Store entry created
    const unlinkedOwners = await prisma.user.findMany({
      where: {
        role: 'STORE_OWNER',
        stores: { none: {} },
      },
    });

    if (unlinkedOwners.length > 0) {
      await Promise.all(
        unlinkedOwners.map((owner) =>
          prisma.store.create({
            data: {
              name: owner.name,
              email: owner.email,
              address: owner.address,
              ownerId: owner.id,
            },
          })
        )
      );
    }

    const {
      search,
      name,
      address,
      sortBy = 'name',
      sortOrder = 'asc',
      page = '1',
      limit = '10',
    } = req.query as {
      search?: string;
      name?: string;
      address?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: string;
      limit?: string;
    };

    const currentUserId = req.user?.userId;

    const where: Prisma.StoreWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (name) {
      where.name = { contains: name };
    }

    if (address) {
      where.address = { contains: address };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch stores along with ratings and user's specific rating
    const [rawStores, totalCount] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          ratings: {
            select: {
              id: true,
              value: true,
              userId: true,
            },
          },
        },
      }),
      prisma.store.count({ where }),
    ]);

    // Format & calculate overall ratings & user submitted rating
    let formattedStores = rawStores.map((store) => {
      const ratings = store.ratings;
      const totalRatingsCount = ratings.length;
      const avgRating =
        totalRatingsCount > 0
          ? Number((ratings.reduce((acc, curr) => acc + curr.value, 0) / totalRatingsCount).toFixed(2))
          : 0;

      const userSubmittedRating = currentUserId
        ? ratings.find((r) => r.userId === currentUserId)?.value || null
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating: avgRating,
        totalRatings: totalRatingsCount,
        userRating: userSubmittedRating,
        owner: store.owner,
        createdAt: store.createdAt,
      };
    });

    // Sorting by overallRating, name, email, address, createdAt
    const isAsc = sortOrder === 'asc';
    if (sortBy === 'overallRating') {
      formattedStores.sort((a, b) => (isAsc ? a.overallRating - b.overallRating : b.overallRating - a.overallRating));
    } else if (sortBy === 'name') {
      formattedStores.sort((a, b) => (isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    } else if (sortBy === 'email') {
      formattedStores.sort((a, b) => (isAsc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)));
    } else if (sortBy === 'address') {
      formattedStores.sort((a, b) => (isAsc ? a.address.localeCompare(b.address) : b.address.localeCompare(a.address)));
    } else {
      formattedStores.sort((a, b) =>
        isAsc
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Apply pagination post-sort
    const paginatedStores = formattedStores.slice(skip, skip + limitNum);

    return res.status(200).json({
      success: true,
      stores: paginatedStores,
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
