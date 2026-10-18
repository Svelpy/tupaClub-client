<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		ClienteDeleteModal,
		ClienteDetailModal,
		ClienteFormModal,
		ClienteList,
		ClienteOrderTabs,
		ClientePasswordModal
	} from '#lib/components/features/panel/clientes/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { PlusIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente, ClienteDetail } from '#lib/interfaces/index.ts';
	import { clienteService, errorService } from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { can } from '#lib/utils/index.ts';

	const canCreate = $derived(can($currentRole, Module.USUARIO, Action.CREATE));
	// Editar y restablecer contraseña son actualizaciones del usuario
	const canUpdate = $derived(can($currentRole, Module.USUARIO, Action.UPDATE));
	const canDelete = $derived(can($currentRole, Module.USUARIO, Action.DELETE));

	let clientes = $state<Cliente[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let orderByPoints = $state(false);
	let isLoading = $state(false);
	let loadError = $state('');
	let isFormOpen = $state(false);
	// null = crear; con valor = editar ese cliente
	let editingCliente = $state<Cliente | null>(null);
	let viewingCliente = $state<Cliente | null>(null);
	let deletingCliente = $state<Cliente | null>(null);
	let passwordCliente = $state<Cliente | null>(null);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadClientes(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await clienteService.list({
				page,
				per_page: perPage,
				order_by_points: orderByPoints
			});
			if (requestId !== lastRequestId) return;
			clientes = response.data;
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
		loadClientes(PAGINATION.DEFAULT_PAGE);
	}

	function handleOrderChange(value: boolean) {
		orderByPoints = value;
		// Se limpia para que el listado muestre el esqueleto y no el orden anterior
		clientes = [];
		loadClientes(PAGINATION.DEFAULT_PAGE);
	}

	function openCreate() {
		editingCliente = null;
		isFormOpen = true;
	}

	function openEdit(cliente: Cliente) {
		editingCliente = cliente;
		isFormOpen = true;
	}

	// Se actualiza la lista localmente para no volver a pedir el listado.
	// ClienteDetail extiende Cliente, así que se guarda tal cual (is_deleted no se usa en la lista)
	function handleSaved(saved: ClienteDetail) {
		if (editingCliente) {
			clientes = clientes.map((cliente) => (cliente.id === saved.id ? saved : cliente));
			return;
		}

		// En el ranking su posición depende de los puntos: se recarga la página
		if (orderByPoints) {
			loadClientes(currentPage);
			return;
		}

		// Nuevo: al inicio de la página actual
		clientes = [saved, ...clientes].slice(0, perPage);
		total += 1;
		totalPages = Math.max(1, Math.ceil(total / perPage));
	}

	function handleDeleted({ id }: Cliente) {
		clientes = clientes.filter((cliente) => cliente.id !== id);
		total = Math.max(0, total - 1);
		totalPages = Math.max(1, Math.ceil(total / perPage));

		// Si la página quedó vacía (y no es la primera) se carga la anterior
		if (clientes.length === 0 && currentPage > 1) {
			loadClientes(Math.min(currentPage - 1, totalPages));
		}
	}

	onMount(() => {
		loadClientes(PAGINATION.DEFAULT_PAGE);
	});
</script>

{#snippet createButton()}
	<Button onclick={openCreate} class="w-full sm:w-auto">
		{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
		Nuevo cliente
	</Button>
{/snippet}

<MainLayout title="Clientes" noIndex class="container mx-auto">
	<PageHeader title="Clientes" actions={canCreate ? createButton : undefined} />

	<ClienteOrderTabs {orderByPoints} total={isLoading ? null : total} onChange={handleOrderChange}>
		<ClienteList
			{clientes}
			{currentPage}
			{totalPages}
			{perPage}
			{total}
			{isLoading}
			error={loadError}
			onPageChange={loadClientes}
			onPerPageChange={handlePerPageChange}
			onRetry={() => loadClientes(currentPage)}
			onView={(cliente) => (viewingCliente = cliente)}
			onEdit={canUpdate ? openEdit : undefined}
			onResetPassword={canUpdate ? (cliente) => (passwordCliente = cliente) : undefined}
			onDelete={canDelete ? (cliente) => (deletingCliente = cliente) : undefined}
		/>
	</ClienteOrderTabs>

	<ClienteFormModal
		isOpen={isFormOpen}
		cliente={editingCliente}
		onClose={() => (isFormOpen = false)}
		onSaved={handleSaved}
	/>

	<ClienteDetailModal
		cliente={viewingCliente}
		onClose={() => (viewingCliente = null)}
		onEdit={canUpdate ? openEdit : undefined}
	/>

	<ClientePasswordModal cliente={passwordCliente} onClose={() => (passwordCliente = null)} />

	<ClienteDeleteModal
		cliente={deletingCliente}
		onClose={() => (deletingCliente = null)}
		onDeleted={handleDeleted}
	/>
</MainLayout>
