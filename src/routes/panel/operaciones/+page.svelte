<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		OperacionFilters,
		OperacionList
	} from '#lib/components/features/panel/operaciones/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { ShoppingCartIcon } from '#lib/icons/outline/index.ts';
	import type {
		Administrador,
		Cliente,
		NegocioListItem,
		OperacionListItem
	} from '#lib/interfaces/index.ts';
	import { errorService, negocioService, operacionService } from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { can, fetchAllPages } from '#lib/utils/index.ts';

	// Registrar una compra crea una operación
	const canCreate = $derived(can($currentRole, Module.OPERACION, Action.CREATE));

	let operaciones = $state<OperacionListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let sucursalId = $state<string | null>(null);
	// Se eligen desde una operación del listado; se guarda la persona para mostrar su nombre
	let receptor = $state<Cliente | null>(null);
	let emisor = $state<Administrador | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	// Opciones del filtro de sucursal: el listado de negocios trae sus sucursales
	let negocios = $state<NegocioListItem[]>([]);
	let isLoadingOptions = $state(false);
	let optionsError = $state('');

	const isFiltered = $derived(!!sucursalId || !!receptor || !!emisor);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadOperaciones(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await operacionService.list({
				page,
				per_page: perPage,
				sucursal_id: sucursalId,
				receptor_id: receptor?.id,
				emisor_id: emisor?.id
			});
			if (requestId !== lastRequestId) return;
			operaciones = response.data;
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

	async function loadOptions() {
		optionsError = '';
		isLoadingOptions = true;
		try {
			negocios = await fetchAllPages((params) => negocioService.list(params));
		} catch (error) {
			optionsError = errorService.getMessage(error);
		} finally {
			isLoadingOptions = false;
		}
	}

	// Al cambiar la cantidad por página o un filtro se vuelve a la primera página
	function handlePerPageChange(value: number) {
		perPage = value;
		loadOperaciones(PAGINATION.DEFAULT_PAGE);
	}

	function applyFilters(next: {
		sucursalId?: string | null;
		receptor?: Cliente | null;
		emisor?: Administrador | null;
	}) {
		if (next.sucursalId !== undefined) sucursalId = next.sucursalId;
		if (next.receptor !== undefined) receptor = next.receptor;
		if (next.emisor !== undefined) emisor = next.emisor;
		// Se limpia para que el listado muestre el esqueleto y no resultados del filtro anterior
		operaciones = [];
		loadOperaciones(PAGINATION.DEFAULT_PAGE);
	}

	onMount(() => {
		loadOperaciones(PAGINATION.DEFAULT_PAGE);
		loadOptions();
	});
</script>

{#snippet createButton()}
	<Button href={resolve('/panel/registrar-compra')} class="w-full sm:w-auto">
		{#snippet leftIcon()}<ShoppingCartIcon class="size-5" />{/snippet}
		Registrar compra
	</Button>
{/snippet}

<MainLayout title="Operaciones" noIndex class="container mx-auto">
	<PageHeader title="Operaciones" actions={canCreate ? createButton : undefined} />

	<OperacionFilters
		{negocios}
		{sucursalId}
		{receptor}
		{emisor}
		{isLoadingOptions}
		{optionsError}
		onSucursalChange={(value) => applyFilters({ sucursalId: value })}
		onClearReceptor={() => applyFilters({ receptor: null })}
		onClearEmisor={() => applyFilters({ emisor: null })}
		onClear={() => applyFilters({ sucursalId: null, receptor: null, emisor: null })}
		onRetryOptions={loadOptions}
	/>

	<OperacionList
		{operaciones}
		{isFiltered}
		{currentPage}
		{totalPages}
		{perPage}
		{total}
		{isLoading}
		error={loadError}
		onPageChange={loadOperaciones}
		onPerPageChange={handlePerPageChange}
		onRetry={() => loadOperaciones(currentPage)}
		onFilterReceptor={receptor ? undefined : (item) => applyFilters({ receptor: item.receptor })}
		onFilterEmisor={emisor ? undefined : (item) => applyFilters({ emisor: item.emisor })}
	/>
</MainLayout>
