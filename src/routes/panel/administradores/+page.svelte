<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader, Tabs } from '#lib/components/ui/index.ts';
	import {
		AdministradorDeleteModal,
		AdministradorDetailModal,
		AdministradorFormModal,
		AdministradorList
	} from '#lib/components/features/panel/administradores/index.ts';
	import { ClientePasswordModal } from '#lib/components/features/panel/clientes/index.ts';
	import { SucursalFilter } from '#lib/components/features/panel/sucursales/index.ts';
	import { Action, Module, type PanelUserRole } from '#lib/config/index.ts';
	import { PAGINATION, ROLE_PLURAL_LABEL } from '#lib/constants/index.ts';
	import { PlusIcon } from '#lib/icons/outline/index.ts';
	import type {
		Administrador,
		AdministradorDetail,
		NegocioListItem,
		SucursalConNegocio
	} from '#lib/interfaces/index.ts';
	import { administradorService, errorService, negocioService } from '#lib/services/index.ts';
	import { currentRole, currentUserStore } from '#lib/stores/index.ts';
	import {
		can,
		canManageUserRole,
		fetchAllPages,
		getAssignableUserRoles,
		getListableUserRoles
	} from '#lib/utils/index.ts';

	const canCreate = $derived(can($currentRole, Module.USUARIO, Action.CREATE));
	// Editar y restablecer contraseña son actualizaciones del usuario
	const canUpdate = $derived(can($currentRole, Module.USUARIO, Action.UPDATE));
	const canDelete = $derived(can($currentRole, Module.USUARIO, Action.DELETE));

	// Los CLIENTE nunca se listan aquí: cada pestaña filtra por uno de los roles visibles
	const listableRoles = $derived(getListableUserRoles($currentRole));
	const assignableRoles = $derived(getAssignableUserRoles($currentRole));
	const roleOptions = $derived(
		listableRoles.map((value) => ({ value, label: ROLE_PLURAL_LABEL[value] }))
	);
	const currentUserId = $derived($currentUserStore?.user.id ?? null);

	let administradores = $state<Administrador[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	// Pestaña activa; se fija al montar con el primer rol visible
	let role = $state<PanelUserRole | null>(null);
	let sucursalId = $state<string | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	// Opciones del filtro y del formulario; también resuelven el nombre de cada sucursal
	let negocios = $state<NegocioListItem[]>([]);
	let isLoadingOptions = $state(false);
	let optionsError = $state('');

	let isFormOpen = $state(false);
	// null = crear; con valor = editar ese usuario
	let editingAdministrador = $state<Administrador | null>(null);
	let viewingAdministrador = $state<Administrador | null>(null);
	let passwordAdministrador = $state<Administrador | null>(null);
	let deletingAdministrador = $state<Administrador | null>(null);

	// Todos los usuarios de una pestaña comparten rol: se gestionan solo si es inferior al propio
	const canManage = $derived(canManageUserRole($currentRole, role));
	// Al crear se preselecciona el rol de la pestaña si se puede asignar
	const defaultRole = $derived(assignableRoles.find((value) => value === role) ?? null);
	const roleLabel = $derived(role ? ROLE_PLURAL_LABEL[role] : '');

	const sucursalesById = $derived(
		new Map(
			negocios.flatMap(({ negocio, sucursales }) =>
				sucursales.map((sucursal): [string, SucursalConNegocio] => [
					sucursal.id,
					{ sucursal, negocio }
				])
			)
		)
	);

	const getSucursal = (administrador: Administrador | null) =>
		administrador?.sucursal_id ? sucursalesById.get(administrador.sucursal_id) : undefined;

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadAdministradores(page: number) {
		if (!role) return;
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await administradorService.list({
				page,
				per_page: perPage,
				role,
				sucursal_id: sucursalId
			});
			if (requestId !== lastRequestId) return;
			administradores = response.data;
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
			// El listado de negocios trae cada negocio junto a sus sucursales
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
		loadAdministradores(PAGINATION.DEFAULT_PAGE);
	}

	function applyFilters(next: { role?: PanelUserRole; sucursalId?: string | null }) {
		if (next.role !== undefined) role = next.role;
		if (next.sucursalId !== undefined) sucursalId = next.sucursalId;
		// Se limpia para que el listado muestre el esqueleto y no resultados del filtro anterior
		administradores = [];
		loadAdministradores(PAGINATION.DEFAULT_PAGE);
	}

	function openCreate() {
		editingAdministrador = null;
		isFormOpen = true;
	}

	function openEdit(administrador: Administrador) {
		editingAdministrador = administrador;
		isFormOpen = true;
	}

	// true si el usuario corresponde a la pestaña y al filtro de sucursal activos
	function matchesView(administrador: Administrador) {
		return administrador.role === role && (!sucursalId || administrador.sucursal_id === sucursalId);
	}

	function removeFromList(id: string) {
		administradores = administradores.filter((administrador) => administrador.id !== id);
		total = Math.max(0, total - 1);
		totalPages = Math.max(1, Math.ceil(total / perPage));

		// Página vacía con usuarios restantes: se recarga para traer los que se recorren
		if (administradores.length === 0 && total > 0) {
			loadAdministradores(Math.min(currentPage, totalPages));
		}
	}

	// Se actualiza la lista localmente para no volver a pedir el listado.
	// AdministradorDetail extiende Administrador, así que se guarda tal cual
	function handleSaved(saved: AdministradorDetail) {
		if (editingAdministrador) {
			// Si cambió de rol o de sucursal ya no pertenece a esta vista
			if (!matchesView(saved)) {
				removeFromList(saved.id);
				return;
			}
			administradores = administradores.map((administrador) =>
				administrador.id === saved.id ? saved : administrador
			);
			return;
		}

		if (matchesView(saved)) {
			// Nuevo: al inicio de la página actual
			administradores = [saved, ...administradores].slice(0, perPage);
			total += 1;
			totalPages = Math.max(1, Math.ceil(total / perPage));
			return;
		}

		// Creado con otro rol o sucursal: se abre su pestaña para que se vea
		const savedRole = listableRoles.find((value) => value === saved.role);
		if (savedRole) applyFilters({ role: savedRole, sucursalId: null });
	}

	function handleDeleted({ id }: Administrador) {
		removeFromList(id);
	}

	onMount(() => {
		role = listableRoles[0] ?? null;
		loadAdministradores(PAGINATION.DEFAULT_PAGE);
		loadOptions();
	});
</script>

{#snippet createButton()}
	<Button onclick={openCreate} class="w-full sm:w-auto">
		{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
		Nuevo usuario
	</Button>
{/snippet}

<MainLayout title="Administradores" noIndex class="container mx-auto">
	<PageHeader
		title="Administradores"
		actions={canCreate && assignableRoles.length > 0 ? createButton : undefined}
	/>

	{#if role}
		<Tabs
			id="administradores"
			label="Rol de los usuarios"
			options={roleOptions}
			value={role}
			onChange={(value) => applyFilters({ role: value })}
			count={isLoading ? null : total}
			class="mt-6"
		>
			{#snippet toolbar()}
				<SucursalFilter
					id="administradores-sucursal"
					{negocios}
					{sucursalId}
					{isLoadingOptions}
					{optionsError}
					onChange={(value) => applyFilters({ sucursalId: value })}
					onRetry={loadOptions}
				/>
			{/snippet}

			{#if !canManage && (canUpdate || canDelete)}
				<p
					role="note"
					class="mt-4 rounded-xl border border-light-three/15 bg-light-three/10 p-3 text-sm text-light-two dark:border-dark-three/15 dark:bg-dark-three/10 dark:text-dark-two"
				>
					Puedes ver a los {roleLabel.toLowerCase()}, pero no editarlos, restablecer su contraseña
					ni eliminarlos: solo se gestionan usuarios con un rol inferior al tuyo.
				</p>
			{/if}

			<AdministradorList
				{administradores}
				{sucursalesById}
				{currentUserId}
				{roleLabel}
				isFiltered={!!sucursalId}
				{currentPage}
				{totalPages}
				{perPage}
				{total}
				{isLoading}
				error={loadError}
				onPageChange={loadAdministradores}
				onPerPageChange={handlePerPageChange}
				onRetry={() => loadAdministradores(currentPage)}
				onView={(administrador) => (viewingAdministrador = administrador)}
				onEdit={canUpdate && canManage ? openEdit : undefined}
				onResetPassword={canUpdate && canManage
					? (administrador) => (passwordAdministrador = administrador)
					: undefined}
				onDelete={canDelete && canManage
					? (administrador) => (deletingAdministrador = administrador)
					: undefined}
			/>
		</Tabs>
	{/if}

	<AdministradorFormModal
		isOpen={isFormOpen}
		administrador={editingAdministrador}
		{assignableRoles}
		{defaultRole}
		{negocios}
		isLoadingNegocios={isLoadingOptions}
		onClose={() => (isFormOpen = false)}
		onSaved={handleSaved}
	/>

	<AdministradorDetailModal
		administrador={viewingAdministrador}
		sucursal={getSucursal(viewingAdministrador)}
		isCurrentUser={!!viewingAdministrador && viewingAdministrador.id === currentUserId}
		onClose={() => (viewingAdministrador = null)}
		onEdit={canUpdate && canManage ? openEdit : undefined}
	/>

	<!-- Mismo endpoint `/users/{id}/password` que los clientes -->
	<ClientePasswordModal
		cliente={passwordAdministrador}
		onClose={() => (passwordAdministrador = null)}
	/>

	<AdministradorDeleteModal
		administrador={deletingAdministrador}
		onClose={() => (deletingAdministrador = null)}
		onDeleted={handleDeleted}
	/>
</MainLayout>
