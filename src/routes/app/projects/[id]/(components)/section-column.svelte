<script lang="ts" module>
	import type { Section, Task } from '$lib/types';

	export type SectionColumnProps = {
		section: Section;
		tasks: Task[];
		onAddTask: () => void;
	}
</script>

<script lang="ts">
	import TaskCard from './task-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';

	const { section, tasks, onAddTask }: SectionColumnProps = $props();
</script>


<div class="pb-6 pr-6 w-[282px] shrink-0">
	<div class="flex flex-col gap-4 ">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-bold">{section.name}</h2>

			<span class="text-sm font-medium text-gray-500">
				{tasks.length}
			</span>
		</div>

		<div class="overflow-x-hidden overflow-y-auto flex flex-col gap-4">
			{#each tasks as task (task.id)}
				<TaskCard task={task} />
			{/each}
		</div>

		<Button
			onclick={onAddTask}
			variant="ghost" class="flex items-center justify-center w-full">
			<Plus />
			Add task
		</Button>

	</div>
</div>