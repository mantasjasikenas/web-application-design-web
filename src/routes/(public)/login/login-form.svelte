<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';
	import { loginSchema } from '$lib/schema';
	import { createLoginMutation } from '$lib/queries/auth.queries.svelte';

	const form = superForm(defaults(zod(loginSchema)), {
		SPA: true,
		validators: zod(loginSchema),
		onUpdate({ form }) {
			if (form.valid) {
				$loginMutation.mutate(form.data);
			} else {
				toast.error('Form is invalid');
			}
		}
	});

	const { form: formData, enhance } = $derived(form);

	const loginMutation = createLoginMutation({
		onSuccess: () => {
			goto('/app');
		}
	});
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
							<Input autocomplete="username" {...props} bind:value={$formData.username} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Password</Form.Label>
							<Input
								{...props}
								type="password"
								autocomplete="current-password"
								bind:value={$formData.password}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button disabled={$loginMutation.isPending}>
					{#if $loginMutation.isPending}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}

					Login</Form.Button
				>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/signup" class="underline"> Sign up </a>
		</div>
	</Card.Content>
</Card.Root>
