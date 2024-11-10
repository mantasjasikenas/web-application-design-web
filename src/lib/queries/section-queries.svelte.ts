import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import { reactiveQueryArgs } from '$lib/utils.svelte';
import axios from '$lib/axios';
import type { ApiResponse, Section } from '$lib/types';
import { toast } from 'svelte-sonner';

export function createSectionQuery({ projectId }: { projectId: string }) {
	return createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['sections', projectId],
			queryFn: async () =>
				await axios.get<ApiResponse<Section[]>>(`/projects/${projectId}/sections`, {
					params: {
						withTasks: true
					}
				})
		}))
	);
}

export function createDeleteSectionMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async ({ projectId, sectionId }: { projectId: string; sectionId: number }) => {
			const response = await axios.delete<ApiResponse>(
				`/projects/${projectId}/sections/${sectionId}`
			);

			if (response.status !== 204) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to delete project');

			onError?.();
		}
	});
}

export function createAddSectionMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async ({ name, projectId }: { name: string; projectId: string }) => {
			const res = await axios.post<ApiResponse>(`/projects/${projectId}/sections`, {
				name
			});

			if (!res.data.success) {
				throw new Error(res.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Section created successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to create section');

			onError?.();
		}
	});
}

export function createUpdateSectionMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async ({
			projectId,
			sectionId,
			name
		}: {
			projectId: string;
			sectionId: number;
			name: string;
		}) => {
			const response = await axios.patch<ApiResponse>(
				`/projects/${projectId}/sections/${sectionId}`,
				{
					name
				}
			);

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Section updated successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to update section');

			onError?.();
		}
	});
}
