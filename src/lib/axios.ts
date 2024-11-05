import { PUBLIC_BASE_API_URL } from '$env/static/public';
import axios from 'axios';
import { auth } from './auth.svelte';
import { goto } from '$app/navigation';

const axiosInstance = axios.create({
	baseURL: PUBLIC_BASE_API_URL,
	validateStatus: (status) => status !== 401,
	withCredentials: true
});

axiosInstance.interceptors.request.use(
	(request) => {
		const accessToken = auth.accessToken;

		if (accessToken) {
			request.headers['Authorization'] = `Bearer ${accessToken}`;
		}

		return request;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const response = await auth.refreshToken();

				if (!response.success) {
					return Promise.reject(response);
				}

				const accessToken = response.data.accessToken;

				axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);

				auth.setAccessToken(null);

				goto('/login');

				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
