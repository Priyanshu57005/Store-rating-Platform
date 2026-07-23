import { Router } from 'express';
import { getAdminDashboardStats } from '../controllers/dashboard.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/admin', authenticateJWT, requireRole('ADMIN'), getAdminDashboardStats);

export default router;
