import { z } from 'zod';

// Strict validation rules matching PDF Specification
export const nameValidation = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(20, 'Name must be at least 20 characters long')
  .max(60, 'Name cannot exceed 60 characters');

export const addressValidation = z
  .string({ required_error: 'Address is required' })
  .trim()
  .max(400, 'Address cannot exceed 400 characters');

export const emailValidation = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email('Must be a valid email address');

export const passwordValidation = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password cannot exceed 16 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');

export const registerSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  address: addressValidation,
  password: passwordValidation,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']).optional(),
});

export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Password is required'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordValidation,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
