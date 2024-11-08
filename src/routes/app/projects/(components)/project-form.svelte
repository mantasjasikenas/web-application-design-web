<script lang="ts" module>
	import type { Project } from '$lib/types';

	export type ProjectFormProps = {
		project?: Project;
		isOpen: boolean;
		onOpenChange: (isOpen: boolean) => void;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { type ProjectSchema, projectSchema } from './schema';
	import type { ApiResponse } from '$lib/types';
	import axios from '$lib/axios';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Loader2 } from 'lucide-svelte';

	let { project, isOpen, onOpenChange }: ProjectFormProps = $props();

	const form = $derived(
		superForm(defaults(project, zod(projectSchema)), {
			SPA: true,
			validators: zod(projectSchema),
			onUpdate({ form }) {
				if (form.valid) {
					onSubmit();
				} else {
					toast.error('Form is invalid');
				}
			}
		})
	);

	const { form: formData, enhance } = $derived(form);

	const queryClient = useQueryClient();

	const createProjectMutation = createMutation({
		mutationFn: async () => {
			const response = await axios.post<ApiResponse>('/projects', $formData);

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project created successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			form.reset();
			onOpenChange(false);
		},
		onError: () => {
			toast.error('Failed to create project');
		}
	});

	const updateProjectMutation = createMutation({
		mutationFn: async () => {
			if (!project) {
				throw new Error('Project not found');
			}

			const response = await axios.patch<ApiResponse>(`/projects/${project.id}`, {
				description: $formData.description,
				name: $formData.name
			});

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Project updated successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			form.reset();
			onOpenChange(false);
		},
		onError: () => {
			toast.error('Failed to update project');
		}
	});

	const onSubmit = () => {
		if (!project) {
			$createProjectMutation.mutate();
		} else {
			$updateProjectMutation.mutate();
		}
	};
</script>

<Dialog.Root open={isOpen} {onOpenChange}>
	<Dialog.Trigger>
		<Button size="sm">Add</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{project ? 'Update project' : 'Create new project'}</Dialog.Title>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<div class="grid gap-2">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Description</Form.Label>
							<Input {...props} bind:value={$formData.description} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button disabled={$createProjectMutation.isPending}>
					{#if $createProjectMutation.isPending}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}

					Confirm
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
