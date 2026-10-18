<script lang="ts">
	import { onMount } from 'svelte';
	import {
		MiCanjeCodigoSheet,
		MiCanjeList,
		MiCanjeStatusTabs
	} from '#lib/components/features/app/misCanjes/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import type { CanjeStatus, MiCanjeListItem } from '#lib/interfaces/index.ts';
	import { canjeService, errorService } from '#lib/services/index.ts';

	let canjes = $state<MiCanjeListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let totalPages = $state(1);
	// Se abre en vigentes: son los que el cliente puede usar en caja
	let status = $state<CanjeStatus>('PENDIENTE');
	let isLoading = $state(false);
	let loadError = $state('');
	// "Ahora" común a toda la lista para decidir qué pendientes ya vencieron
	let now = $state(Date.now());
	// Canje cuyo código se muestra ampliado
	let selected = $state<MiCanjeListItem | null>(null);

	const hasMore = $derived(currentPage < totalPages);

	// Evita que una respuesta lenta (p. ej. de otra pestaña) pise a la más reciente
	let lastRequestId = 0;

	/** La primera página reemplaza la lista; las siguientes se agregan al final ("Ver más") */
	async function loadCanjes(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await canjeService.listMine({
				page,
				per_page: PAGINATION.DEFAULT_PER_PAGE,
				status
			});
			if (requestId !== lastRequestId) return;
			now = Date.now();
			if (page === PAGINATION.DEFAULT_PAGE) {
				canjes = response.data;
			} else {
				// Si cambió la lista entre páginas un canje puede repetirse: se omite para no duplicar la key
				const listedIds = new Set(canjes.map(({ canje }) => canje.id));
				canjes = [...canjes, ...response.data.filter(({ canje }) => !listedIds.has(canje.id))];
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

	function handleStatusChange(value: CanjeStatus) {
		status = value;
		// Se limpia para que el listado muestre el esqueleto y no los canjes de la pestaña anterior
		canjes = [];
		currentPage = PAGINATION.DEFAULT_PAGE;
		totalPages = 1;
		loadCanjes(PAGINATION.DEFAULT_PAGE);
	}

	// Con datos, lo que falló fue "Ver más"; sin datos, la primera carga
	function handleRetry() {
		loadCanjes(canjes.length > 0 ? currentPage + 1 : PAGINATION.DEFAULT_PAGE);
	}

	onMount(() => loadCanjes(PAGINATION.DEFAULT_PAGE));
</script>

<MainLayout title="Mis canjes">
	<MiCanjeStatusTabs {status} onChange={handleStatusChange}>
		<MiCanjeList
			{canjes}
			{now}
			{status}
			{hasMore}
			{isLoading}
			error={loadError}
			onLoadMore={() => loadCanjes(currentPage + 1)}
			onRetry={handleRetry}
			onShowCodigo={(item) => (selected = item)}
		/>
	</MiCanjeStatusTabs>

	<MiCanjeCodigoSheet item={selected} onClose={() => (selected = null)} />
</MainLayout>
