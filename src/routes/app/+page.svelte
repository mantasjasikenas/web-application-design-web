<script lang="ts">
	import axios from '$lib/axios';
	import Button from '$lib/components/ui/button/button.svelte';

	const onButtonClick = async () => {
		const response = await axios.get('/projects');

		console.log(response.data);
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button onclick={onButtonClick}>Click me</Button>
