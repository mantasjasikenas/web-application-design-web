import { z } from 'zod';

export const signupSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().min(3, { message: 'Password must be at least 3 characters long' }),
		confirmPassword: z.string().min(3, { message: 'Password must be at least 3 characters long' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type SignupSchema = typeof signupSchema;
