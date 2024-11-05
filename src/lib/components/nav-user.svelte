<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { User } from 'lucide-svelte';
	import LogoutButton from './logout-button.svelte';

	let {
		username,
		roles
	}: {
		id: string;
		username: string;
		roles: string[];
	} = $props();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<User />
			<div class="grid flex-1 text-left text-sm leading-tight">
				<span class="truncate font-semibold">{username}</span>
				<span class="truncate text-xs">{roles.join(',')}</span>
			</div>

			<LogoutButton />
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
