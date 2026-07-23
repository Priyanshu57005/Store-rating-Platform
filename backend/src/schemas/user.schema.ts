import { z } from 'zod';
import { nameValidation, emailValidation, addressValidation, passwordValidation } from './auth.schema';

export const createUserSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  address: addressValidation,
  password: passwordValidation,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER'], {
    required_error: 'Role is required',
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
