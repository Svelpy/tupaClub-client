<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';
	import { ClientTabBar, ClientTopNav } from '#lib/components/features/app/navigation/index.ts';
	import { CLIENT_NAVIGATION } from '#lib/config/navigation.config.ts';

	let { children } = $props();

	const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)', false);

	// Página raíz (una pestaña): muestra cabecera y pestañas. Las de detalle traen su propia cabecera
	const rootItem = $derived(CLIENT_NAVIGATION.find((item) => item.href === page.url.pathname));

	// Transición suave entre páginas, como en una app nativa (si el navegador la soporta)
	onNavigate((navigation) => {
		if (!document.startViewTransition || reducedMotion.current) return;
		return new Promise((done) => {
			document.startViewTransition(async () => {
				done();
				await navigation.complete;
			});
		});
	});
</script>

<div class="min-h-dvh bg-light-one_d/40 dark:bg-dark-one_d/40">
	<ClientTopNav items={CLIENT_NAVIGATION} mobile={!!rootItem} />

	<main
		class={[
			'mx-auto w-full max-w-6xl px-4 md:px-6 md:pt-8 md:pb-12',
			// En móvil se deja lugar para las pestañas fijas y la zona segura inferior
			rootItem ? 'pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]' : 'pb-8'
		]}
	>
		{#if rootItem}
			<!-- En móvil la pestaña activa ya indica la página: el título queda para lectores de pantalla -->
			<h1 class="mb-6 text-2xl font-bold text-light-two max-md:sr-only dark:text-dark-two">
				{rootItem.label}
			</h1>
		{/if}
		{@render children()}
	</main>

	{#if rootItem}
		<ClientTabBar items={CLIENT_NAVIGATION} />
	{/if}
</div>
