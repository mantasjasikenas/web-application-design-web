/* eslint-disable prefer-const */
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';
import axios from './axios';
import type { ApiResponse, Token } from './types';

export const ACCESS_TOKEN_KEY = 'accessToken';

function createAuth() {
	let isLoading = $state(false);
	let accessToken = $state<string | null>(null);
	let decodedToken = $derived.by(() => {
		return accessToken ? jwtDecode<Token>(accessToken) : null;
	});

	async function initiliaze() {
		if (!browser) {
			return;
		}

		isLoading = true;

		const token = localStorage.getItem(ACCESS_TOKEN_KEY);

		if (token) {
			setAccessToken(token);
		}

		isLoading = false;
	}

	function setAccessToken(value: string | null) {
		if (!browser) {
			accessToken = value;
			return;
		}

		if (value) {
			localStorage.setItem(ACCESS_TOKEN_KEY, value);
		} else {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
		}

		accessToken = value;
	}

	async function login(data: { username: string; password: string }): Promise<ApiResponse> {
		const response = await axios.post('/auth/login', data);

		if (response.status === 200) {
			const accessToken = response.data.data.accessToken;

			if (!accessToken) {
				return response.data as ApiResponse;
			}

			setAccessToken(accessToken);
		}

		return response.data as ApiResponse;
	}

	async function refreshToken(): Promise<ApiResponse> {
		const response = await axios.post<ApiResponse>('/auth/accessToken');

		if (response.status === 200) {
			const accessToken = response.data.data.accessToken;

			if (!accessToken) {
				return response.data as ApiResponse;
			}

			setAccessToken(accessToken);
		}

		return response.data as ApiResponse;
	}

	async function register(data: {
		username: string;
		email: string;
		password: string;
	}): Promise<ApiResponse> {
		const response = await axios.post('/auth/register', data);

		return response.data as ApiResponse;
	}

	async function logout(): Promise<ApiResponse> {
		if (accessToken === null) {
			return {
				success: false,
				status: '401',
				message: 'Unauthorized'
			};
		}

		const response = await axios.post<ApiResponse>('/auth/logout');

		/* eslint-disable no-constant-condition */
		if (response.status === 200 || true) {
			setAccessToken(null);
		}

		return response.data;
	}

	return {
		get accessToken() {
			return accessToken;
		},
		get decodedToken() {
			return decodedToken;
		},
		setAccessToken,
		register,
		login,
		logout,
		isLoading,
		initiliaze,
		refreshToken
	};
}

export const auth = createAuth();
