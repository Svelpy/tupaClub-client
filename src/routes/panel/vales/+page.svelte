<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { PageHeader } from '#lib/components/ui/index.ts';
	import { ValeFilters, ValeList } from '#lib/components/features/panel/vales/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import type { Categoria, Negocio, Vale } from '#lib/interfaces/index.ts';
	import {
		categoriaService,
		errorService,
		negocioService,
		valeService
	} from '#lib/services/index.ts';
	import { fetchAllPages } from '#lib/utils/index.ts';

	let vales = $state<Vale[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let categoriaId = $state<string | null>(null);
	let negocioId = $state<string | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	// Opciones de los filtros; también resuelven los nombres que el vale solo trae como id
	let categorias = $state<Categoria[]>([]);
	let negocios = $state<Negocio[]>([]);
	let isLoadingOptions = $state(false);
	let optionsError = $state('');

	const categoriasById = $derived(new Map(categorias.map((item) => [item.id, item])));
	const negociosById = $derived(new Map(negocios.map((item) => [item.id, item])));

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadVales(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await valeService.list({
				page,
				per_page: perPage,
				categoria_id: categoriaId,
				negocio_id: negocioId
			});
			if (requestId !== lastRequestId) return;
			vales = response.data;
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
			[categorias, negocios] = await Promise.all([
				fetchAllPages((params) => categoriaService.list(params)),
				// El listado de negocios trae cada negocio junto a sus sucursales
				fetchAllPages((params) => negocioService.list(params)).then((items) =>
					items.map(({ negocio }) => negocio)
				)
			]);
		} catch (error) {
			optionsError = errorService.getMessage(error);
		} finally {
			isLoadingOptions = false;
		}
	}

	// Al cambiar la cantidad por página o un filtro se vuelve a la primera página
	function handlePerPageChange(value: number) {
		perPage = value;
		loadVales(PAGINATION.DEFAULT_PAGE);
	}

	function applyFilters(next: { categoriaId?: string | null; negocioId?: string | null }) {
		if (next.categoriaId !== undefined) categoriaId = next.categoriaId;
		if (next.negocioId !== undefined) negocioId = next.negocioId;
		// Se limpia para que el listado muestre el esqueleto y no resultados del filtro anterior
		vales = [];
		loadVales(PAGINATION.DEFAULT_PAGE);
	}

	onMount(() => {
		loadVales(PAGINATION.DEFAULT_PAGE);
		loadOptions();
	});
</script>

<MainLayout title="Vales" noIndex>
	<PageHeader
		title="Vales"
		description="Administra los vales que los clientes pueden canjear con sus puntos."
	/>

	<ValeFilters
		{categorias}
		{negocios}
		{categoriaId}
		{negocioId}
		{isLoadingOptions}
		{optionsError}
		onCategoriaChange={(value) => applyFilters({ categoriaId: value })}
		onNegocioChange={(value) => applyFilters({ negocioId: value })}
		onClear={() => applyFilters({ categoriaId: null, negocioId: null })}
		onRetryOptions={loadOptions}
	/>

	<ValeList
		{vales}
		{categoriasById}
		{negociosById}
		{currentPage}
		{totalPages}
		{perPage}
		{total}
		{isLoading}
		error={loadError}
		isFiltered={!!categoriaId || !!negocioId}
		onPageChange={loadVales}
		onPerPageChange={handlePerPageChange}
		onRetry={() => loadVales(currentPage)}
	/>
</MainLayout>
