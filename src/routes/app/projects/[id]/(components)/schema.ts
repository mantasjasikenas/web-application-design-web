import { z } from 'zod';

export const sectionSchema = z.object({
	name: z.string().min(1, { message: 'Section name is required' }),
});

export type SectionSchema = typeof sectionSchema;
