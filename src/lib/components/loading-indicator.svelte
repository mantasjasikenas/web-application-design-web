<script lang="ts" module>
	export type LoadingCircleProps = {
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { fade } from 'svelte/transition';

	import { LoaderCircle } from 'lucide-svelte';

	let { class: className }: LoadingCircleProps = $props();
</script>

<div
	out:fade
	class="absolute inset-0 z-10 flex h-[--container-height] w-full items-center justify-center gap-2 text-sm text-muted-foreground"
>
	<LoaderCircle class={cn('h-4 w-4 animate-spin', className)} />
	Loading...
</div>
