<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema, type LoginSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import { auth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';

	const form = superForm(defaults(zod(loginSchema)), {
		SPA: true,
		validators: zod(loginSchema),
		onUpdate({ form }) {
			if (form.valid) {
				login(form.data);
			} else {
				toast.error('Form is invalid');
			}
		}
	});

	const { form: formData, enhance } = form;

	const login = async (data: { username: string; password: string }) => {
		const loginResponse = await auth.login(data);

		if (loginResponse.success) {
			toast.success('Login successful');
			goto('/app');
		} else {
			const errors = loginResponse.errors;

			toast.error(loginResponse.message);

			if (errors) {
				toast.error('Login failed');
				toast.error(errors.join(', '));
			}
		}
	};
</script>

<Card.Root class="mx-auto w-[22rem] max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance>
			<div class="grid gap-2">
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Username</Form.Label>
							<Input {...props} bind:value={$formData.username} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Password</Form.Label>
							<Input {...props} type="password" bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button>Login</Form.Button>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/signup" class="underline"> Sign up </a>
		</div>
	</Card.Content>
</Card.Root>
