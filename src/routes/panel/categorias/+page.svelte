<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		CategoriaDeleteModal,
		CategoriaFormModal,
		CategoriaList
	} from '#lib/components/features/panel/categorias/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { PlusIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria, CategoriaDetail } from '#lib/interfaces/index.ts';
	import { categoriaService, errorService } from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { can } from '#lib/utils/index.ts';

	const canCreate = $derived(can($currentRole, Module.CATEGORIA, Action.CREATE));
	const canUpdate = $derived(can($currentRole, Module.CATEGORIA, Action.UPDATE));
	const canDelete = $derived(can($currentRole, Module.CATEGORIA, Action.DELETE));

	let categorias = $state<Categoria[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let isLoading = $state(false);
	let loadError = $state('');
	let isFormOpen = $state(false);
	// null = crear; con valor = editar esa categoría
	let editingCategoria = $state<Categoria | null>(null);
	let deletingCategoria = $state<Categoria | null>(null);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadCategorias(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await categoriaService.list({ page, per_page: perPage });
			if (requestId !== lastRequestId) return;
			categorias = response.data;
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
		loadCategorias(PAGINATION.DEFAULT_PAGE);
	}

	function openCreate() {
		editingCategoria = null;
		isFormOpen = true;
	}

	function openEdit(categoria: Categoria) {
		editingCategoria = categoria;
		isFormOpen = true;
	}

	// Se actualiza la lista localmente para no volver a pedir el listado
	function handleSaved({ id, nombre, slug, icon_number, descripcion }: CategoriaDetail) {
		const saved: Categoria = { id, nombre, slug, icon_number, descripcion };

		if (editingCategoria) {
			categorias = categorias.map((categoria) => (categoria.id === id ? saved : categoria));
			return;
		}

		// Nueva: al inicio de la página actual
		categorias = [saved, ...categorias].slice(0, perPage);
		total += 1;
		totalPages = Math.max(1, Math.ceil(total / perPage));
	}

	function handleDeleted({ id }: Categoria) {
		categorias = categorias.filter((categoria) => categoria.id !== id);
		total = Math.max(0, total - 1);
		totalPages = Math.max(1, Math.ceil(total / perPage));

		// Si la página quedó vacía (y no es la primera) se carga la anterior
		if (categorias.length === 0 && currentPage > 1) {
			loadCategorias(Math.min(currentPage - 1, totalPages));
		}
	}

	onMount(() => {
		loadCategorias(PAGINATION.DEFAULT_PAGE);
	});
</script>

{#snippet createButton()}
	<Button onclick={openCreate} class="w-full sm:w-auto">
		{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
		Nueva categoría
	</Button>
{/snippet}

<MainLayout title="Categorías" noIndex class="container mx-auto">
	<PageHeader title="Categorías" actions={canCreate ? createButton : undefined} />

	<CategoriaList
		{categorias}
		{currentPage}
		{totalPages}
		{perPage}
		{total}
		{isLoading}
		error={loadError}
		onPageChange={loadCategorias}
		onPerPageChange={handlePerPageChange}
		onRetry={() => loadCategorias(currentPage)}
		onEdit={canUpdate ? openEdit : undefined}
		onDelete={canDelete ? (categoria) => (deletingCategoria = categoria) : undefined}
	/>

	<CategoriaFormModal
		isOpen={isFormOpen}
		categoria={editingCategoria}
		onClose={() => (isFormOpen = false)}
		onSaved={handleSaved}
	/>

	<CategoriaDeleteModal
		categoria={deletingCategoria}
		onClose={() => (deletingCategoria = null)}
		onDeleted={handleDeleted}
	/>
</MainLayout>
