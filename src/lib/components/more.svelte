<script lang="ts" module>
	export type MoreProps = {
		class?: string;
		size?: string;
	};
</script>

<script lang="ts">
	const { class: className, size }: MoreProps = $props();
</script>

<!--TODO fix icon sizing and position-->
<svg width={size} height={size} class={className} viewBox="0 0 16 16">
	<g></g>
	<path
		d="M2 6c-1.104 0-2 0.896-2 2s0.896 2 2 2 2-0.896 2-2-0.896-2-2-2zM2 9c-0.551 0-1-0.448-1-1s0.449-1 1-1 1 0.448 1 1-0.449 1-1 1zM8.5 6c-1.104 0-2 0.896-2 2s0.896 2 2 2 2-0.896 2-2-0.896-2-2-2zM8.5 9c-0.551 0-1-0.448-1-1s0.449-1 1-1 1 0.448 1 1-0.449 1-1 1zM15 6c-1.104 0-2 0.896-2 2s0.896 2 2 2 2-0.896 2-2-0.896-2-2-2zM15 9c-0.551 0-1-0.448-1-1s0.449-1 1-1 1 0.448 1 1-0.449 1-1 1z"
		fill="currentColor"
	/>
</svg>
