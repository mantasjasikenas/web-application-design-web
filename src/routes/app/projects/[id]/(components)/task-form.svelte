<script lang="ts" module>
	import type { Task } from '$lib/types';

	export type TaskFormProps = {
		projectId: string;
		sectionId: number;
		task?: Task;
		isOpen: boolean;
		onOpenChange: (isOpen: boolean) => void;
		isEditDisabled: boolean;
		onEditButtonClick: () => void;
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
	import { Priorities } from '$lib/types';
	import { CalendarClock, Loader2 } from 'lucide-svelte';
	import {
		createAddTaskMutation,
		createUpdateTaskMutation
	} from '$lib/queries/task-queries.svelte';
	import { taskSchema } from '$lib/schema';
	import { Button } from '$lib/components/ui/button';
	import { generateCurrentDateTime } from '$lib/date';

	let {
		projectId,
		sectionId,
		task,
		isOpen,
		onOpenChange,
		isEditDisabled,
		onEditButtonClick
	}: TaskFormProps = $props();

	const form = $derived(
		superForm(defaults(task, zod(taskSchema)), {
			SPA: true,
			validators: zod(taskSchema),
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

	const createTaskMutation = createAddTaskMutation({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	const updateTaskMutation = createUpdateTaskMutation({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	const onSubmit = () => {
		if (!task) {
			$createTaskMutation.mutate({
				projectId,
				sectionId,
				taskData: $formData
			});

			return;
		}

		$updateTaskMutation.mutate({
			projectId,
			sectionId,
			taskId: task.id,
			taskData: $formData
		});
	};
</script>

<Dialog.Root open={isOpen} {onOpenChange}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title
				>{!task ? 'Create new task' : isEditDisabled ? 'Task details' : 'Edit task'}</Dialog.Title
			>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<div class="grid gap-2">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Name</Form.Label>
							<Input
								class="disabled:cursor-default"
								disabled={isEditDisabled}
								{...props}
								bind:value={$formData.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Description</Form.Label>
							<Input
								class="disabled:cursor-default"
								disabled={isEditDisabled}
								{...props}
								bind:value={$formData.description}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="priority">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Priority</Form.Label>

							<Select.Root
								disabled={isEditDisabled}
								allowDeselect={false}
								type="single"
								bind:value={$formData.priority}
								name="priority"
							>
								<Select.Trigger class="disabled:cursor-default" {...props}>
									{$formData.priority ?? 'Select priority'}
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
							<Checkbox
								class="disabled:cursor-default"
								disabled={isEditDisabled}
								{...props}
								bind:checked={$formData.completed}
							/>
							<Form.Label
								class="pl-1 disabled:cursor-default peer-disabled:cursor-default data-[fs-error]:text-primary"
								>Completed</Form.Label
							>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="dueDate">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="data-[fs-error]:text-primary">Due date</Form.Label>
							<div class="flex flex-row gap-1">
								<Input
									class="disabled:cursor-default"
									disabled={isEditDisabled}
									{...props}
									type="datetime-local"
									step="1"
									bind:value={$formData.dueDate}
								/>
								<!--suppress JSValidateTypes -->
								<Button
									class="disabled:cursor-default"
									aria-label="Set due date to current date and time"
									variant="outline"
									disabled={isEditDisabled}
									onclick={() => ($formData.dueDate = generateCurrentDateTime())}
									><CalendarClock /></Button
								>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				{#if isEditDisabled}
					<Button onclick={onEditButtonClick}>Edit</Button>
				{:else}
					<Form.Button disabled={$createTaskMutation.isPending}>
						{#if $createTaskMutation.isPending}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{/if}

						Confirm
					</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
