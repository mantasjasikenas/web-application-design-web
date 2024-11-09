<script lang="ts" module>
	import type { Task } from '$lib/types';

	export type TaskAction = 'edit' | 'delete';

	export type TaskCardProps = {
		task: Task;
		onAction: (action: TaskAction) => void;
	};
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { formatDateDistance } from '$lib/date';
	import More from '$lib/components/more.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';
	import { Pencil, Trash2 } from 'lucide-svelte';

	const { task, onAction }: TaskCardProps = $props();
</script>

<Card.Root class="min-h-[68px] w-[258px] shrink-0 hover:border-solid hover:border-gray-400">
	<div class="flex flex-row gap-2 overflow-hidden p-4">
		<div class="flex h-full items-center justify-start space-x-2">
			<Checkbox class="cursor-default" checked={task.completed} controlledChecked={true} />
		</div>

		<div class="flex w-full flex-col gap-1">
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

		<div class="flex h-full items-center justify-start">
			{@render taskDropdownMenu()}
		</div>
	</div>
</Card.Root>

{#snippet taskDropdownMenu()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="ghost" class="flex h-8 w-8 p-0">
				<More size="16" />
				<span class="sr-only">Open Menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Task actions</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => onAction('edit')}>
						<Pencil class="mr-2 size-4" />
						<span>Edit</span>
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => onAction('delete')}>
						<Trash2 class="mr-2 size-4" />
						<span>Delete</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
