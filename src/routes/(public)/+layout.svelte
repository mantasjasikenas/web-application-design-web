<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	$effect(() => {
		if (!auth.isLoading && auth.decodedToken) {
			goto('/app');
		}
	});
</script>

{#if auth.isLoading}
	<LoadingIndicator />
{:else if !auth.decodedToken}
	<div class="w-svh flex h-svh items-center justify-center" in:fade>
		{@render children?.()}
	</div>
{/if}
