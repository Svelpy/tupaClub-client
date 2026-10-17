<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Header, Sidebar } from '#lib/components/ui/index.ts';
	import { PANEL_NAVIGATION } from '#lib/config/navigation.config.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { filterNavigation, findActiveNavItem, getHomeRoute } from '#lib/utils/index.ts';

	let { children } = $props();

	const SIDEBAR_ID = 'panel-sidebar';
	let sidebarOpen = $state(false);

	// Solo las páginas que el rol puede abrir
	const navigation = $derived(filterNavigation(PANEL_NAVIGATION, $currentRole));
	const homeHref = $derived(resolve($currentRole ? getHomeRoute($currentRole) : '/panel'));
	const title = $derived(findActiveNavItem(navigation, page.url.pathname)?.label ?? 'Panel');
</script>

<div class="min-h-dvh bg-light-one_d/40 dark:bg-dark-one">
	<Sidebar id={SIDEBAR_ID} sections={navigation} {homeHref} bind:open={sidebarOpen} />

	<div class="flex min-h-dvh flex-col lg:pl-64">
		<Header
			{title}
			{sidebarOpen}
			sidebarId={SIDEBAR_ID}
			onToggleSidebar={() => (sidebarOpen = !sidebarOpen)}
		/>
		<main class="flex-1 px-4 py-6 md:px-6 lg:px-8">
			{@render children()}
		</main>
	</div>
</div>
