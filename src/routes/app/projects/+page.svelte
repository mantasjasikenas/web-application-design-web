<script lang="ts">
	import axios from '$lib/axios';
	import ErrorIndicator from '$lib/components/error-indicator.svelte';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';
	import { type ApiResponse, type Project } from '$lib/types';
	import { reactiveQueryArgs } from '$lib/utils.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import PageTitle from '$lib/components/page-title.svelte';
	import { formatDate } from '$lib/date';
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import ProjectForm from './(components)/project-form.svelte';
	import { toast } from 'svelte-sonner';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	const columns = ['Id', 'Name', 'Description', 'Created At'];

	const queryClient = useQueryClient();

	const projectsStore = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['projects'],
			queryFn: async () => await axios.get<ApiResponse<Project[]>>('/projects')
		}))
	);

	const deleteProjectMutation = createMutation({
		mutationFn: async (id: number) => {
			const response = await axios.delete<ApiResponse>(`/projects/${id}`);

			if (response.status !== 204) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
		onError: () => {
			toast.error('Failed to delete project');
		}
	});

	let { error, isLoading, data: responseData } = $derived($projectsStore);

	let projects = $derived(responseData?.data.data || []);

	let isDialogOpen = $state(false);
	let isConfirmDialogOpen = $state(false);
	let selectedProject = $state<Project | undefined>(undefined);

	const onEdit = (project: Project) => {
		selectedProject = project;
		isDialogOpen = true;
	};

	const onDelete = (project: Project) => {
		selectedProject = project;
		isConfirmDialogOpen = true;
	};
</script>

<PageTitle title="Projects" subtitle="A list of your projects">
	<ProjectForm
		isOpen={isDialogOpen}
		project={selectedProject}
		onOpenChange={(value) => {
                isDialogOpen = value;

                if (!value) {
                  	selectedProject = undefined;
                }
              }}
	/>
</PageTitle>

<ConfirmDialog isOpen={isConfirmDialogOpen} onOpenChange={(value) => {
								isConfirmDialogOpen = value;

								if (!value) {
									selectedProject = undefined;
								}
}}
							 onConfirm={() => {
								if (selectedProject) {
											$deleteProjectMutation.mutate(selectedProject.id);
											selectedProject = undefined;
								}
							}}
							 title="Delete Project"
							 message={`Are you sure you want to delete project ${selectedProject?.name}?`}
/>


{#if isLoading}
	<LoadingIndicator />
{:else if error}
	<ErrorIndicator message={error.message} />
{:else}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each columns as column}
					<Table.Head>{column}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if projects.length}
				{#each projects as project, i (i)}
					<Table.Row>
						<Table.Cell class="font-medium">{project.id}</Table.Cell>
						<Table.Cell>{project.name}</Table.Cell>
						<Table.Cell>{project.description}</Table.Cell>
						<Table.Cell>{formatDate(project.createdAt)}</Table.Cell>
						<Table.Cell>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="ghost" class="data-[state=open]:bg-muted flex h-8 w-8 p-0">
											<Ellipsis class="size-4" />
											<span class="sr-only">Open Menu</span>
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content class="w-[160px]" align="end">
									<DropdownMenu.Item
										onclick={() => {
											onEdit(project);
										}}
									>Edit
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											onDelete(project);
										}}
									>Delete
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">
						No results.
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
{/if}
