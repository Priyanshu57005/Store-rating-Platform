import { z } from 'zod';

export const submitRatingSchema = z.object({
  storeId: z.string({ required_error: 'Store ID is required' }),
  value: z
    .number({ required_error: 'Rating value is required' })
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(500, 'Comment cannot exceed 500 characters').optional().nullable(),
});

export type SubmitRatingInput = z.infer<typeof submitRatingSchema>;
