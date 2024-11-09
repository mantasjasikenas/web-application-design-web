<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { Snippet } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SiteFooter from '$lib/components/site-footer.svelte';

	let { children }: { children: Snippet<[]> } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="overflow-hidden">
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
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
