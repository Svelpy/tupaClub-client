<script lang="ts">
	import { untrack, type Component } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		ClientBottomAction,
		ClientDetailHeader
	} from '#lib/components/features/app/navigation/index.ts';
	import {
		CanjeExitosoSheet,
		ValeCanjeConfirmSheet,
		ValeSaldoStatus,
		ValeSucursalesSheet
	} from '#lib/components/features/app/vales/index.ts';
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { ValeDetailPageSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button, Image } from '#lib/components/ui/index.ts';
	import { CANJE_REFERENCIA_APP, CANJE_VIGENCIA_DIAS } from '#lib/constants/index.ts';
	import {
		AlertTriangleIcon,
		BuildindStoreIcon,
		CalendarIcon,
		ChevronRightIcon,
		MapPinIcon,
		PhoneIcon,
		RefreshIcon,
		TicketIcon
	} from '#lib/icons/outline/index.ts';
	import type { CanjeDetail, ValeDetailResponse } from '#lib/interfaces/index.ts';
	import { canjeService, errorService, valeService } from '#lib/services/index.ts';
	import { authStore, currentUserStore } from '#lib/stores/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	// Siempre viene en esta ruta; el tipo de SvelteKit lo declara opcional
	const valeId = $derived(page.params.valeId ?? '');

	let detail = $state<ValeDetailResponse | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');
	// El vale no existe o se eliminó: reintentar no sirve
	let notFound = $state(false);

	let isSucursalesOpen = $state(false);
	let isConfirmOpen = $state(false);
	let isCanjeando = $state(false);
	let canjeError = $state('');
	// Canje recién creado: abre el sheet de éxito
	let canje = $state<CanjeDetail | null>(null);

	const saldo = $derived($currentUserStore?.user.puntos ?? 0);
	const alcanza = $derived(detail !== null && saldo >= detail.vale.total_puntos);
	const backHref = $derived(
		detail
			? resolve('/app/categorias/[categoriaId]', { categoriaId: detail.vale.categoria_id })
			: resolve('/app/categorias')
	);

	let lastRequestId = 0;

	async function loadVale(id: string) {
		const requestId = ++lastRequestId;
		loadError = '';
		notFound = false;
		isLoading = true;
		try {
			const response = await valeService.get(id);
			if (requestId !== lastRequestId) return;
			detail = response;
		} catch (error) {
			if (requestId !== lastRequestId) return;
			notFound = errorService.fromUnknown(error).status === 404;
			loadError = notFound ? 'Este vale ya no está disponible.' : errorService.getMessage(error);
		} finally {
			if (requestId === lastRequestId) isLoading = false;
		}
	}

	$effect(() => {
		const id = valeId;
		untrack(() => {
			detail = null;
			loadVale(id);
		});
	});

	function openConfirm() {
		canjeError = '';
		isConfirmOpen = true;
	}

	async function confirmarCanje() {
		if (!detail) return;
		canjeError = '';
		isCanjeando = true;
		try {
			const saldoAnterior = saldo;
			canje = await canjeService.create({
				vale_id: detail.vale.id,
				referencia: CANJE_REFERENCIA_APP
			});
			isConfirmOpen = false;
			// El saldo del header baja al instante; luego se confirma con el del servidor
			authStore.setPuntos(Math.max(0, saldoAnterior - canje.total_puntos));
			authStore.refreshUser();
		} catch (error) {
			canjeError = errorService.getMessage(error);
		} finally {
			isCanjeando = false;
		}
	}
</script>

<MainLayout title={detail?.vale.nombre ?? 'Detalle del vale'}>
	<ClientDetailHeader title="Detalle del vale" {backHref} />

	{#if loadError && !detail}
		<div
			role="alert"
			class="mt-4 flex flex-col items-center gap-3 rounded-3xl border border-light-one_d bg-light-one px-4 py-12 text-center md:mt-0 dark:border-dark-one_d dark:bg-dark-one"
		>
			<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
			<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
			{#if notFound}
				<Button variant="outline" size="sm" href={resolve('/app/categorias')}>
					Ver otros vales
				</Button>
			{:else}
				<Button variant="outline" size="sm" onclick={() => loadVale(valeId)}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			{/if}
		</div>
	{:else if !detail || isLoading}
		<ValeDetailPageSkeleton />
	{:else}
		{@const { vale, categoria, negocio, sucursales } = detail}

		<div class="mt-4 grid gap-6 md:mt-0 md:grid-cols-2 md:gap-8 lg:gap-12">
			<!-- Imagen: fija al costado en escritorio mientras se lee el detalle -->
			<div class="md:sticky md:top-24 md:self-start">
				<div
					class="flex items-center justify-center overflow-hidden rounded-3xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
				>
					{#if vale.image_url}
						<Image objectFit="fill" src={vale.image_url} alt="Imagen de {vale.nombre}" />
					{:else}
						<TicketIcon class="size-20 opacity-60" />
					{/if}
				</div>
			</div>

			<div class="space-y-6">
				<div class="space-y-3">
					<a
						href={resolve('/app/categorias/[categoriaId]', { categoriaId: categoria.id })}
						class="inline-flex items-center gap-1.5 rounded-full bg-light-one_d py-1 pr-3 pl-1 text-xs font-semibold text-light-three transition-colors hover:bg-light-one_d/60 dark:bg-dark-one_d dark:text-dark-three dark:hover:bg-dark-one_d/60"
					>
						<CategoriaIcon
							iconNumber={categoria.icon_number}
							size="sm"
							class="size-6 rounded-full bg-light-one text-sm dark:bg-dark-one"
						/>
						{categoria.nombre}
					</a>

					<h2
						class="text-2xl leading-tight font-bold text-light-two md:text-3xl dark:text-dark-two"
					>
						{vale.nombre}
					</h2>

					<div class="flex items-center gap-2.5">
						<span
							class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
						>
							{#if negocio.image_url}
								<Image src={negocio.image_url} alt="" />
							{:else}
								<BuildindStoreIcon class="size-5" />
							{/if}
						</span>
						<div class="min-w-0">
							<p class="truncate font-semibold text-light-two dark:text-dark-two">
								{negocio.nombre}
							</p>
							<p class="text-xs text-light-two_d dark:text-dark-two_d">Comercio afiliado</p>
						</div>
					</div>
				</div>

				<ValeSaldoStatus puntos={vale.total_puntos} {saldo} />

				{#if vale.descripcion}
					<section aria-labelledby="vale-descripcion" class="space-y-1.5">
						<h3
							id="vale-descripcion"
							class="text-sm font-semibold text-light-two dark:text-dark-two"
						>
							Descripción
						</h3>
						<p class="text-sm whitespace-pre-line text-light-two_d dark:text-dark-two_d">
							{vale.descripcion}
						</p>
					</section>
				{/if}

				<section aria-labelledby="vale-condiciones" class="space-y-2">
					<h3 id="vale-condiciones" class="text-sm font-semibold text-light-two dark:text-dark-two">
						Antes de canjear
					</h3>
					<ul
						class="divide-y divide-light-one_d rounded-2xl border border-light-one_d bg-light-one dark:divide-dark-one_d dark:border-dark-one_d dark:bg-dark-one"
					>
						<li class="flex gap-3 p-4">
							{@render infoIcon(CalendarIcon)}
							<div>
								<p class="text-sm font-semibold text-light-two dark:text-dark-two">
									Tiempo de validez del voucher
								</p>
								<p class="text-sm text-light-two_d dark:text-dark-two_d">
									Válido por {CANJE_VIGENCIA_DIAS} días a partir del canje.
								</p>
							</div>
						</li>
						<li class="flex gap-3 p-4">
							{@render infoIcon(TicketIcon)}
							<div>
								<p class="text-sm font-semibold text-light-two dark:text-dark-two">Cómo usarlo</p>
								<p class="text-sm text-light-two_d dark:text-dark-two_d">
									Al canjear recibirás un código único. Preséntalo en la sucursal para recibir tu
									vale.
								</p>
							</div>
						</li>
						<li class="p-4">
							<div class="flex gap-3">
								{@render infoIcon(MapPinIcon)}
								<div>
									<p class="text-sm font-semibold text-light-two dark:text-dark-two">
										Dónde canjear
									</p>
									<p class="text-sm text-light-two_d dark:text-dark-two_d">
										{#if sucursales.length > 0}
											En {sucursales.length}
											{sucursales.length === 1 ? 'sucursal' : 'sucursales'} de {negocio.nombre}.
										{:else}
											{negocio.nombre} aún no registró sus sucursales.
										{/if}
									</p>
								</div>
							</div>
							{#if sucursales.length > 0}
								<button
									type="button"
									onclick={() => (isSucursalesOpen = true)}
									class="mt-3 flex h-11 w-full items-center justify-between gap-2 rounded-xl bg-light-one_d/60 px-4 text-sm font-semibold text-light-three transition-colors hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-[0.98] dark:bg-dark-one_d/60 dark:text-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three/40"
								>
									<span class="inline-flex items-center gap-2">
										<MapPinIcon class="size-4" />
										Ver dónde canjear
									</span>
									<ChevronRightIcon class="size-4" />
								</button>
							{/if}
						</li>
					</ul>
				</section>

				{#if negocio.descripcion || negocio.telefono}
					<section aria-labelledby="vale-negocio" class="space-y-1.5">
						<h3 id="vale-negocio" class="text-sm font-semibold text-light-two dark:text-dark-two">
							Sobre {negocio.nombre}
						</h3>
						{#if negocio.descripcion}
							<p class="text-sm text-light-two_d dark:text-dark-two_d">{negocio.descripcion}</p>
						{/if}
						{#if negocio.telefono}
							<a
								href="tel:{negocio.telefono}"
								class="inline-flex items-center gap-1.5 text-sm font-medium text-light-three hover:underline dark:text-dark-three"
							>
								<PhoneIcon class="size-4" />
								{negocio.telefono}
							</a>
						{/if}
					</section>
				{/if}

				<ClientBottomAction>
					<Button size="lg" fullWidth disabled={!alcanza} onclick={openConfirm}>
						{#if alcanza}
							Canjear por {formatNumber(vale.total_puntos)} pts
						{:else}
							Te faltan {formatNumber(vale.total_puntos - saldo)} pts
						{/if}
					</Button>
				</ClientBottomAction>
			</div>
		</div>

		<ValeSucursalesSheet
			open={isSucursalesOpen}
			{negocio}
			{sucursales}
			onClose={() => (isSucursalesOpen = false)}
		/>
		<ValeCanjeConfirmSheet
			open={isConfirmOpen}
			{vale}
			{negocio}
			{saldo}
			loading={isCanjeando}
			error={canjeError}
			onConfirm={confirmarCanje}
			onClose={() => (isConfirmOpen = false)}
		/>
		<CanjeExitosoSheet {canje} {vale} {negocio} onClose={() => (canje = null)} />
	{/if}
</MainLayout>

{#snippet infoIcon(Icon: Component<{ class?: string }>)}
	<span
		class="flex size-10 shrink-0 items-center justify-center rounded-full bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
	>
		<Icon class="size-5" />
	</span>
{/snippet}
