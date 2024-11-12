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
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { projectSchema } from '$lib/schema';
	import { Loader2 } from 'lucide-svelte';
	import {
		createAddProjectMutation,
		createUpdateProjectMutation
	} from '$lib/queries/project-queries.svelte';

	let { project, isOpen, onOpenChange }: ProjectFormProps = $props();

	const form = $derived(
		superForm(defaults(project, zod(projectSchema)), {
			SPA: true,
			validators: zod(projectSchema),
			onUpdate({ form }) {
				if (form.valid) {
					onSubmit();
				} else {
					toast.error('Please fill in the form correctly');
				}
			},
			resetForm: false
		})
	);

	const { form: formData, enhance } = $derived(form);

	const createProjectMutation = createAddProjectMutation({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	const updateProjectMutation = createUpdateProjectMutation({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	const onSubmit = () => {
		if (!project) {
			$createProjectMutation.mutate($formData);
		} else {
			$updateProjectMutation.mutate({
				id: project.id,
				projectData: $formData
			});
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
