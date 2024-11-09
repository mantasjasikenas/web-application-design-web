<script lang="ts" module>
	import type { Section, Task } from '$lib/types';
	import type { TaskAction } from './task-card.svelte';

	export type SectionAction = 'add-task' | 'edit-section' | 'delete-section';

	export type SectionColumnProps = {
		section: Section;
		tasks: Task[];
		onSectionAction: (action: SectionAction) => void;
		onTaskAction: (action: TaskAction, task: Task) => void;
	};
</script>

<script lang="ts">
	import TaskCard from './task-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Plus } from 'lucide-svelte';
	import More from '$lib/components/more.svelte';
	import { Pencil, Trash2 } from 'lucide-svelte';

	const { section, tasks, onSectionAction, onTaskAction }: SectionColumnProps = $props();
</script>

<div class="h-full w-[282px] shrink-0 pr-4">
	<div class="flex h-full flex-col gap-4">
		<div class="flex items-center gap-4">
			<h2 class="text-lg font-bold">{section.name}</h2>

			<span class="text-sm font-medium text-gray-500">
				{tasks.length}
			</span>

			<div class="ml-auto">
				{@render sectionDropdownMenu()}
			</div>
		</div>

		<div class="flex overflow-y-auto overflow-x-hidden">
			<div class="flex flex-col gap-4">
				{#each tasks as task (task.id)}
					<TaskCard onAction={(action) => onTaskAction(action, task)} {task} />
				{/each}
			</div>
		</div>

		<Button
			onclick={() => onSectionAction('add-task')}
			variant="ghost"
			class="flex w-full items-center justify-center"
		>
			<Plus />
			Add task
		</Button>
	</div>
</div>

{#snippet sectionDropdownMenu()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="ghost" class="flex h-8 w-8 p-0">
				<More size="16" />
				<span class="sr-only">Open Menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Section actions</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => onSectionAction('edit-section')}>
						<Pencil class="mr-2 size-4" />
						<span>Edit</span>
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => onSectionAction('delete-section')}>
						<Trash2 class="mr-2 size-4" />
						<span>Delete</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
