<script lang="ts">
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import {
		NegocioAvatar,
		NegocioSucursales,
		NegocioTipoBadge
	} from '#lib/components/features/panel/negocios/index.ts';
	import { ValeDetailSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button, Modal } from '#lib/components/ui/index.ts';
	import {
		AlertTriangleIcon,
		PencilIcon,
		PhoneIcon,
		RefreshIcon
	} from '#lib/icons/outline/index.ts';
	import type { ValeDetailResponse, ValeListItem } from '#lib/interfaces/index.ts';
	import { errorService, valeService } from '#lib/services/index.ts';
	import { formatCurrency, formatDateTime, formatNumber, formatValue } from '#lib/utils/index.ts';
	import ValeImage from './valeImage.svelte';

	interface Props {
		/** Vale del listado a detallar; null = modal cerrado */
		item: ValeListItem | null;
		onClose: () => void;
		/** Sin handler (el rol no puede editar) no se muestra el botón */
		onEdit?: (item: ValeListItem) => void;
	}

	let { item, onClose, onEdit }: Props = $props();

	let detail = $state<ValeDetailResponse | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');
	// Evita que el detalle de un vale abierto antes pise al actual
	let lastRequestId = 0;

	async function load(id: string) {
		const requestId = ++lastRequestId;
		detail = null;
		loadError = '';
		isLoading = true;
		try {
			const response = await valeService.get(id);
			if (requestId === lastRequestId) detail = response;
		} catch (error) {
			if (requestId === lastRequestId) loadError = errorService.getMessage(error);
		} finally {
			if (requestId === lastRequestId) isLoading = false;
		}
	}

	// Se consulta el detalle cada vez que se abre: trae las sucursales donde se canjea
	$effect(() => {
		if (item) load(item.vale.id);
	});

	function handleEdit() {
		if (!item || !onEdit) return;
		const target = item;
		onClose();
		onEdit(target);
	}
</script>

{#snippet sectionTitle(text: string)}
	<h4
		class="mb-3 text-xs font-semibold tracking-wide text-light-two_d uppercase dark:text-dark-two_d"
	>
		{text}
	</h4>
{/snippet}

<Modal
	isOpen={!!item}
	title="Detalle del vale"
	{onClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[40rem]"
>
	{#if isLoading}
		<ValeDetailSkeleton />
	{:else if loadError || !detail}
		<div role="alert" class="flex flex-col items-center gap-3 py-8 text-center">
			<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
			<p class="text-sm text-light-two_d dark:text-dark-two_d">
				{loadError || 'No se pudo cargar el vale.'}
			</p>
			{#if item}
				<Button variant="outline" size="sm" onclick={() => load(item.vale.id)}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			{/if}
		</div>
	{:else}
		{@const { vale, categoria, negocio, sucursales } = detail}
		<div class="space-y-6">
			<!-- Resumen: imagen, nombre, categoría y precio -->
			<div
				class="flex flex-col items-center gap-4 rounded-2xl border border-light-one_d bg-light-one_d/50 p-4 text-center sm:flex-row sm:text-left dark:border-dark-one_d dark:bg-dark-one_d/50"
			>
				<ValeImage {vale} size="lg" class="size-20" />
				<div class="min-w-0 flex-1">
					<p class="text-lg font-semibold break-words text-light-two dark:text-dark-two">
						{vale.nombre}
					</p>
					<p class="mt-0.5 text-sm text-light-two_d dark:text-dark-two_d">
						{formatValue(vale.descripcion, { fallback: 'Sin descripción' })}
					</p>
					<p class="mt-2 inline-flex items-center gap-2 text-sm text-light-two dark:text-dark-two">
						<CategoriaIcon iconNumber={categoria.icon_number} size="sm" />
						{categoria.nombre}
					</p>
				</div>
				<div
					class="shrink-0 rounded-xl bg-light-one px-5 py-3 text-center shadow-sm dark:bg-dark-one"
				>
					<p
						class="text-2xl leading-none font-bold text-light-three tabular-nums dark:text-dark-three"
					>
						{formatNumber(vale.total_puntos)}
					</p>
					<p class="mt-1 text-xs text-light-two_d dark:text-dark-two_d">puntos</p>
					<p class="mt-2 text-sm font-semibold text-light-two tabular-nums dark:text-dark-two">
						{formatCurrency(vale.total_costo)}
					</p>
				</div>
			</div>

			<section>
				{@render sectionTitle('Negocio')}
				<div class="flex items-center gap-3">
					<NegocioAvatar {negocio} />
					<div class="min-w-0 flex-1">
						<p
							class="flex flex-wrap items-center gap-2 font-medium text-light-two dark:text-dark-two"
						>
							{negocio.nombre}
							<NegocioTipoBadge tipo={negocio.tipo} />
						</p>
						{#if negocio.telefono}
							<a
								href="tel:{negocio.telefono}"
								class="inline-flex items-center gap-1 text-sm text-light-three hover:underline dark:text-dark-three"
							>
								<PhoneIcon class="size-4" />
								{negocio.telefono}
							</a>
						{/if}
					</div>
				</div>
			</section>

			<section>
				{@render sectionTitle(`Dónde se canjea (${sucursales.length})`)}
				<NegocioSucursales {sucursales} class="sm:grid-cols-2" />
			</section>

			<section>
				{@render sectionTitle('Registro')}
				<dl class="grid gap-3 text-sm sm:grid-cols-2">
					<div>
						<dt class="text-xs text-light-two_d dark:text-dark-two_d">Creado</dt>
						<dd class="text-light-two dark:text-dark-two">{formatDateTime(vale.created_at)}</dd>
					</div>
					<div>
						<dt class="text-xs text-light-two_d dark:text-dark-two_d">Última actualización</dt>
						<dd class="text-light-two dark:text-dark-two">{formatDateTime(vale.updated_at)}</dd>
					</div>
				</dl>
			</section>
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button variant="outline" onclick={onClose} class="w-full sm:w-auto">Cerrar</Button>
			{#if onEdit}
				<Button onclick={handleEdit} class="w-full sm:w-auto">
					{#snippet leftIcon()}<PencilIcon class="size-4" />{/snippet}
					Editar vale
				</Button>
			{/if}
		</div>
	{/snippet}
</Modal>
