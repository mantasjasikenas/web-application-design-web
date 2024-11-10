import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import { reactiveQueryArgs } from '$lib/utils.svelte';
import axios from '$lib/axios';
import type { ApiResponse, Project } from '$lib/types';
import { toast } from 'svelte-sonner';
import type { ProjectSchema } from '$lib/schema';

export function createProjectQuery() {
	return createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['projects'],
			queryFn: async () => await axios.get<ApiResponse<Project[]>>('/projects')
		}))
	);
}

export function createDeleteProjectMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async (id: number) => {
			const response = await axios.delete<ApiResponse>(`/projects/${id}`);

			if (response.status !== 204) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to delete project');

			onError?.();
		}
	});
}

export function createAddProjectMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	{
		const queryClient = useQueryClient();

		return createMutation({
			mutationFn: async (projectData: ProjectSchema) => {
				const response = await axios.post<ApiResponse>('/projects', projectData);

				if (!response.data.success) {
					throw new Error(response.data.message);
				}
			},
			onSuccess: () => {
				toast.success('Project created successfully');
				queryClient.invalidateQueries({ queryKey: ['projects'] });

				onSuccess?.();
			},
			onError: () => {
				toast.error('Failed to create project');
				onError?.();
			}
		});
	}
}

export function createUpdateProjectMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async (data: { id: number; projectData: ProjectSchema }) => {
			const response = await axios.patch<ApiResponse>(`/projects/${data.id}`, {
				description: data.projectData.description,
				name: data.projectData.name
			});

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project updated successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to update project');

			onError?.();
		}
	});
}
