<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';

	const route = $derived($page.url);

	let {
		items
	}: {
		items: {
			title: string;
			url: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon: any;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();
</script>

<div in:fade>
	<Sidebar.Group>
		{#each items as item (item.title)}
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
							<item.icon class={cn('transition', route.pathname === item.url ? '' : '')} />
							<span class={cn('transition', route.pathname === item.url ? 'font-bold' : '')}
								>{item.title}</span
							>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Group>
</div>
