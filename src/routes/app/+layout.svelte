<script lang="ts">
	import { goto } from '$app/navigation';
	import { token } from '$lib/auth.svelte';
	import SidebarPage from '$lib/components/sidebar-page.svelte';

	let { children } = $props();
</script>

{#if token.decodedToken}
	<SidebarPage>
		{token.decodedToken.sub}
		{@render children?.()}
	</SidebarPage>
{:else}
	{goto('/login')}
{/if}
