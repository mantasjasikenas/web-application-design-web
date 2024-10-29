<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import SidebarPage from '$lib/components/sidebar-page.svelte';

	let { children } = $props();
</script>

{#if auth.isLoading}
	<div class="flex h-screen items-center justify-center">Loading...</div>
{:else if auth.decodedToken}
	<SidebarPage>
		{@render children?.()}
	</SidebarPage>
{:else}
	{goto('/login')}
{/if}
