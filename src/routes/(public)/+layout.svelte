<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';

	let { children } = $props();
</script>

{#if auth.isLoading}
	<div class="flex h-screen items-center justify-center">Loading...</div>
{:else if auth.decodedToken}
	{goto('/app')}
{:else}
	<div class="flex h-screen items-center justify-center">
		{@render children?.()}
	</div>
{/if}
