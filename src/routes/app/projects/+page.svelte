<script lang="ts">
	import ErrorIndicator from '$lib/components/error-indicator.svelte';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';
	import { type Project } from '$lib/types';
	import { formatDate } from '$lib/date';
	import { Button } from '$lib/components/ui/button';
	import ProjectForm from './(components)/project-form.svelte';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import PageRoot from '$lib/components/page-root.svelte';
	import More from '$lib/components/more.svelte';
	import {
		createDeleteProjectMutation,
		createProjectQuery
	} from '$lib/queries/project-queries.svelte';

	const columns = ['Id', 'Name', 'Description', 'Created At'];

	const projectsQuery = createProjectQuery();
	let { error, isLoading, data: projectsData } = $derived($projectsQuery);
	let projects = $derived(projectsData?.data.data || []);

	const deleteProjectMutation = createDeleteProjectMutation();

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

{#snippet projectForm()}
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
{/snippet}

{#snippet confirmDeleteDialog()}
	<ConfirmDialog
		isOpen={isConfirmDialogOpen}
		onOpenChange={(value) => {
			isConfirmDialogOpen = value;

			if (!value) {
				selectedProject = undefined;
			}
		}}
		onConfirm={() => {
			if (selectedProject) {
				isConfirmDialogOpen = false;
				$deleteProjectMutation.mutate(selectedProject.id);
				selectedProject = undefined;
			}
		}}
		title="Delete Project"
		message={`Are you sure you want to delete project ${selectedProject?.name}?`}
	/>
{/snippet}

{#snippet projectsTable()}
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
										<Button
											{...props}
											variant="ghost"
											class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
										>
											<More size="16" />
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
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
{/snippet}

<PageRoot title="Projects" subtitle="A list of your projects" headerChildren={projectForm}>
	{@render confirmDeleteDialog()}

	{#if isLoading}
		<LoadingIndicator />
	{:else if error}
		<ErrorIndicator message={error.message} />
	{:else}
		{@render projectsTable()}
	{/if}
</PageRoot>
