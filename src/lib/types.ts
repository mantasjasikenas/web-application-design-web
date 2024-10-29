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
