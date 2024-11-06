<script lang="ts" module>
	export type ConfirmDialogProps = {
		isOpen: boolean;
		onOpenChange: (isOpen: boolean) => void;
		onConfirm: () => void;
		title: string;
		message: string;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog';

	let { isOpen, onOpenChange, onConfirm, title, message }: ConfirmDialogProps = $props();
</script>

<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{message}
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<div class="flex flex-row gap-2">
				<Button variant="default" onclick={onConfirm}>
					Confirm
				</Button>
				<Button variant="secondary" onclick={() => onOpenChange(false)}>
					Cancel
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>