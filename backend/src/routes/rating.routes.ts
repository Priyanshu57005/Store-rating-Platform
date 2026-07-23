import { Router } from 'express';
import { submitOrUpdateRating, getStoreOwnerRatings } from '../controllers/rating.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { submitRatingSchema } from '../schemas/rating.schema';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Normal user submits or updates store rating
router.post(
  '/',
  authenticateJWT,
  requireRole('USER'),
  validateRequest(submitRatingSchema),
  submitOrUpdateRating
);

// Store owner gets list of user ratings for their store
router.get(
  '/owner',
  authenticateJWT,
  requireRole('STORE_OWNER'),
  getStoreOwnerRatings
);

export default router;
