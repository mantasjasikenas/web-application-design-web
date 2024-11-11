<script lang="ts" module>
	import { Home, SquareSlash } from 'lucide-svelte';
	import { auth } from '$lib/auth.svelte';

	const data = {
		navMain: [
			{
				title: 'Home',
				url: '/app',
				icon: Home
			},
			{
				title: 'Projects',
				url: '/app/projects',
				icon: SquareSlash
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavProjects from '$lib/components/nav-projects.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import ToggleTheme from './toggle-theme.svelte';
	import * as Icon from '../icons/index.js';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex flex-row items-center justify-center gap-3">
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<Icon.Logo class="size-6" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">Tasks Inc</span>
								<span class="truncate text-xs">Enterprise</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
				<ToggleTheme />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects />
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if auth.decodedToken?.sub}
			<NavUser
				id={auth.decodedToken.sub}
				roles={auth.decodedToken.roles}
				username={auth.decodedToken.username}
			/>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
