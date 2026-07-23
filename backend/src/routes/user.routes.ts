import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createUserSchema } from '../schemas/user.schema';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All user management routes require ADMIN role
router.use(authenticateJWT, requireRole('ADMIN'));

router.post('/', validateRequest(createUserSchema), createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
