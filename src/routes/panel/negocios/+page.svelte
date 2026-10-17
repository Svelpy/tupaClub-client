<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		NegocioDeleteModal,
		NegocioDetailModal,
		NegocioFilters,
		NegocioFormModal,
		NegocioImageModal,
		NegocioList
	} from '#lib/components/features/panel/negocios/index.ts';
	import { SucursalFormModal } from '#lib/components/features/panel/sucursales/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { PlusIcon } from '#lib/icons/outline/index.ts';
	import type {
		Negocio,
		NegocioDetail,
		NegocioListItem,
		NegocioTipo,
		SucursalDetail
	} from '#lib/interfaces/index.ts';
	import { errorService, negocioService } from '#lib/services/index.ts';

	let items = $state<NegocioListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let tipo = $state<NegocioTipo | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');
	let isFormOpen = $state(false);
	// null = crear; con valor = editar ese negocio
	let editingNegocio = $state<Negocio | null>(null);
	let imageNegocio = $state<Negocio | null>(null);
	let deletingNegocio = $state<Negocio | null>(null);
	let sucursalNegocio = $state<Negocio | null>(null);
	// Se guarda el id para que el detalle refleje los cambios locales (imagen, sucursales nuevas)
	let viewingNegocioId = $state<string | null>(null);

	const viewingItem = $derived(
		viewingNegocioId ? (items.find((item) => item.negocio.id === viewingNegocioId) ?? null) : null
	);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadNegocios(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await negocioService.list({ page, per_page: perPage, tipo });
			if (requestId !== lastRequestId) return;
			items = response.data;
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

	// Al cambiar la cantidad por página o el filtro se vuelve a la primera página
	function handlePerPageChange(value: number) {
		perPage = value;
		loadNegocios(PAGINATION.DEFAULT_PAGE);
	}

	function handleTipoChange(value: NegocioTipo | null) {
		tipo = value;
		// Se limpia para que el listado muestre el esqueleto y no resultados del filtro anterior
		items = [];
		loadNegocios(PAGINATION.DEFAULT_PAGE);
	}

	function openCreate() {
		editingNegocio = null;
		isFormOpen = true;
	}

	function openEdit(negocio: Negocio) {
		editingNegocio = negocio;
		isFormOpen = true;
	}

	// Se actualiza la lista localmente para no volver a pedir el listado
	function handleSaved(negocio: NegocioDetail) {
		// Si hay un filtro de tipo distinto, el negocio no pertenece a esta vista
		const outOfFilter = !!tipo && negocio.tipo !== tipo;

		if (editingNegocio) {
			if (outOfFilter) {
				items = items.filter((item) => item.negocio.id !== negocio.id);
				total = Math.max(0, total - 1);
				totalPages = Math.max(1, Math.ceil(total / perPage));
			} else {
				handleImageUpdated(negocio);
			}
			return;
		}

		if (outOfFilter) return;
		// Un negocio recién creado aún no tiene sucursales
		items = [{ negocio: toNegocio(negocio), sucursales: [] }, ...items].slice(0, perPage);
		total += 1;
		totalPages = Math.max(1, Math.ceil(total / perPage));
	}

	function toNegocio({
		id,
		nombre,
		tipo,
		descripcion,
		telefono,
		image_url,
		created_at,
		updated_at
	}: NegocioDetail): Negocio {
		return { id, nombre, tipo, descripcion, telefono, image_url, created_at, updated_at };
	}

	// Reemplaza los datos del negocio conservando sus sucursales
	function handleImageUpdated(negocio: NegocioDetail) {
		const updated = toNegocio(negocio);
		items = items.map((item) =>
			item.negocio.id === updated.id ? { ...item, negocio: updated } : item
		);
	}

	function handleSucursalCreated(sucursal: SucursalDetail) {
		items = items.map((item) =>
			item.negocio.id === sucursal.negocio_id
				? { ...item, sucursales: [...item.sucursales, sucursal] }
				: item
		);
	}

	function handleDeleted({ id }: Negocio) {
		items = items.filter((item) => item.negocio.id !== id);
		total = Math.max(0, total - 1);
		totalPages = Math.max(1, Math.ceil(total / perPage));

		// Si la página quedó vacía (y no es la primera) se carga la anterior
		if (items.length === 0 && currentPage > 1) {
			loadNegocios(Math.min(currentPage - 1, totalPages));
		}
	}

	onMount(() => {
		loadNegocios(PAGINATION.DEFAULT_PAGE);
	});
</script>

<MainLayout title="Negocios" noIndex class="container mx-auto">
	<PageHeader title="Negocios">
		{#snippet actions()}
			<Button onclick={openCreate} class="w-full sm:w-auto">
				{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
				Nuevo negocio
			</Button>
		{/snippet}
	</PageHeader>

	<NegocioFilters {tipo} onTipoChange={handleTipoChange} />

	<NegocioList
		{items}
		{currentPage}
		{totalPages}
		{perPage}
		{total}
		{isLoading}
		error={loadError}
		isFiltered={!!tipo}
		onPageChange={loadNegocios}
		onPerPageChange={handlePerPageChange}
		onRetry={() => loadNegocios(currentPage)}
		onView={(negocio) => (viewingNegocioId = negocio.id)}
		onEdit={openEdit}
		onImage={(negocio) => (imageNegocio = negocio)}
		onDelete={(negocio) => (deletingNegocio = negocio)}
		onAddSucursal={(negocio) => (sucursalNegocio = negocio)}
	/>

	<!-- El detalle va antes que los demás modales para que estos se abran encima -->
	<NegocioDetailModal
		item={viewingItem}
		onClose={() => (viewingNegocioId = null)}
		onEdit={openEdit}
		onImage={(negocio) => (imageNegocio = negocio)}
		onAddSucursal={(negocio) => (sucursalNegocio = negocio)}
	/>

	<NegocioFormModal
		isOpen={isFormOpen}
		negocio={editingNegocio}
		onClose={() => (isFormOpen = false)}
		onSaved={handleSaved}
	/>

	<NegocioImageModal
		negocio={imageNegocio}
		onClose={() => (imageNegocio = null)}
		onUpdated={handleImageUpdated}
	/>

	<NegocioDeleteModal
		negocio={deletingNegocio}
		onClose={() => (deletingNegocio = null)}
		onDeleted={handleDeleted}
	/>

	<SucursalFormModal
		negocio={sucursalNegocio}
		onClose={() => (sucursalNegocio = null)}
		onCreated={handleSucursalCreated}
	/>
</MainLayout>
