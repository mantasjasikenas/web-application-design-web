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

<div class="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
	<main class="text-center max-w-4xl">
		<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
			Welcome to <span class="text-cyan-300">The</span> Task Manager
		</h1>
		<p class="text-xl text-muted-foreground mb-8">
			Streamline your workflow, boost productivity, and collaborate seamlessly.
		</p>
		<div class="flex justify-center space-x-4 mb-16">
			<Button href="/login" variant="default">Login</Button>
			<Button href="/signup" variant="outline">Sign Up</Button>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			<Card class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
				<CardHeader class="text-center">
					<GanttChartSquare class="w-12 h-12 mb-4 text-primary mx-auto" />
					<CardTitle class="text-2xl mb-2">Project Management</CardTitle>
					<CardDescription class="text-lg"
						>Organize and track your projects with ease</CardDescription
					>
				</CardHeader>
				<CardContent>
					<p class="text-center">
						Create, assign, and monitor tasks across multiple projects. Stay on top of deadlines and
						milestones.
					</p>
				</CardContent>
			</Card>

			<Card class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
				<CardHeader class="text-center">
					<ListTodo class="w-12 h-12 mb-4 text-primary mx-auto" />
					<CardTitle class="text-2xl mb-2">Task Prioritization</CardTitle>
					<CardDescription class="text-lg">Focus on what matters most</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-center">
						Prioritize tasks, set due dates, and categorize your work. Never miss an important
						deadline again.
					</p>
				</CardContent>
			</Card>

			<Card class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
				<CardHeader class="text-center">
					<Wallet class="w-12 h-12 mb-4 text-primary mx-auto" />
					<CardTitle class="text-2xl mb-2">Free to Use</CardTitle>
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
	</main>
</div>
