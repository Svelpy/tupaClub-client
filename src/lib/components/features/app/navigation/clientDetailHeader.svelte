<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { ChevronLeftIcon } from '#lib/icons/outline/index.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** Destino de "Atrás" si se entró directo a la página (sin historial dentro de la app) */
		backHref: string;
		/** Acciones a la derecha (p. ej. compartir) */
		actions?: Snippet;
	}

	let { title, backHref, actions }: Props = $props();

	// Con una página anterior en la app, "Atrás" vuelve en el historial y conserva su scroll
	let canGoBack = $state(false);
	afterNavigate(({ from }) => {
		canGoBack = !!from;
	});

	function handleBack(event: MouseEvent) {
		if (!canGoBack) return;
		event.preventDefault();
		history.back();
	}
</script>

<!--
	Cabecera de las páginas de detalle (pantalla apilada): en móvil reemplaza la cabecera y las
	pestañas del layout. Ocupa todo el ancho anulando el padding horizontal del contenedor.
-->
<header
	class="sticky top-0 z-30 -mx-4 border-b border-light-one_d bg-light-one/85 pt-[env(safe-area-inset-top)] backdrop-blur-lg md:static md:mx-0 md:border-0 md:bg-transparent md:pt-0 md:backdrop-blur-none dark:border-dark-one_d dark:bg-dark-one/85 md:dark:bg-transparent"
>
	<div
		class="flex h-14 items-center gap-1 px-1.5 md:h-auto md:flex-col md:items-start md:gap-3 md:px-0 md:pb-6"
	>
		<a
			href={backHref}
			onclick={handleBack}
			aria-label="Volver"
			class="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-light-three transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-90 md:-ml-2 md:size-auto md:gap-1 md:px-2 md:py-1 md:text-sm md:font-medium dark:text-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three/40"
		>
			<ChevronLeftIcon class="size-6 md:size-4" />
			<span class="hidden md:inline">Volver</span>
		</a>

		<div class="flex min-w-0 flex-1 items-center gap-2 md:w-full">
			<h1
				class="min-w-0 flex-1 truncate text-base font-semibold text-light-two md:text-2xl md:font-bold dark:text-dark-two"
			>
				{title}
			</h1>
			{#if actions}
				<div class="flex shrink-0 items-center gap-1 pr-1.5 md:pr-0">{@render actions()}</div>
			{/if}
		</div>
	</div>
</header>
