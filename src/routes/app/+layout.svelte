<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import SidebarPage from '$lib/components/sidebar-page.svelte';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';

	let { children } = $props();

	$effect(() => {
		if (!auth.isLoading && !auth.decodedToken) {
			goto('/login');
		}
	});
</script>

{#if auth.isLoading}
	<LoadingIndicator />
{:else if auth.decodedToken}
	<SidebarPage>
		{@render children?.()}
	</SidebarPage>
{/if}
