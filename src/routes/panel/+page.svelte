<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import {
		CanjesPendientesCard,
		ClientesResumenCard,
		PanelShortcuts,
		RegistrarCompraCard,
		ResumenHoyCard,
		TopValesCard
	} from '#lib/components/features/panel/inicio/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { ResumenAdminSkeleton, ResumenCajeroSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button, PageHeader, StatTile } from '#lib/components/ui/index.ts';
	import { PANEL_NAVIGATION } from '#lib/config/navigation.config.ts';
	import {
		AlertTriangleIcon,
		GiftIcon,
		ShoppingCartIcon,
		SparklesIcon,
		WalletIcon
	} from '#lib/icons/outline/index.ts';
	import type { ResumenAdmin, ResumenCajero } from '#lib/interfaces/index.ts';
	import { errorService, resumenService } from '#lib/services/index.ts';
	import { currentRole, currentUserStore } from '#lib/stores/index.ts';
	import {
		canAccessRoute,
		canViewResumenAdmin,
		canViewResumenCajero,
		filterNavigation,
		formatCurrency,
		formatDateLong,
		formatNumber
	} from '#lib/utils/index.ts';

	// Cada rol tiene su resumen: OWNER y ADMIN el del negocio, CAJERO el de sus propias compras.
	// SUPERADMIN (y cualquier otro) ve el inicio sin resumen
	const vista = $derived.by(() => {
		if (canViewResumenAdmin($currentRole)) return 'admin';
		if (canViewResumenCajero($currentRole)) return 'cajero';
		return null;
	});
	// El cajero ya tiene la tarjeta "Registrar una compra" en su resumen: no se repite en el encabezado
	const canRegistrarCompra = $derived(
		vista !== 'cajero' && canAccessRoute($currentRole, '/panel/registrar-compra')
	);
	const navigation = $derived(filterNavigation(PANEL_NAVIGATION, $currentRole));
	const saludo = $derived(`Hola${$currentUserStore ? `, ${$currentUserStore.user.nombre}` : ''}.`);

	let resumenAdmin = $state<ResumenAdmin | null>(null);
	let resumenCajero = $state<ResumenCajero | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');

	const fecha = $derived(resumenAdmin?.fecha ?? resumenCajero?.fecha ?? null);
	const hasData = $derived(resumenAdmin !== null || resumenCajero !== null);

	// Evita que una respuesta lenta pise a la de un "Actualizar" posterior
	let lastRequestId = 0;

	async function loadResumen() {
		if (!vista) return;
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			if (vista === 'admin') {
				const response = await resumenService.getAdmin();
				if (requestId === lastRequestId) resumenAdmin = response;
			} else {
				const response = await resumenService.getCajero();
				if (requestId === lastRequestId) resumenCajero = response;
			}
		} catch (error) {
			if (requestId !== lastRequestId) return;
			loadError = errorService.getMessage(error);
		} finally {
			if (requestId === lastRequestId) isLoading = false;
		}
	}

	onMount(loadResumen);

	const description = $derived.by(() => {
		if (!vista) return `${saludo} ¿Qué quieres hacer hoy?`;
		if (!fecha) return `${saludo} Resumen de la actividad de puntos y canjes.`;
		if (vista === 'cajero') return `${saludo} Tus compras registradas el ${formatDateLong(fecha)}.`;
		return `${saludo} Este es el resumen del ${formatDateLong(fecha)}.`;
	});

	// Indicadores del mes: cada uno con un dato de contexto debajo
	const tilesMes = $derived.by(() => {
		if (!resumenAdmin) return [];
		const { hoy, mes } = resumenAdmin.operaciones;
		const promedio = mes.cantidad > 0 ? Number(mes.total_compra) / mes.cantidad : null;
		return [
			{
				label: 'Ventas',
				value: formatCurrency(mes.total_compra),
				caption:
					promedio === null ? 'Sin compras todavía' : `${formatCurrency(promedio)} por compra`,
				icon: WalletIcon
			},
			{
				label: 'Compras',
				value: formatNumber(mes.cantidad),
				caption: `${formatNumber(hoy.cantidad)} hoy`,
				icon: ShoppingCartIcon
			},
			{
				label: 'Puntos otorgados',
				value: formatNumber(mes.puntos_otorgados),
				caption: `${formatNumber(hoy.puntos_otorgados)} hoy`,
				icon: SparklesIcon
			},
			{
				label: 'Canjes',
				value: formatNumber(resumenAdmin.canjes.mes.cantidad),
				caption: `${formatNumber(resumenAdmin.canjes.mes.puntos)} pts canjeados`,
				icon: GiftIcon
			}
		];
	});
</script>

<MainLayout title="Inicio" noIndex>
	<PageHeader
		title="Inicio"
		{description}
		actions={vista || canRegistrarCompra ? actions : undefined}
	/>

	<div class="mt-6 space-y-8">
		{#if vista}
			{#if hasData}
				<div class="space-y-6" aria-busy={isLoading}>
					{#if loadError}
						<!-- Falló un "Actualizar": se siguen mostrando los datos anteriores -->
						<div
							role="alert"
							class="flex items-start gap-2 rounded-xl border border-light-error/25 bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error/25 dark:bg-dark-error/10 dark:text-dark-error"
						>
							<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
							<span class="flex-1">{loadError}</span>
						</div>
					{/if}

					{#if resumenAdmin}
						<!-- grid-cols-1 = minmax(0, 1fr): sin esto el texto truncado ensancha la columna en móvil -->
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<ResumenHoyCard
								title="Ventas registradas hoy"
								operaciones={resumenAdmin.operaciones.hoy}
								canjes={resumenAdmin.canjes.hoy}
								class="lg:col-span-2"
							/>
							<CanjesPendientesCard pendientes={resumenAdmin.canjes.pendientes} />
						</div>

						<section aria-labelledby="resumen-mes" class="space-y-3">
							<h2 id="resumen-mes" class="font-semibold text-light-two dark:text-dark-two">
								Este mes
							</h2>
							<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
								{#each tilesMes as tile (tile.label)}
									<StatTile {...tile} />
								{/each}
							</div>
						</section>

						<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<TopValesCard vales={resumenAdmin.top_vales_mes} class="lg:col-span-2" />
							<ClientesResumenCard clientes={resumenAdmin.clientes} />
						</div>
					{:else if resumenCajero}
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<ResumenHoyCard
								title="Tus ventas de hoy"
								operaciones={resumenCajero.operaciones_hoy}
								class="lg:col-span-2"
							/>
							<RegistrarCompraCard />
						</div>
					{/if}
				</div>
			{:else if loadError && !isLoading}
				<div
					role="alert"
					class="flex flex-col items-center gap-3 rounded-2xl border border-light-one_d bg-light-one px-4 py-12 text-center dark:border-dark-one_d dark:bg-dark-one"
				>
					<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
					<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
					<!-- <Button variant="outline" size="sm" onclick={loadResumen}>
						{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
						Reintentar
					</Button> -->
				</div>
			{:else if vista === 'admin'}
				<ResumenAdminSkeleton />
			{:else}
				<ResumenCajeroSkeleton />
			{/if}
		{/if}

		<PanelShortcuts {navigation} />
	</div>
</MainLayout>

{#snippet actions()}
	<!-- {#if vista}
		<Button variant="outline" size="sm" loading={isLoading} onclick={loadResumen}>
			{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
			Actualizar
		</Button>
	{/if} -->
	{#if canRegistrarCompra}
		<Button size="sm" href={resolve('/panel/registrar-compra')}>
			{#snippet leftIcon()}<ShoppingCartIcon class="size-4" />{/snippet}
			Registrar compra
		</Button>
	{/if}
{/snippet}
