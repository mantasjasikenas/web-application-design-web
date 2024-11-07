import type { JwtPayload } from 'jwt-decode';

export interface Token extends JwtPayload {
	roles: string[];
	username: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = {
	success: boolean;
	status: string;
	message: string;
	data?: T | null;
	errors?: string[];
};

export type Project = {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	createdBy: string;
};

export type Section = {
	id: number;
	projectId: number;
	name: string;
	createdBy: string;
	createdAt: string;
	tasks?: Task[];
};

export type Task = {
	id: number;
	sectionId: number;
	name: string;
	description: string;
	priority: Priority;
	completed: boolean;
	dueDate: string;
	createdBy: string;
	createdAt: string;
};

export const Priorities = ['Low', 'Medium', 'High', 'Vital'] as const;

export type Priority = (typeof Priorities)[number];
