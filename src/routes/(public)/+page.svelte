<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { GanttChartSquare, ListTodo, Wallet } from 'lucide-svelte';
</script>

<div class="container flex h-full w-full items-center justify-center p-4 py-10">
	<main class="flex h-full w-full flex-col items-center overflow-auto text-center">
		<div class="m-auto px-2">
			<div>
				<h1 class="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Welcome to <span class="text-cyan-300">The</span> Task Manager
				</h1>
				<p class="mb-8 text-xl text-muted-foreground">
					Streamline your workflow, boost productivity, and collaborate seamlessly.
				</p>
				<div class="mb-16 flex justify-center space-x-4">
					<Button href="/login" variant="default">Login</Button>
					<Button href="/signup" variant="outline">Sign Up</Button>
				</div>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<Card class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
					<CardHeader class="text-center">
						<GanttChartSquare class="mx-auto mb-4 h-12 w-12 text-primary" />
						<CardTitle class="mb-2 text-2xl">Project Management</CardTitle>
						<CardDescription class="text-lg"
							>Organize and track your projects with ease
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-center">
							Create, assign, and monitor tasks across multiple projects. Stay on top of deadlines
							and milestones.
						</p>
					</CardContent>
				</Card>

				<Card class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
					<CardHeader class="text-center">
						<ListTodo class="mx-auto mb-4 h-12 w-12 text-primary" />
						<CardTitle class="mb-2 text-2xl">Task Prioritization</CardTitle>
						<CardDescription class="text-lg">Focus on what matters most</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-center">
							Prioritize tasks, set due dates, and categorize your work. Never miss an important
							deadline again.
						</p>
					</CardContent>
				</Card>

				<Card class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
					<CardHeader class="text-center">
						<Wallet class="mx-auto mb-4 h-12 w-12 text-primary" />
						<CardTitle class="mb-2 text-2xl">Free to Use</CardTitle>
						<CardDescription class="text-lg">Powerful tools at no cost</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-center">
							Enjoy all the features of Task Master completely free. No hidden fees, no credit card
							required.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	</main>
</div>
