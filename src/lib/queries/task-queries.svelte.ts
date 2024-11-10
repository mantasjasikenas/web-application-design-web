import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { ApiResponse, Task } from '$lib/types';
import axios from '$lib/axios';
import { toast } from 'svelte-sonner';
import type { TaskSchema } from '$lib/schema';

export function createDeleteTaskMutation({
	onSuccess,
	onError
}: {
	onSuccess?: () => void;
	onError?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: async ({ projectId, task }: { projectId: string; task: Task }) => {
			const response = await axios.delete<ApiResponse>(
				`/projects/${projectId}/sections/${task.sectionId}/tasks/${task.id}`
			);

			if (response.status !== 204) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Task deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to delete task');

			onError?.();
		}
	});
}

export function createAddTaskMutation({
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
			taskData
		}: {
			projectId: string;
			sectionId: number;
			taskData: TaskSchema;
		}) => {
			const res = await axios.post<ApiResponse>(
				`/projects/${projectId}/sections/${sectionId}/tasks`,
				taskData
			);

			if (!res.data.success) {
				throw new Error(res.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Task created successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to create task');

			onError?.();
		}
	});
}

export function createUpdateTaskMutation({
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
			taskData
		}: {
			projectId: string;
			sectionId: number;
			taskData: TaskSchema;
		}) => {
			const response = await axios.put<ApiResponse>(
				`/projects/${projectId}/sections/${sectionId}/tasks`,
				taskData
			);

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Task updated successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });

			onSuccess?.();
		},
		onError: () => {
			toast.error('Failed to update task');

			onError?.();
		}
	});
}
