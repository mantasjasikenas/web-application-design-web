<script lang="ts">
	import type { PageData } from './$types';
	import type { Section, Task } from '$lib/types';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';
	import SectionForm from './(components)/section-form.svelte';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import SectionColumn, { type SectionAction } from './(components)/section-column.svelte';
	import TaskForm from './(components)/task-form.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import PageRoot from '$lib/components/page-root.svelte';
	import type { TaskAction } from './(components)/task-card.svelte';
	import {
		createDeleteSectionMutation,
		createProjectSectionsQuery,
		createSectionQuery
	} from '$lib/queries/section-queries.svelte';
	import { createDeleteTaskMutation } from '$lib/queries/task-queries.svelte';

	let { data }: { data: PageData } = $props();

	const query = $derived(
		createProjectSectionsQuery({
			projectId: data.params.id
		})
	);

	const [sectionsQuery, projectQuery] = $derived($query);

	const deleteSectionMutation = createDeleteSectionMutation();
	const deleteTaskMutation = createDeleteTaskMutation();

	let {
		error: errorSection,
		isLoading: isLoadingSection,
		isRefetching: isRefetchingSection,
		data: sectionData
	} = $derived(sectionsQuery);
	let {
		error: errorProject,
		isLoading: isLoadingProject,
		isRefetching: isRefetchingProject,
		data: projectData
	} = $derived(projectQuery);

	let sections = $derived(sectionData?.data.data || []);
	let project = $derived(projectData?.data.data);

	let isLoading = $derived(isLoadingSection || isLoadingProject);
	let isRefetching = $derived(isRefetchingSection || isRefetchingProject);

	let isSectionFormDialogOpen = $state(false);
	let isDeleteConfirmDialogOpen = $state(false);
	let isAddTaskDialogOpen = $state(false);
	let isTaskEditDisabled = $state(false);

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

	const onTaskView = (task: Task, section: Section) => {
		selectedTask = task;
		selectedSection = section;
		isTaskEditDisabled = true;
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
			case 'view':
				onTaskView(task, section);
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

			selectedTask = undefined;
			selectedSection = undefined;
		}}
		onConfirm={() => {
			if (selectedTask) {
				$deleteTaskMutation.mutate({
					projectId: data.params.id,
					task: selectedTask
				});

				selectedTask = undefined;
				isDeleteConfirmDialogOpen = false;
			} else if (selectedSection) {
				$deleteSectionMutation.mutate({
					projectId: data.params.id,
					sectionId: selectedSection.id
				});

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
		class="flex h-full flex-nowrap space-x-6 overflow-x-auto overflow-y-hidden rounded-lg p-4"
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

		<div class="w-[282px] shrink-0 pr-4">
			<div class="flex h-full flex-col gap-4">
				{@render sectionForm()}
			</div>
		</div>
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
				isTaskEditDisabled = false;
			}
		}}
		isEditDisabled={isTaskEditDisabled}
		onEditButtonClick={() => {
			isTaskEditDisabled = false;
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

{#if isLoading}
	<LoadingIndicator class="size-6" />
{:else}
	<PageRoot
		title={project?.name || `Project ID${data.params.id}`}
		subtitle={project?.description || 'Project board with sections and tasks'}
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

		{#if errorSection}
			<p>{errorSection.message}</p>
		{/if}

		{@render sectionsContainer()}
	</PageRoot>
{/if}
