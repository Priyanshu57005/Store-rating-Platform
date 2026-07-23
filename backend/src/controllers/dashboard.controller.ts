import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalStores, totalRatings, roleBreakdown, ratingDistribution] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      prisma.rating.groupBy({
        by: ['value'],
        _count: { value: true },
      }),
    ]);

    const formattedRoleBreakdown = {
      ADMIN: roleBreakdown.find((r) => r.role === 'ADMIN')?._count.role || 0,
      USER: roleBreakdown.find((r) => r.role === 'USER')?._count.role || 0,
      STORE_OWNER: roleBreakdown.find((r) => r.role === 'STORE_OWNER')?._count.role || 0,
    };

    const formattedRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach((item) => {
      if (item.value >= 1 && item.value <= 5) {
        formattedRatingDistribution[item.value as 1 | 2 | 3 | 4 | 5] = item._count.value;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
        roleBreakdown: formattedRoleBreakdown,
        ratingDistribution: formattedRatingDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
