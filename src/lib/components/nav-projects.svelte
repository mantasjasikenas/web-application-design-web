<script lang="ts">
	import axios from '$lib/axios';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Folder from 'lucide-svelte/icons/folder';
	import type { ApiResponse, Project } from '$lib/types';
	import Skeleton from './ui/skeleton/skeleton.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { reactiveQueryArgs } from '$lib/utils.svelte';

	const projectsStore = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['projects'],
			queryFn: async () => await axios.get<ApiResponse<Project[]>>('/projects')
		}))
	);

	let { isLoading, data: responseData } = $derived($projectsStore);

	let sideBarProjects = $derived.by(() => {
		return responseData?.data.data?.map((project) => ({
			name: project.name,
			url: `/app/projects/${project.id}`
		}));
	});
</script>

{#if sideBarProjects?.length}
	<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
		<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>

		{#if isLoading}
			<div class="flex flex-col gap-2">
				<!--	eslint-disable-next-line @typescript-eslint/no-unused-vars		-->
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
{/if}
