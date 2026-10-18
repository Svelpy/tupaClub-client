<script lang="ts">
	import { onMount } from 'svelte';
	import { InicioShortcuts, ResumenPuntosCard } from '#lib/components/features/app/inicio/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { ResumenClienteSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, RefreshIcon } from '#lib/icons/outline/index.ts';
	import type { ResumenCliente } from '#lib/interfaces/index.ts';
	import { errorService, resumenService } from '#lib/services/index.ts';
	import { authStore } from '#lib/stores/index.ts';

	let resumen = $state<ResumenCliente | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	async function loadResumen() {
		loadError = '';
		isLoading = true;
		try {
			resumen = await resumenService.getCliente();
			// El saldo de la sesión (lo usa el detalle del vale) viene del login: se alinea con el resumen
			authStore.setPuntos(resumen.puntos);
		} catch (error) {
			loadError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadResumen);
</script>

<MainLayout title="Inicio">
	<div class="space-y-6">
		<p class="text-light-two_d dark:text-dark-two_d">
			Hola{resumen ? `, ${resumen.nombre}` : ''} 👋
		</p>

		{#if resumen}
			<ResumenPuntosCard {resumen} />
		{:else if loadError && !isLoading}
			<div
				role="alert"
				class="flex flex-col items-center gap-3 rounded-3xl border border-light-one_d bg-light-one px-4 py-10 text-center dark:border-dark-one_d dark:bg-dark-one"
			>
				<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
				<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
				<Button variant="outline" size="sm" onclick={loadResumen}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			</div>
		{:else}
			<ResumenClienteSkeleton />
		{/if}

		<InicioShortcuts />
	</div>
</MainLayout>
