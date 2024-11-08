<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PageRootProps = {
		title: string;
		subtitle?: string;
		headerChildren?: Snippet<[]> | undefined;
		children?: Snippet<[]> | undefined;
	};
</script>

<script lang="ts">
	import PageTitle from '$lib/components/page-title.svelte';
	import { fade } from 'svelte/transition';

	let { title, subtitle, headerChildren, children }: PageRootProps = $props();
</script>

<div class="flex h-full w-full flex-col" in:fade>
	<PageTitle {title} {subtitle}>
		{@render headerChildren?.()}
	</PageTitle>

	{@render children?.()}
</div>
