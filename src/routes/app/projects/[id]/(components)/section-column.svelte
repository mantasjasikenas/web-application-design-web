<script lang="ts" module>
	import type { Section, Task } from '$lib/types';

	export type SectionColumnProps = {
		section: Section;
		tasks: Task[];
		onAddTask: () => void;
	};
</script>

<script lang="ts">
	import TaskCard from './task-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';

	const { section, tasks, onAddTask }: SectionColumnProps = $props();
</script>

<div class="h-full w-[282px] shrink-0 pr-6">
	<div class="flex h-full flex-col gap-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-bold">{section.name}</h2>

			<span class="text-sm font-medium text-gray-500">
				{tasks.length}
			</span>
		</div>

		<div class="flex overflow-auto">
			<div class="flex flex-col gap-4">
				{#each tasks as task (task.id)}
					<TaskCard {task} />
				{/each}
			</div>
		</div>

		<Button onclick={onAddTask} variant="ghost" class="flex w-full items-center justify-center">
			<Plus />
			Add task
		</Button>
	</div>
</div>
