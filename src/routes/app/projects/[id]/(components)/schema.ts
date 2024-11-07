import { z } from 'zod';
import { Priorities } from '$lib/types';
import { formatDate } from 'date-fns';

export const sectionSchema = z.object({
	name: z.string().min(1, { message: 'Section name is required' })
});

export type SectionSchema = typeof sectionSchema;

export const taskSchema = z.object({
	name: z.string().min(1, { message: 'Task name is required' }),
	description: z.string().min(1, { message: 'Task description is required' }),
	priority: z.enum(Priorities, { message: 'Invalid priority' }),
	completed: z.boolean().default(false),
	dueDate: z
		.string()
		.default(generateDate)
});

export type TaskSchema = typeof taskSchema;

function generateDate() {
	console.log('generateDate');
	return formatDate(new Date(), `yyyy-MM-dd'T'HH:mm`);
}