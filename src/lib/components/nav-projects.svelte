<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import Folder from 'lucide-svelte/icons/folder';
	import { createProjectQuery } from '$lib/queries/project-queries.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { cn } from '$lib/utils';

	const projectsStore = createProjectQuery();

	let { data: responseData } = $derived($projectsStore);

	const route = $derived($page.url);

	let sideBarProjects = $derived.by(() => {
		return responseData?.data.data?.map((project) => ({
			name: project.name,
			url: `/app/projects/${project.id}`
		}));
	});
</script>

{#if sideBarProjects?.length}
	<div in:fade>
		<Collapsible.Root open class="group/collapsible">
			<Sidebar.Group>
				<Sidebar.GroupLabel>
					{#snippet child({ props })}
						<Collapsible.Trigger {...props}>
							Projects
							<ChevronRight
								class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
							/>
						</Collapsible.Trigger>
					{/snippet}
				</Sidebar.GroupLabel>
				<Collapsible.Content>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each sideBarProjects as item, index (index)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton
										class={cn(
											'hover:underline',
											$page.url.pathname === item.url
												? 'font-medium text-foreground'
												: 'text-muted-foreground'
										)}
									>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<Folder class={cn('transition')} />
												<span
													class={cn(
														'transition',
														route.pathname.startsWith(item.url) ? 'font-bold' : ''
													)}>{item.name}</span
												>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Collapsible.Content>
			</Sidebar.Group>
		</Collapsible.Root>
	</div>
{/if}
