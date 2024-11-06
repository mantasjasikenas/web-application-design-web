import { z } from 'zod';

export const projectSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string().min(1, { message: 'Description is required' })
});

export type ProjectSchema = typeof projectSchema;
