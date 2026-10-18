<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		ValeDeleteModal,
		ValeDetailModal,
		ValeFilters,
		ValeFormModal,
		ValeList
	} from '#lib/components/features/panel/vales/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { PlusIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria, Negocio, ValeDetail, ValeListItem } from '#lib/interfaces/index.ts';
	import {
		categoriaService,
		errorService,
		negocioService,
		valeService
	} from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { can, fetchAllPages } from '#lib/utils/index.ts';

	const canCreate = $derived(can($currentRole, Module.VALE, Action.CREATE));
	const canUpdate = $derived(can($currentRole, Module.VALE, Action.UPDATE));
	const canDelete = $derived(can($currentRole, Module.VALE, Action.DELETE));

	let vales = $state<ValeListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let categoriaId = $state<string | null>(null);
	let negocioId = $state<string | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	// Opciones de los filtros y del formulario; también arman el item tras crear o editar
	let categorias = $state<Categoria[]>([]);
	let negocios = $state<Negocio[]>([]);
	let isLoadingOptions = $state(false);
	let optionsError = $state('');

	let isFormOpen = $state(false);
	// null = crear; con valor = editar ese vale
	let editingVale = $state<ValeListItem | null>(null);
	let viewingVale = $state<ValeListItem | null>(null);
	let deletingVale = $state<ValeListItem | null>(null);

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

	function openCreate() {
		editingVale = null;
		isFormOpen = true;
	}

	function openEdit(item: ValeListItem) {
		editingVale = item;
		isFormOpen = true;
	}

	function removeFromList(id: string) {
		vales = vales.filter(({ vale }) => vale.id !== id);
		total = Math.max(0, total - 1);
		totalPages = Math.max(1, Math.ceil(total / perPage));

		// Página vacía con vales restantes: se recarga para traer los que se recorren
		if (vales.length === 0 && total > 0) loadVales(Math.min(currentPage, totalPages));
	}

	// Se actualiza la lista localmente para no volver a pedir el listado.
	// La respuesta trae solo el vale: su categoría y su negocio salen de las opciones cargadas
	function handleSaved(saved: ValeDetail) {
		const categoria = categorias.find(({ id }) => id === saved.categoria_id);
		const negocio = negocios.find(({ id }) => id === saved.negocio_id);
		if (!categoria || !negocio) {
			loadVales(currentPage);
			return;
		}

		const matchesFilters =
			(!categoriaId || saved.categoria_id === categoriaId) &&
			(!negocioId || saved.negocio_id === negocioId);

		if (editingVale) {
			// Si cambió de categoría o negocio puede salir del filtro activo
			if (!matchesFilters) {
				removeFromList(saved.id);
				return;
			}
			// La respuesta puede no traer image_url: se conserva la que se mostraba
			const previous = editingVale.vale;
			const vale = { image_url: previous.image_url, ...saved };
			vales = vales.map((item) =>
				item.vale.id === saved.id ? { vale, categoria, negocio } : item
			);
			return;
		}

		if (!matchesFilters) return;
		// Nuevo: al inicio de la página actual
		vales = [{ vale: saved, categoria, negocio }, ...vales].slice(0, perPage);
		total += 1;
		totalPages = Math.max(1, Math.ceil(total / perPage));
	}

	function handleDeleted({ vale }: ValeListItem) {
		removeFromList(vale.id);
	}

	onMount(() => {
		loadVales(PAGINATION.DEFAULT_PAGE);
		loadOptions();
	});
</script>

{#snippet createButton()}
	<Button onclick={openCreate} class="w-full sm:w-auto">
		{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
		Nuevo vale
	</Button>
{/snippet}

<MainLayout title="Vales" noIndex class="container mx-auto">
	<PageHeader title="Vales" actions={canCreate ? createButton : undefined} />

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
		onView={(item) => (viewingVale = item)}
		onEdit={canUpdate ? openEdit : undefined}
		onDelete={canDelete ? (item) => (deletingVale = item) : undefined}
	/>

	<ValeFormModal
		isOpen={isFormOpen}
		item={editingVale}
		{categorias}
		{negocios}
		{isLoadingOptions}
		onClose={() => (isFormOpen = false)}
		onSaved={handleSaved}
	/>

	<ValeDetailModal
		item={viewingVale}
		onClose={() => (viewingVale = null)}
		onEdit={canUpdate ? openEdit : undefined}
	/>

	<ValeDeleteModal
		item={deletingVale}
		onClose={() => (deletingVale = null)}
		onDeleted={handleDeleted}
	/>
</MainLayout>
