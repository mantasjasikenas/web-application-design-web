<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Welcome to Project page</h1>

<p>Project ID: {data.params.id}</p>

{#each data.sections as section}
	<h2>{section.name}</h2>
{/each}
