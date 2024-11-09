<script lang="ts">
	import { siteConfig } from '$lib/config/site.js';
</script>

<footer>
	<div class="relative -top-[10px] h-8 text-center md:top-0">
		<p class="text-ellipsis text-nowrap text-center text-sm leading-loose text-muted-foreground">
			Built by
			<a
				href={siteConfig.links.github}
				target="_blank"
				rel="noreferrer"
				class="font-medium underline underline-offset-4"
			>
				Mantelis</a
			>.
		</p>
	</div>
</footer>
