<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PageTitleProps = {
		title: string;
		subtitle?: string;
		children?: Snippet<[]> | undefined
	};
</script>

<script lang="ts">
	import { Separator } from './ui/separator';

	let { title, subtitle, children }: PageTitleProps = $props();
</script>

<div class="space-y-0.5 flex flex-row">
	<div>
		<h2 class="text-2xl font-bold tracking-tight">{title}</h2>

		{#if subtitle}
			<p class="text-muted-foreground">{subtitle}</p>
		{/if}
	</div>

	<div class="ml-auto flex justify-center">
		{@render children?.()}
	</div>

</div>
<Separator class="my-6" />
