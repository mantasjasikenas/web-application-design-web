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
	import { sectionSchema } from './schema';
	import type { ApiResponse } from '$lib/types';
	import axios from '$lib/axios';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Loader2 } from 'lucide-svelte';

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

	const queryClient = useQueryClient();

	const createSectionMutation = createMutation({
		mutationFn: async () => {
			const res = await axios.post<ApiResponse>(`/projects/${projectId}/sections`, $formData);

			if (!res.data.success) {
				throw new Error(res.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Section created successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });
			form.reset();
			onOpenChange(false);
		},
		onError: () => {
			toast.error('Failed to create section');
		}
	});

	const updateSectionMutation = createMutation({
		mutationFn: async () => {
			if (!section) {
				throw new Error('Section not found');
			}

			const response = await axios.patch<ApiResponse>(
				`/projects/${projectId}/sections/${section.id}`,
				{
					name: $formData.name
				}
			);

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Section updated successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });
			form.reset();
			onOpenChange(false);
		},
		onError: () => {
			toast.error('Failed to update section');
		}
	});

	const onSubmit = () => {
		if (!section) {
			$createSectionMutation.mutate();
		} else {
			$updateSectionMutation.mutate();
		}
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
