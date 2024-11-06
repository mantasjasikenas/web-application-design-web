<script lang="ts" module>
	export type ErrorProps = {
		status?: number;
		message: string;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { fly, fade, scale } from 'svelte/transition';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { AlertCircle } from 'lucide-svelte';

	let { status, message }: ErrorProps = $props();

	const getErrorTitle = (status: number | undefined): string => {
		switch (status) {
			case 404:
				return 'Page Not Found';
			case 403:
				return 'Forbidden';
			case 500:
				return 'Internal Server Error';
			default:
				return 'Oops! Something went wrong';
		}
	};
</script>

<div
	class="flex h-full items-center justify-center bg-gradient-to-br from-background to-secondary/5"
>
	<div in:fade={{ duration: 300 }}>
		<Card class="w-full max-w-md overflow-hidden shadow-lg">
			<div in:fly={{ y: 50, duration: 500, delay: 300 }}>
				<CardHeader>
					<div class="flex items-center justify-center">
						<div in:scale={{ duration: 300, delay: 600 }}>
							<AlertCircle class="size-14 animate-pulse text-destructive duration-1000" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div class="flex flex-col items-center text-center">
						<div class="text-center text-xl font-bold">
							{getErrorTitle(status)}
						</div>

						{#if status}
							<p class="text-xl font-semibold">
								{status}
							</p>
						{/if}
						<p class="text-muted-foreground">
							{message}
						</p>
					</div>
				</CardContent>
				<CardFooter class="flex justify-center">
					<div in:fly={{ y: 20, duration: 300, delay: 900 }}>
						<Button
							variant="outline"
							onclick={() => goto('/app')}
							class="mt-4 transition-all duration-300 hover:scale-105"
						>
							Return to Home
						</Button>
					</div>
				</CardFooter>
			</div>
		</Card>
	</div>
</div>
