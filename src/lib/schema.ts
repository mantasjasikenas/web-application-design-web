import { z } from 'zod';
import { Priorities } from '$lib/types';

export const projectSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string().min(1, { message: 'Description is required' })
});

export const sectionSchema = z.object({
	name: z.string().min(1, { message: 'Section name is required' })
});

export const taskSchema = z
	.object({
		name: z.string().min(1, { message: 'Task name is required' }),
		description: z.string().min(1, { message: 'Task description is required' }),
		priority: z.enum(Priorities, { message: 'Invalid priority' }),
		completed: z.boolean().default(false),
		dueDate: z.string()
	})
	.refine(
		(data) => {
			const date = new Date(data.dueDate);

			return !isNaN(date.getTime());
		},
		{ message: 'Invalid due date', path: ['dueDate'] }
	);

export const loginSchema = z.object({
	username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
	password: z.string().min(3, { message: 'Password must be at least 3 characters long' })
});

export const signupSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		username: z.string().min(1, { message: 'Username must be at least 1 character long' }),
		password: z.string().min(3, { message: 'Password must be at least 3 characters long' }),
		confirmPassword: z.string().min(3, { message: 'Password must be at least 3 characters long' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type ProjectSchema = z.infer<typeof projectSchema>;
export type SectionSchema = z.infer<typeof sectionSchema>;
export type TaskSchema = z.infer<typeof taskSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
