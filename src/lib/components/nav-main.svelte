<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { fade } from 'svelte/transition';

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
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} {...props}>
							<item.icon />
							<span>{item.title}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Group>
</div>
