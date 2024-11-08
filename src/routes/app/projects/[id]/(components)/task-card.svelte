<script lang="ts" module>
	import type { Task } from '$lib/types';

	export type TaskCardProps = {
		task: Task;
	};
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { formatDateDistance } from '$lib/date';

	const { task }: TaskCardProps = $props();
</script>

<Card.Root class="min-h-[68px] w-[258px] shrink-0 hover:border-solid hover:border-gray-400">
	<div class="flex flex-row gap-2 p-4">
		<div class="flex h-full items-center justify-start space-x-2">
			<Checkbox class="cursor-default" checked={task.completed} controlledChecked={true} />
		</div>

		<div class="flex flex-col gap-1">
			<div
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{task.name}
			</div>

			<div
				class="line-clamp-1 text-xs font-medium text-gray-400 hover:line-clamp-none hover:text-nowrap"
			>
				{task.description}
			</div>

			<div
				class="pt-3 text-xs font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{formatDateDistance(task.dueDate)}
			</div>
		</div>
	</div>
</Card.Root>
