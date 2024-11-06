<script lang="ts">
	import { reactiveQueryArgs } from '$lib/utils.svelte';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import type { ApiResponse, Section } from '$lib/types';
	import axios from '$lib/axios';
	import { Button } from '$lib/components/ui/button';
	import LoadingIndicator from '$lib/components/loading-indicator.svelte';

	let { data }: { data: PageData } = $props();

	const client = useQueryClient();

	const sectionsStore = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['sections', data.params.id],
			queryFn: async () =>
				await axios.get<ApiResponse<Section[]>>(`/projects/${data.params.id}/sections`)
		}))
	);

	let { error, isLoading, isRefetching, data: responseData } = $derived($sectionsStore);

	let sections = $derived(responseData?.data.data || []);

	const invalidateCache = () => {
		client.invalidateQueries({ queryKey: ['sections'] });
	};
</script>

{#if isLoading || isRefetching}
	<LoadingIndicator class="size-6" />
{/if}

{#if error}
	<p>{error.message}</p>
{/if}

<p>Project ID: {data.params.id}</p>

{#each sections as section (section.id)}
	<h2>{section.name}</h2>
{/each}

<Button onclick={invalidateCache}>Invalidate Cache</Button>
