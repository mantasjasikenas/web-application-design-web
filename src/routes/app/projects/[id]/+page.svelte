<script lang="ts">
	import { reactiveQueryArgs } from '$lib/utils.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import type { ApiResponse, Section, Task } from '$lib/types';
	import axios from '$lib/axios';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';
	import PageTitle from '$lib/components/page-title.svelte';
	import SectionForm from './(components)/section-form.svelte';
	import { toast } from 'svelte-sonner';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import SectionColumn, { type SectionAction } from './(components)/section-column.svelte';
	import TaskForm from './(components)/task-form.svelte';
	import { fade } from 'svelte/transition';
	import PageRoot from '$lib/components/page-root.svelte';
	import type { TaskAction } from './(components)/task-card.svelte';

	const queryClient = useQueryClient();
	let { data }: { data: PageData } = $props();

	const sectionsStore = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['sections', data.params.id],
			queryFn: async () =>
				await axios.get<ApiResponse<Section[]>>(`/projects/${data.params.id}/sections`, {
					params: {
						withTasks: true
					}
				})
		}))
	);

	const deleteSectionMutation = createMutation({
		mutationFn: async (id: number) => {
			const response = await axios.delete<ApiResponse>(
				`/projects/${data.params.id}/sections/${id}`
			);

			if (response.status !== 204) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });
		},
		onError: () => {
			toast.error('Failed to delete project');
		}
	});

	const deleteTaskMutation = createMutation({
		mutationFn: async (task: Task) => {
			const response = await axios.delete<ApiResponse>(
				`/projects/${data.params.id}/sections/${task.sectionId}/tasks/${task.id}`
			);

			if (response.status !== 204) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Task deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });
		},
		onError: () => {
			toast.error('Failed to delete task');
		}
	});

	let { error, isLoading, isRefetching, data: responseData } = $derived($sectionsStore);
	let sections = $derived(responseData?.data.data || []);

	let isSectionFormDialogOpen = $state(false);
	let isDeleteConfirmDialogOpen = $state(false);
	let isAddTaskDialogOpen = $state(false);

	let selectedSection = $state<Section | undefined>(undefined);
	let selectedTask = $state<Task | undefined>(undefined);

	const onSectionDelete = (section: Section) => {
		selectedSection = section;
		isDeleteConfirmDialogOpen = true;
	};

	const onTaskDelete = (task: Task) => {
		selectedTask = task;
		isDeleteConfirmDialogOpen = true;
	};

	const onTaskAdd = (section: Section) => {
		selectedSection = section;
		isAddTaskDialogOpen = true;
	};

	const onTaskEdit = (task: Task, section: Section) => {
		selectedTask = task;
		selectedSection = section;
		isAddTaskDialogOpen = true;
	};

	const onSectionEdit = (section: Section) => {
		selectedSection = section;
		isSectionFormDialogOpen = true;
	};

	const onTaskAction = (action: TaskAction, task: Task, section: Section) => {
		switch (action) {
			case 'edit':
				onTaskEdit(task, section);
				break;
			case 'delete':
				onTaskDelete(task);
				break;
		}
	};

	const onSectionAction = (action: SectionAction, section: Section) => {
		switch (action) {
			case 'add-task':
				onTaskAdd(section);
				break;
			case 'edit-section':
				onSectionEdit(section);
				break;
			case 'delete-section':
				onSectionDelete(section);
				break;
		}
	};
</script>

<!--TODO refactor this component, migrate logic-->

{#snippet confirmDeleteDialog(item: Task | Section)}
	<ConfirmDialog
		isOpen={isDeleteConfirmDialogOpen}
		onOpenChange={(value) => {
			isDeleteConfirmDialogOpen = value;

			if (!value) {
				return;
			}

			// if (selectedTask) {
			// 	selectedTask = undefined;
			// } else if (selectedSection) {
			// 	selectedSection = undefined;
			// }
			//
			selectedTask = undefined;
			selectedSection = undefined;
		}}
		onConfirm={() => {
			if (selectedTask) {
				$deleteTaskMutation.mutate(selectedTask);
				selectedTask = undefined;
				isDeleteConfirmDialogOpen = false;
			} else if (selectedSection) {
				$deleteSectionMutation.mutate(selectedSection.id);
				selectedSection = undefined;
				isDeleteConfirmDialogOpen = false;
			}
		}}
		title="Delete {'sectionId' in item ? 'Task' : 'Section'}"
		message="Are you sure you want to delete {'sectionId' in item
			? 'Task'
			: 'Section'} {item?.name || item?.name}?"
	/>
{/snippet}

{#snippet sectionsContainer()}
	<div
		class="flex h-full flex-nowrap space-x-4 overflow-x-auto overflow-y-hidden rounded-lg p-4"
		in:fade
	>
		{#each sections as section (section.id)}
			<SectionColumn
				{section}
				tasks={section.tasks || []}
				onTaskAction={(action, task) => onTaskAction(action, task, section)}
				onSectionAction={(action) => onSectionAction(action, section)}
			/>
		{/each}
	</div>
{/snippet}

{#snippet taskForm()}
	<TaskForm
		task={selectedTask}
		projectId={data.params.id}
		sectionId={selectedSection?.id || -1}
		isOpen={isAddTaskDialogOpen}
		onOpenChange={(value) => {
			isAddTaskDialogOpen = value;

			if (!value) {
				selectedSection = undefined;
				selectedTask = undefined;
			}
		}}
	/>
{/snippet}

{#snippet sectionForm()}
	<SectionForm
		projectId={data.params.id}
		isOpen={isSectionFormDialogOpen}
		section={selectedSection}
		onOpenChange={(value) => {
			isSectionFormDialogOpen = value;

			if (!value) {
				selectedSection = undefined;
			}
		}}
	/>
{/snippet}

<PageRoot
	title="Project ID{data.params.id}"
	subtitle="A list of all sections in the project"
	headerChildren={sectionForm}
>
	{#if selectedTask}
		{@render confirmDeleteDialog(selectedTask)}
	{/if}

	{#if selectedSection}
		{@render confirmDeleteDialog(selectedSection)}
	{/if}

	{#if selectedSection?.id}
		{@render taskForm()}
	{/if}

	{#if isLoading || isRefetching}
		<LoadingIndicator class="size-6" />
	{/if}

	{#if error}
		<p>{error.message}</p>
	{/if}

	{#if sections.length}
		{@render sectionsContainer()}
	{:else if !isLoading}
		<p>No sections found.</p>
	{/if}
</PageRoot>
