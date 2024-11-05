<script lang="ts">
	import { onMount } from 'svelte';
	import axios from '$lib/axios';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Folder from 'lucide-svelte/icons/folder';
	import Share from 'lucide-svelte/icons/share';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import type { ApiResponse } from '$lib/types';
	import Skeleton from './ui/skeleton/skeleton.svelte';

	let isLoading = $state(false);
	let projects = $state<
		{
			name: string;
			url: string;
		}[]
	>([]);

	type Project = {
		id: number;
		name: string;
		description: string;
		createdAt: string;
		createdBy: string;
	};

	const fetchProjects = async () => {
		const { data } = await axios.get<ApiResponse<Project[]>>('/projects');

		if (!data.data) {
			return;
		}

		projects = data.data.map((project) => ({
			name: project.name,
			url: `/app/projects/${project.id}`,
			icon: Folder
		}));
	};

	onMount(async function () {
		isLoading = true;
		await fetchProjects();
		isLoading = false;
	});

	const sidebar = useSidebar();
</script>

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
			{#each projects as item (item.name)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<Folder />
								<span>{item.name}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuAction showOnHover {...props}>
									<Ellipsis />
									<span class="sr-only">More</span>
								</Sidebar.MenuAction>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							class="w-48"
							side={sidebar.isMobile ? 'bottom' : 'right'}
							align={sidebar.isMobile ? 'end' : 'start'}
						>
							<DropdownMenu.Item>
								<Folder class="text-muted-foreground" />
								<span>View Project</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Share class="text-muted-foreground" />
								<span>Share Project</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<Trash2 class="text-muted-foreground" />
								<span>Delete Project</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	{/if}
</Sidebar.Group>
