<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import { LogOut } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	const logout = async () => {
		const logoutResponse = await auth.logout();

		if (logoutResponse.success) {
			toast.success('Logout successful');
			goto('/login');
		} else {
			toast.error(logoutResponse.message);
		}
	};
</script>

<Button type="button" onclick={logout} variant="ghost" size="icon" class={cn('h-7 w-7')}>
	<LogOut class="h-[1.2rem] w-[1.2rem]" />

	<span class="sr-only">Logout</span>
</Button>
