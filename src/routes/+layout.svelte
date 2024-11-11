<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import { auth } from '$lib/auth.svelte';
	import { getPageTitle } from '$lib/utils';
	import { page } from '$app/stores';

	let { children } = $props();

	const title = $derived(getPageTitle($page.url.pathname));

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				gcTime: 1
			}
		}
	});

	onMount(async () => {
		await auth.initialize();
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<ModeWatcher />

<Toaster richColors={true} position="top-center" />

<QueryClientProvider client={queryClient}>
	{@render children?.()}
</QueryClientProvider>
