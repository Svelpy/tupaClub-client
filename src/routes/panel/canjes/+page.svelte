<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button, PageHeader } from '#lib/components/ui/index.ts';
	import {
		CanjeCancelModal,
		CanjeList,
		CanjeRedeemModal,
		CanjeStatusTabs,
		CanjeVencidosBanner
	} from '#lib/components/features/panel/canjes/index.ts';
	import { SucursalFilter } from '#lib/components/features/panel/sucursales/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { StopwatchIcon, TicketIcon } from '#lib/icons/outline/index.ts';
	import type {
		Canje,
		CanjeDetail,
		CanjeListItem,
		CanjeStatus,
		NegocioListItem
	} from '#lib/interfaces/index.ts';
	import { canjeService, errorService, negocioService } from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { alert, can, fetchAllPages, isCanjeVencido } from '#lib/utils/index.ts';

	// Confirmar, cancelar y expirar cambian el estado del canje
	const canUpdate = $derived(can($currentRole, Module.CANJE, Action.UPDATE));

	let canjes = $state<CanjeListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let perPage = $state<number>(PAGINATION.DEFAULT_PER_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	// Se abre en pendientes: son los que esperan una acción
	let status = $state<CanjeStatus | null>('PENDIENTE');
	let sucursalId = $state<string | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');
	// "Ahora" común a toda la lista para decidir qué pendientes ya vencieron
	let now = $state(Date.now());

	// Opciones del filtro de sucursal: el listado de negocios trae sus sucursales
	let negocios = $state<NegocioListItem[]>([]);
	let isLoadingOptions = $state(false);
	let optionsError = $state('');

	let isRedeemOpen = $state(false);
	let cancellingCanje = $state<CanjeListItem | null>(null);
	let isExpiring = $state(false);

	const vencidosCount = $derived(canjes.filter(({ canje }) => isCanjeVencido(canje, now)).length);

	// Evita que una respuesta lenta de una página anterior pise a la más reciente
	let lastRequestId = 0;

	async function loadCanjes(page: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await canjeService.list({
				page,
				per_page: perPage,
				status,
				sucursal_id: sucursalId
			});
			if (requestId !== lastRequestId) return;
			now = Date.now();
			canjes = response.data;
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
		loadCanjes(PAGINATION.DEFAULT_PAGE);
	}

	function applyFilters(next: { status?: CanjeStatus | null; sucursalId?: string | null }) {
		if (next.status !== undefined) status = next.status;
		if (next.sucursalId !== undefined) sucursalId = next.sucursalId;
		// Se limpia para que el listado muestre el esqueleto y no resultados del filtro anterior
		canjes = [];
		loadCanjes(PAGINATION.DEFAULT_PAGE);
	}

	function toCanje({
		id,
		cliente_id,
		vale_id,
		config_punto_id,
		codigo_canje,
		referencia,
		status,
		total_costo,
		total_puntos,
		expires_at,
		created_at,
		updated_at
	}: CanjeDetail): Canje {
		return {
			id,
			cliente_id,
			vale_id,
			config_punto_id,
			codigo_canje,
			referencia,
			status,
			total_costo,
			total_puntos,
			expires_at,
			created_at,
			updated_at
		};
	}

	// Tras confirmar o cancelar se actualiza la lista localmente para no volver a pedirla
	function handleCanjeUpdated(updated: CanjeDetail) {
		const isListed = canjes.some(({ canje }) => canje.id === updated.id);

		if (!isListed) {
			// Corresponde a esta pestaña pero no se tiene su vale (p. ej. confirmado desde "Canjeados")
			if (status === updated.status) loadCanjes(PAGINATION.DEFAULT_PAGE);
			return;
		}

		// Ya no pertenece a la pestaña (p. ej. un pendiente que se confirmó o se canceló)
		if (status && updated.status !== status) {
			canjes = canjes.filter(({ canje }) => canje.id !== updated.id);
			total = Math.max(0, total - 1);
			totalPages = Math.max(1, Math.ceil(total / perPage));

			// Página vacía con canjes restantes: se recarga para traer los que se recorren
			if (canjes.length === 0 && total > 0) loadCanjes(Math.min(currentPage, totalPages));
			return;
		}

		canjes = canjes.map((item) =>
			item.canje.id === updated.id ? { ...item, canje: toCanje(updated) } : item
		);
	}

	async function handleExpire() {
		if (isExpiring) return;
		isExpiring = true;
		try {
			const { expired_count } = await canjeService.expire();
			if (expired_count === 0) {
				alert('info', 'No había canjes vencidos por expirar.');
				return;
			}
			alert(
				'success',
				expired_count === 1
					? 'Se marcó 1 canje vencido como expirado.'
					: `Se marcaron ${expired_count} canjes vencidos como expirados.`
			);
			loadCanjes(PAGINATION.DEFAULT_PAGE);
		} catch (error) {
			alert('error', errorService.getMessage(error), { duration: 4000 });
		} finally {
			isExpiring = false;
		}
	}

	onMount(() => {
		loadCanjes(PAGINATION.DEFAULT_PAGE);
		loadOptions();
	});
</script>

{#snippet headerActions()}
	<Button variant="outline" onclick={handleExpire} loading={isExpiring} class="w-full sm:w-auto">
		{#snippet leftIcon()}<StopwatchIcon class="size-5" />{/snippet}
		Expirar vencidos
	</Button>
	<Button onclick={() => (isRedeemOpen = true)} class="w-full sm:w-auto">
		{#snippet leftIcon()}<TicketIcon class="size-5" />{/snippet}
		Confirmar canje
	</Button>
{/snippet}

<MainLayout title="Canjes" noIndex class="container mx-auto">
	<PageHeader title="Canjes" actions={canUpdate ? headerActions : undefined} />

	<CanjeStatusTabs
		{status}
		total={isLoading ? null : total}
		onChange={(value) => applyFilters({ status: value })}
	>
		{#snippet toolbar()}
			<SucursalFilter
				id="canjes-sucursal"
				{negocios}
				{sucursalId}
				{isLoadingOptions}
				{optionsError}
				onChange={(value) => applyFilters({ sucursalId: value })}
				onRetry={loadOptions}
			/>
		{/snippet}

		{#if canUpdate && vencidosCount > 0}
			<CanjeVencidosBanner count={vencidosCount} {isExpiring} onExpire={handleExpire} />
		{/if}

		<CanjeList
			{canjes}
			{now}
			{status}
			isFiltered={!!sucursalId}
			{currentPage}
			{totalPages}
			{perPage}
			{total}
			{isLoading}
			error={loadError}
			onPageChange={loadCanjes}
			onPerPageChange={handlePerPageChange}
			onRetry={() => loadCanjes(currentPage)}
			onCancel={canUpdate ? (item) => (cancellingCanje = item) : undefined}
		/>
	</CanjeStatusTabs>

	<CanjeRedeemModal
		isOpen={isRedeemOpen}
		onClose={() => (isRedeemOpen = false)}
		onRedeemed={handleCanjeUpdated}
	/>

	<CanjeCancelModal
		item={cancellingCanje}
		onClose={() => (cancellingCanje = null)}
		onCancelled={handleCanjeUpdated}
	/>
</MainLayout>
