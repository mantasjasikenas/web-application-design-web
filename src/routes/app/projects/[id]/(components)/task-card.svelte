<script lang="ts" module>
	import type { Task } from '$lib/types';

	export type TaskCardProps = {
		task: Task;
	}
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { formatDateDistance } from '$lib/date';

	const { task }: TaskCardProps = $props();
</script>


<Card.Root class="w-[258px] min-h-[68px] hover:border-solid hover:border-gray-400">
	<div class="flex flex-row p-4 gap-2">
		<div class="flex items-center space-x-2 justify-start h-full">
			<Checkbox checked={task.completed}  controlledChecked={true} />
		</div>

		<div class="flex flex-col gap-1">
			<div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				{task.name}
			</div>

			<div class="text-xs font-medium hover:text-nowrap line-clamp-1 hover:line-clamp-none text-gray-400">
				{task.description}
			</div>

			<div
				class="pt-3 text-xs font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				{formatDateDistance(task.dueDate)}
			</div>
		</div>
	</div>
</Card.Root>