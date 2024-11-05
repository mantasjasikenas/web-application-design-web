<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import { auth } from '$lib/auth.svelte';

	let { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				gcTime: 1
			}
		}
	});

	onMount(async () => {
		await auth.initiliaze();
	});
</script>

<ModeWatcher />

<Toaster richColors={true} position="top-center" />

<QueryClientProvider client={queryClient}>
	{@render children?.()}
</QueryClientProvider>
