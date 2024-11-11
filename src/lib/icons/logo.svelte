<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let restProps: SVGAttributes<SVGElement> = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="48"
	height="48"
	viewBox="0 0 24 24"
	fill="none"
	stroke="none"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	{...restProps}
>
	<rect class="h-full w-full" stroke="none" />
	<g
		class={cn(
			'[&>*:nth-child(even)]:stroke-pink-500 [&>*:nth-child(odd)]:stroke-pink-300 dark:[&>*:nth-child(odd)]:stroke-pink-100'
		)}
	>
		<path d="M21 4H3" class="animate-pulse duration-1000" />
		<path d="M18 8H6" class="animate-pulse" />
		<path d="M19 12H9" class="animate-pulse duration-1000" />
		<path d="M16 16h-6" class="animate-pulse" />
		<path d="M11 20H9" class="animate-pulse duration-1000" />
	</g>
</svg>
