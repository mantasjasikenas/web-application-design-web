<script lang="ts" module>
	import type { Task } from '$lib/types';

	export type TaskFormProps = {
		projectId: string;
		sectionId: number;
		task?: Task;
		isOpen: boolean;
		onOpenChange: (isOpen: boolean) => void;
	};
</script>

<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { taskSchema } from './schema';
	import { type ApiResponse, Priorities } from '$lib/types';
	import axios from '$lib/axios';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Loader2 } from 'lucide-svelte';

	let { projectId, sectionId, task, isOpen, onOpenChange }: TaskFormProps = $props();

	// FIXME: Default dueDate doesn't update on re-render
	const form = $derived(superForm(defaults(task, zod(taskSchema)), {
			SPA: true,
			validators: zod(taskSchema),
			onUpdate({ form }) {
				if (form.valid) {
					onSubmit();
				} else {
					toast.error('Form is invalid');
				}
			}
		}
	));

	const { form: formData, enhance } = $derived(form);

	const queryClient = useQueryClient();

	const createTaskMutation = createMutation({
		mutationFn: async () => {
			const res = await axios.post<ApiResponse>(`/projects/${projectId}/sections/${sectionId}/tasks`, $formData);

			if (!res.data.success) {
				throw new Error(res.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Task created successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });
			form.reset();
			onOpenChange(false);
		},
		onError: () => {
			toast.error('Failed to create task');
		}
	});

	const updateTaskMutation = createMutation({
		mutationFn: async () => {
			if (!task) {
				throw new Error('Task not found');
			}

			const response = await axios.put<ApiResponse>(`/projects/${projectId}/sections/${sectionId}/tasks`, $formData);

			if (!response.data.success) {
				throw new Error(response.data.message);
			}
		},
		onSuccess: () => {
			toast.success('Task updated successfully');
			queryClient.invalidateQueries({ queryKey: ['sections'] });
			form.reset();
			onOpenChange(false);
		},
		onError: () => {
			toast.error('Failed to update task');
		}
	});

	const onSubmit = () => {
		if (!task) {
			$createTaskMutation.mutate();
		} else {
			$updateTaskMutation.mutate();
		}
	};
</script>


<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{task ? 'Update task' : 'Create new task'}</Dialog.Title>
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

				<Form.Field {form} name="priority">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Priority</Form.Label>

							<Select.Root
								allowDeselect={false}
								type="single"
								bind:value={$formData.priority}
								name="priority"
							>
								<Select.Trigger {...props}>
									{$formData.priority ?? "Select priority"}
								</Select.Trigger>
								<Select.Content>
									{#each Priorities as priority}
										<Select.Item value={priority} label={priority} />
									{/each}
								</Select.Content>
							</Select.Root>

						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="completed">
					<Form.Control>
						{#snippet children({ props })}
							<Checkbox {...props} bind:checked={$formData.completed} />
							<Form.Label class="data-[fs-error]:text-primary">Completed</Form.Label>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="dueDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Due date</Form.Label>
							<Input {...props} type="datetime-local" bind:value={$formData.dueDate} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button
					disabled={$createTaskMutation.isPending}
				>
					{#if $createTaskMutation.isPending}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}

					Confirm
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>