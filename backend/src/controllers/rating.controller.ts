import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { SubmitRatingInput } from '../schemas/rating.schema';

export const submitOrUpdateRating = async (
  req: Request<{}, {}, SubmitRatingInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const userId = req.user.userId;
    const { storeId, value, comment } = req.body;

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    // Upsert rating (Create if not exists, Update if exists)
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value,
        comment: comment || null,
      },
      create: {
        userId,
        storeId,
        value,
        comment: comment || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Rating submitted successfully!',
      rating,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoreOwnerRatings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const {
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query as {
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: string;
      limit?: string;
    };

    // Find all stores owned by this Store Owner
    const userStores = await prisma.store.findMany({
      where: { ownerId: req.user.userId },
      select: { id: true, name: true },
    });

    if (userStores.length === 0) {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });
    }

    const storeIds = userStores.map((s) => s.id);

    // Build query filter
    const where: any = {
      storeId: { in: storeIds },
    };

    if (search) {
      where.user = {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      };
    }

    // Fetch all ratings for average and breakdown calculations
    const allStoreRatings = await prisma.rating.findMany({
      where: { storeId: { in: storeIds } },
      select: { value: true },
    });

    const totalRatingsCount = allStoreRatings.length;
    const ratingSum = allStoreRatings.reduce((sum, r) => sum + r.value, 0);
    const averageRating = totalRatingsCount > 0 ? Number((ratingSum / totalRatingsCount).toFixed(2)) : 0;

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allStoreRatings.forEach((r) => {
      if (r.value >= 1 && r.value <= 5) {
        ratingBreakdown[r.value as 1 | 2 | 3 | 4 | 5] += 1;
      }
    });

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch list of users who submitted ratings for their store
    const [rawRatings, filteredCount] = await Promise.all([
      prisma.rating.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, address: true },
          },
          store: {
            select: { id: true, name: true },
          },
        },
        skip,
        take: limitNum,
      }),
      prisma.rating.count({ where }),
    ]);

    let formattedRatings = rawRatings.map((r) => ({
      id: r.id,
      userName: r.user.name,
      userEmail: r.user.email,
      userAddress: r.user.address,
      rating: r.value,
      comment: r.comment,
      storeName: r.store.name,
      createdAt: r.createdAt,
    }));

    // Sorting
    const isAsc = sortOrder === 'asc';
    if (sortBy === 'userName') {
      formattedRatings.sort((a, b) => (isAsc ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName)));
    } else if (sortBy === 'userEmail') {
      formattedRatings.sort((a, b) => (isAsc ? a.userEmail.localeCompare(b.userEmail) : b.userEmail.localeCompare(a.userEmail)));
    } else if (sortBy === 'rating') {
      formattedRatings.sort((a, b) => (isAsc ? a.rating - b.rating : b.rating - a.rating));
    } else {
      formattedRatings.sort((a, b) =>
        isAsc
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return res.status(200).json({
      success: true,
      averageRating,
      totalRatings: totalRatingsCount,
      ratingBreakdown,
      ratings: formattedRatings,
      pagination: {
        total: filteredCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredCount / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
