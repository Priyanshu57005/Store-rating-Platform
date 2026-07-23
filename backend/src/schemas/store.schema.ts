import { z } from 'zod';
import { emailValidation, addressValidation } from './auth.schema';

export const createStoreSchema = z.object({
  name: z
    .string({ required_error: 'Store name is required' })
    .trim()
    .min(3, 'Store name must be at least 3 characters long')
    .max(100, 'Store name cannot exceed 100 characters'),
  email: emailValidation,
  address: addressValidation,
  ownerId: z.string().optional().nullable(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
