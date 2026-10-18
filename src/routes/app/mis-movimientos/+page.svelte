<script lang="ts">
	import { onMount } from 'svelte';
	import {
		MiMovimientoList,
		MiMovimientoTipoTabs
	} from '#lib/components/features/app/misMovimientos/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import type { MiMovimientoListItem, MovimientoTipo } from '#lib/interfaces/index.ts';
	import { errorService, movimientoService } from '#lib/services/index.ts';

	let movimientos = $state<MiMovimientoListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let totalPages = $state(1);
	// null = todos los tipos
	let tipo = $state<MovimientoTipo | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	const hasMore = $derived(currentPage < totalPages);

	// Evita que una respuesta lenta (p. ej. de otra pestaña) pise a la más reciente
	let lastRequestId = 0;

	/** La primera página reemplaza la lista; las siguientes se agregan al final ("Ver más") */
	async function loadMovimientos(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await movimientoService.listMine({
				page,
				per_page: PAGINATION.DEFAULT_PER_PAGE,
				tipo
			});
			if (requestId !== lastRequestId) return;
			if (page === PAGINATION.DEFAULT_PAGE) {
				movimientos = response.data;
			} else {
				// Si llegó un movimiento nuevo entre páginas otro puede repetirse: se omite para no duplicar la key
				const listedIds = new Set(movimientos.map(({ movimiento }) => movimiento.id));
				movimientos = [
					...movimientos,
					...response.data.filter(({ movimiento }) => !listedIds.has(movimiento.id))
				];
			}
			currentPage = response.page;
			totalPages = Math.max(1, response.total_pages);
		} catch (error) {
			if (requestId !== lastRequestId) return;
			loadError = errorService.getMessage(error);
		} finally {
			if (requestId === lastRequestId) isLoading = false;
		}
	}

	function handleTipoChange(value: MovimientoTipo | null) {
		tipo = value;
		// Se limpia para que el listado muestre el esqueleto y no los movimientos de la pestaña anterior
		movimientos = [];
		currentPage = PAGINATION.DEFAULT_PAGE;
		totalPages = 1;
		loadMovimientos(PAGINATION.DEFAULT_PAGE);
	}

	// Con datos, lo que falló fue "Ver más"; sin datos, la primera carga
	function handleRetry() {
		loadMovimientos(movimientos.length > 0 ? currentPage + 1 : PAGINATION.DEFAULT_PAGE);
	}

	onMount(() => loadMovimientos(PAGINATION.DEFAULT_PAGE));
</script>

<MainLayout title="Mis movimientos">
	<MiMovimientoTipoTabs {tipo} onChange={handleTipoChange}>
		<MiMovimientoList
			{movimientos}
			{tipo}
			{hasMore}
			{isLoading}
			error={loadError}
			onLoadMore={() => loadMovimientos(currentPage + 1)}
			onRetry={handleRetry}
		/>
	</MiMovimientoTipoTabs>
</MainLayout>
