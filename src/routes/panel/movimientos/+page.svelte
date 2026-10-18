<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { PageHeader } from '#lib/components/ui/index.ts';
	import {
		MovimientoFilters,
		MovimientoList,
		MovimientoTipoTabs
	} from '#lib/components/features/panel/movimientos/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import type { Cliente, MovimientoListItem, MovimientoTipo } from '#lib/interfaces/index.ts';
	import { errorService, movimientoService } from '#lib/services/index.ts';

	// Solo lectura: los movimientos los generan las compras, los canjes y los ajustes

	let movimientos = $state<MovimientoListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let tipo = $state<MovimientoTipo | null>(null);
	// Se elige desde un movimiento del listado; se guarda la persona para mostrar su nombre
	let cliente = $state<Cliente | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	const isFiltered = $derived(!!tipo || !!cliente);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadMovimientos(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await movimientoService.list({
				page,
				per_page: perPage,
				tipo,
				usuario_id: cliente?.id
			});
			if (requestId !== lastRequestId) return;
			movimientos = response.data;
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

	// Al cambiar la cantidad por página o un filtro se vuelve a la primera página
	function handlePerPageChange(value: number) {
		perPage = value;
		loadMovimientos(PAGINATION.DEFAULT_PAGE);
	}

	function applyFilters(next: { tipo?: MovimientoTipo | null; cliente?: Cliente | null }) {
		if (next.tipo !== undefined) tipo = next.tipo;
		if (next.cliente !== undefined) cliente = next.cliente;
		// Se limpia para que el listado muestre el esqueleto y no resultados del filtro anterior
		movimientos = [];
		loadMovimientos(PAGINATION.DEFAULT_PAGE);
	}

	onMount(() => {
		loadMovimientos(PAGINATION.DEFAULT_PAGE);
	});
</script>

<MainLayout title="Movimientos" noIndex class="container mx-auto">
	<PageHeader title="Movimientos" />

	<MovimientoTipoTabs
		{tipo}
		total={isLoading ? null : total}
		onChange={(value) => applyFilters({ tipo: value })}
	>
		<MovimientoFilters {cliente} onClearCliente={() => applyFilters({ cliente: null })} />

		<MovimientoList
			{movimientos}
			{isFiltered}
			{currentPage}
			{totalPages}
			{perPage}
			{total}
			{isLoading}
			error={loadError}
			onPageChange={loadMovimientos}
			onPerPageChange={handlePerPageChange}
			onRetry={() => loadMovimientos(currentPage)}
			onFilterCliente={cliente ? undefined : (item) => applyFilters({ cliente: item.cliente })}
		/>
	</MovimientoTipoTabs>
</MainLayout>
