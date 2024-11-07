<script lang="ts">
	import { reactiveQueryArgs } from '$lib/utils.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import type { ApiResponse, Section } from '$lib/types';
	import axios from '$lib/axios';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';
	import PageTitle from '$lib/components/page-title.svelte';
	import SectionForm from './(components)/section-form.svelte';
	import { toast } from 'svelte-sonner';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import SectionColumn from './(components)/section-column.svelte';
	import TaskForm from './(components)/task-form.svelte';

	const queryClient = useQueryClient();
	let { data }: { data: PageData } = $props();

	const sectionsStore = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['sections', data.params.id],
			queryFn: async () =>
				await axios.get<ApiResponse<Section[]>>(`/projects/${data.params.id}/sections`,
					{
						params: {
							withTasks: true
						}
					}
				)
		}))
	);

	const deleteSectionMutation = createMutation({
		mutationFn: async (id: number) => {
			const response = await axios.delete<ApiResponse>(`/projects/${data.params.id}/sections/${id}`);

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

	let { error, isLoading, isRefetching, data: responseData } = $derived($sectionsStore);
	let sections = $derived(responseData?.data.data || []);

	let isDialogOpen = $state(false);
	let isDeleteConfirmDialogOpen = $state(false);
	let isAddTaskDialogOpen = $state(false);
	let selectedSection = $state<Section | undefined>(undefined);

	const onEdit = (section: Section) => {
		selectedSection = section;
		isDialogOpen = true;
	};

	const onDelete = (section: Section) => {
		selectedSection = section;
		isDeleteConfirmDialogOpen = true;
	};

	const onAdd = (section: Section) => {
		selectedSection = section;
		isAddTaskDialogOpen = true;
	};
</script>


<div class="w-full">
	<PageTitle title="Project ID{data.params.id}" subtitle="A list of all sections in the project">
		<SectionForm
			projectId={data.params.id}
			isOpen={isDialogOpen}
			section={selectedSection}
			onOpenChange={(value) => {
                isDialogOpen = value;

                if (!value) {
                  	selectedSection = undefined;
                }
              }}
		/>
	</PageTitle>

	<ConfirmDialog isOpen={isDeleteConfirmDialogOpen} onOpenChange={(value) => {
								isDeleteConfirmDialogOpen = value;

								if (!value) {
									selectedSection = undefined;
								}
}}
								 onConfirm={() => {
								if (selectedSection) {
											$deleteSectionMutation.mutate(selectedSection.id);
											selectedSection = undefined;
								}
							}}
								 title="Delete Section"
								 message={`Are you sure you want to delete section ${selectedSection?.name}?`}
	/>

	{#if selectedSection?.id}
		<TaskForm
			projectId={data.params.id}
			sectionId={selectedSection.id}
			isOpen={isAddTaskDialogOpen}
			onOpenChange={(value) => {
		isAddTaskDialogOpen = value;

		if (!value) {
			selectedSection = undefined;
		}
	}}
		/>
	{/if}

	{#if isLoading || isRefetching}
		<LoadingIndicator class="size-6" />
	{/if}

	{#if error}
		<p>{error.message}</p>
	{/if}

	{#if sections.length}

		<div class="pr-2 pb-2"
		>
			<div class="flex flex-row space-x-4 overflow-x-auto overflow-y-hidden">
				{#each sections as section (section.id)}
					<SectionColumn section={section} tasks={section.tasks || []}
												 onAddTask={() => {
													 onAdd(section);
						}}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<p>No sections found.</p>
	{/if}
</div>
