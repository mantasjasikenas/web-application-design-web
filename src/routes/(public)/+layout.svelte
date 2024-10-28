<script lang="ts">
	import { goto } from '$app/navigation';
	import { token } from '$lib/auth.svelte';

	let { children } = $props();
</script>

{#if token.decodedToken}
	{goto('/app')}
{:else}
	<div class="flex h-screen items-center justify-center">
		{@render children?.()}
	</div>
{/if}
