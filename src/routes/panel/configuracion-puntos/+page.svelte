<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		ConfigPuntosFormModal,
		ConfigPuntosList
	} from '#lib/components/features/panel/configPuntos/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { PlusIcon } from '#lib/icons/outline/index.ts';
	import type { ConfigPuntos } from '#lib/interfaces/index.ts';
	import { configPuntosService, errorService } from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { can } from '#lib/utils/index.ts';

	const canCreate = $derived(can($currentRole, Module.CONFIG_PUNTOS, Action.CREATE));

	let configs = $state<ConfigPuntos[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let isLoading = $state(false);
	let loadError = $state('');
	let isFormOpen = $state(false);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadConfigs(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await configPuntosService.list({ page, per_page: perPage });
			if (requestId !== lastRequestId) return;
			configs = response.data;
			currentPage = response.page;
			perPage = response.per_page;
			totalPages = Math.max(1, response.total_pages);
			total = response.total;
		} catch (error) {
			if (requestId !== lastRequestId) return;
			loadError = errorService.getMessage(error);
		} finally {
			if (requestId === lastRequestId) isLoading = false;
		}
	}

	// Al cambiar la cantidad por página se vuelve a la primera para no pedir una página inexistente
	function handlePerPageChange(value: number) {
		perPage = value;
		loadConfigs(PAGINATION.DEFAULT_PAGE);
	}

	// La nueva pasa a ser la ACTIVE y la anterior queda INACTIVE: se recarga la página 1
	// para que el estado de todo el historial venga de la API
	function handleSaved() {
		loadConfigs(PAGINATION.DEFAULT_PAGE);
	}

	onMount(() => {
		loadConfigs(PAGINATION.DEFAULT_PAGE);
	});
</script>

{#snippet createButton()}
	<Button onclick={() => (isFormOpen = true)} class="w-full sm:w-auto">
		{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
		Nueva configuración
	</Button>
{/snippet}

<MainLayout title="Configuración de puntos" noIndex class="container mx-auto">
	<PageHeader title="Configuración de puntos" actions={canCreate ? createButton : undefined} />

	<ConfigPuntosList
		{configs}
		{currentPage}
		{totalPages}
		{perPage}
		{total}
		{isLoading}
		error={loadError}
		onPageChange={loadConfigs}
		onPerPageChange={handlePerPageChange}
		onRetry={() => loadConfigs(currentPage)}
	/>

	<ConfigPuntosFormModal
		isOpen={isFormOpen}
		onClose={() => (isFormOpen = false)}
		onSaved={handleSaved}
	/>
</MainLayout>
