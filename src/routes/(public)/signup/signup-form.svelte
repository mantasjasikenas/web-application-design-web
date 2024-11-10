<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { createMutation } from '@tanstack/svelte-query';
	import { auth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';
	import { signupSchema } from '$lib/schema';
	import { createSignupMutation } from '$lib/queries/auth.queries.svelte';

	const form = superForm(defaults(zod(signupSchema)), {
		SPA: true,
		validators: zod(signupSchema),
		onUpdate({ form }) {
			if (form.valid) {
				$signupMutation.mutate(form.data);
			} else {
				toast.error('Form is invalid');
			}
		}
	});

	const { form: formData, enhance } = $derived(form);

	const signupMutation = createSignupMutation({
		onSuccess: () => {
			goto('/login');
		}
	});
</script>

<Card.Root class="mx-auto w-[22rem] max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Sign Up</Card.Title>
		<Card.Description>Enter your email below to sign up</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance>
			<div class="grid gap-2">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

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

				<Form.Field {form} name="confirmPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Confirm Password</Form.Label>
							<Input {...props} type="password" bind:value={$formData.confirmPassword} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button disabled={$signupMutation.isPending}>
					{#if $signupMutation.isPending}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}

					Register</Form.Button
				>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="/login" class="underline"> Login </a>
		</div>
	</Card.Content>
</Card.Root>
