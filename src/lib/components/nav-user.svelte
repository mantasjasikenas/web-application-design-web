<script lang="ts">
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import Bell from 'lucide-svelte/icons/bell';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { User } from 'lucide-svelte';
	import LogoutButton from './logout-button.svelte';

	let {
		id,
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
