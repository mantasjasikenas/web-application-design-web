<script lang="ts" module>
	import type { Section } from '$lib/types';

	export type SectionFormProps = {
		projectId: string;
		section?: Section;
		isOpen: boolean;
		onOpenChange: (isOpen: boolean) => void;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Loader2 } from 'lucide-svelte';
	import {
		createAddSectionMutation,
		createUpdateSectionMutation
	} from '$lib/queries/section-queries.svelte';
	import { sectionSchema } from '$lib/schema';

	let { projectId, section, isOpen, onOpenChange }: SectionFormProps = $props();

	const form = $derived(
		superForm(defaults(section, zod(sectionSchema)), {
			SPA: true,
			dataType: 'json',
			validators: zod(sectionSchema),
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

	const createSectionMutation = createAddSectionMutation({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	const updateSectionMutation = createUpdateSectionMutation({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	const onSubmit = () => {
		if (!section) {
			$createSectionMutation.mutate({
				projectId,
				name: $formData.name
			});

			return;
		}

		$updateSectionMutation.mutate({
			projectId,
			sectionId: section.id,
			name: $formData.name
		});
	};
</script>

<Dialog.Root open={isOpen} {onOpenChange}>
	<Dialog.Trigger>
		<Button size="sm">Add section</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{section ? 'Update section' : 'Create new section'}</Dialog.Title>
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

				<Form.Button disabled={$createSectionMutation.isPending}>
					{#if $createSectionMutation.isPending}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}

					Confirm
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
