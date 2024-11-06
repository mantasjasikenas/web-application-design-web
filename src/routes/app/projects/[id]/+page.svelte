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

	const queryClient = useQueryClient();
	let { data }: { data: PageData } = $props();

	const sectionsStore = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['sections', data.params.id],
			queryFn: async () =>
				await axios.get<ApiResponse<Section[]>>(`/projects/${data.params.id}/sections`)
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
	let isConfirmDialogOpen = $state(false);
	let selectedSection = $state<Section | undefined>(undefined);

	const onEdit = (section: Section) => {
		selectedSection = section;
		isDialogOpen = true;
	};

	const onDelete = (section: Section) => {
		selectedSection = section;
		isConfirmDialogOpen = true;
	};
</script>


<PageTitle title="Sections" subtitle="A list of all sections in the project">
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

<ConfirmDialog isOpen={isConfirmDialogOpen} onOpenChange={(value) => {
								isConfirmDialogOpen = value;

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

{#if isLoading || isRefetching}
	<LoadingIndicator class="size-6" />
{/if}

{#if error}
	<p>{error.message}</p>
{/if}

<p>Project ID: {data.params.id}</p>

{#if sections.length}
	{#each sections as section (section.id)}
		<h2>{section.name}</h2>
	{/each}
{:else}
	<p>No sections found.</p>
{/if}
