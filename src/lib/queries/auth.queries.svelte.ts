import { createMutation } from '@tanstack/svelte-query';
import { auth } from '$lib/auth.svelte';
import { toast } from 'svelte-sonner';
import type { LoginSchema, SignupSchema } from '$lib/schema';

export function createLoginMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	return createMutation({
		mutationFn: async (data: LoginSchema) => {
			const response = await auth.login(data);

			if (!response.success) {
				throw new Error(response.message);
			}
		},
		onSuccess: () => {
			toast.success('Login successful');

			onSuccess?.();
		},
		onError: (err) => {
			toast.error('Login failed. ' + err.message);

			onError?.();
		}
	});
}

export function createSignupMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	return createMutation({
		mutationFn: async (data: SignupSchema) => {
			const response = await auth.register({
				username: data.username,
				email: data.email,
				password: data.password
			});

			if (!response.success) {
				throw new Error(response.message);
			}
		},
		onSuccess: () => {
			toast.success('Sign up successful');

			onSuccess?.();
		},
		onError: (error) => {
			toast.error(`Sign up failed. ${error.message}`);

			onError?.();
		}
	});
}
