<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Folder from 'lucide-svelte/icons/folder';
	import Skeleton from './ui/skeleton/skeleton.svelte';
	import { createProjectQuery } from '$lib/queries/project-queries.svelte';
	import { fade } from 'svelte/transition';

	const projectsStore = createProjectQuery();

	let { isLoading, data: responseData } = $derived($projectsStore);

	let sideBarProjects = $derived.by(() => {
		return responseData?.data.data?.map((project) => ({
			name: project.name,
			url: `/app/projects/${project.id}`
		}));
	});
</script>

{#if sideBarProjects?.length}
	<div in:fade>
		<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
			<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>

			{#if isLoading}
				<div class="flex flex-col gap-2">
					{#each Array(5) as _, index (index)}
						<Skeleton class="h-[32px] w-full" />
					{/each}
				</div>
			{:else}
				<Sidebar.Menu>
					{#each sideBarProjects as item, index (index)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<Folder />
										<span>{item.name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			{/if}
		</Sidebar.Group>
	</div>
{/if}
