import { Router } from 'express';
import { register, login, getMe, updatePassword } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, updatePasswordSchema } from '../schemas/auth.schema';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authenticateJWT, getMe);
router.patch('/update-password', authenticateJWT, validateRequest(updatePasswordSchema), updatePassword);

export default router;
