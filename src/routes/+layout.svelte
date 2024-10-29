<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/auth.svelte';

	let { children } = $props();

	onMount(async () => {
		await auth.initiliaze();
	});
</script>

<ModeWatcher />

<Toaster richColors={true} position="top-center" />

{@render children?.()}
