import { Router } from 'express';
import { createStore, getStores } from '../controllers/store.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createStoreSchema } from '../schemas/store.schema';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Store creation requires ADMIN
router.post('/', authenticateJWT, requireRole('ADMIN'), validateRequest(createStoreSchema), createStore);

// Store listing is available to all logged in users (and optionally guests if token provided)
router.get('/', authenticateJWT, getStores);

export default router;
