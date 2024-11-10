<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { Snippet } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import SiteFooter from '$lib/components/site-footer.svelte';

	let { children }: { children: Snippet<[]> } = $props();
</script>

{#snippet sidebarTrigger()}
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Sidebar.Trigger class="-ml-1" />
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p class="text-sm text-muted-foreground">
					Press
					<kbd
						class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
					>
						<span class="text-xs">CTRL+B</span>
					</kbd>
					to toggle the sidebar
				</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
{/snippet}

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="overflow-hidden">
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				{@render sidebarTrigger()}
				<Separator orientation="vertical" class="mr-2 h-4" />
			</div>
		</header>

		<div class="flex flex-1 gap-4 p-2 pt-0">
			<div class="h-[calc(100vh-7.5rem)] min-h-0 w-full overflow-hidden rounded-xl border p-6">
				{@render children()}
			</div>
		</div>

		<SiteFooter />
	</Sidebar.Inset>
</Sidebar.Provider>
