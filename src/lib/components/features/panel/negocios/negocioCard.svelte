<script lang="ts">
	import { ChevronDownIcon, PhoneIcon, PlusIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, Sucursal } from '#lib/interfaces/index.ts';
	import { formatDate, formatValue } from '#lib/utils/index.ts';
	import NegocioActions from './negocioActions.svelte';
	import NegocioAvatar from './negocioAvatar.svelte';
	import NegocioSucursales from './negocioSucursales.svelte';
	import NegocioTipoBadge from './negocioTipoBadge.svelte';

	interface Props {
		negocio: Negocio;
		sucursales: Sucursal[];
		onView: (negocio: Negocio) => void;
		onEdit: (negocio: Negocio) => void;
		onImage: (negocio: Negocio) => void;
		onDelete: (negocio: Negocio) => void;
		onAddSucursal: (negocio: Negocio) => void;
		onEditSucursal: (negocio: Negocio, sucursal: Sucursal) => void;
		onDeleteSucursal: (sucursal: Sucursal) => void;
	}

	let {
		negocio,
		sucursales,
		onView,
		onEdit,
		onImage,
		onDelete,
		onAddSucursal,
		onEditSucursal,
		onDeleteSucursal
	}: Props = $props();

	let isExpanded = $state(false);

	const panelId = $derived(`negocio-card-${negocio.id}-sucursales`);
	const sucursalesLabel = $derived(
		sucursales.length === 0
			? 'Sin sucursales'
			: `${sucursales.length} ${sucursales.length === 1 ? 'sucursal' : 'sucursales'}`
	);
</script>

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<NegocioAvatar {negocio} size="lg" />
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
				<h3 class="min-w-0 font-semibold text-light-two dark:text-dark-two">
					<button
						type="button"
						onclick={() => onView(negocio)}
						class="text-left hover:underline focus-visible:underline focus-visible:outline-none"
					>
						{negocio.nombre}
					</button>
				</h3>
				<NegocioTipoBadge tipo={negocio.tipo} />
			</div>
			<p class="mt-1 line-clamp-2 text-sm text-light-two_d dark:text-dark-two_d">
				{formatValue(negocio.descripcion)}
			</p>
			{#if negocio.telefono}
				<a
					href="tel:{negocio.telefono}"
					class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-light-three dark:text-dark-three"
				>
					<PhoneIcon class="size-4" />
					{negocio.telefono}
				</a>
			{/if}
		</div>
		<div class="-mt-1.5 -mr-2 shrink-0 self-start">
			<NegocioActions {negocio} {onView} {onEdit} {onImage} {onDelete} {onAddSucursal} />
		</div>
	</div>

	<!-- Sucursales plegables para no alargar la card -->
	<div class="rounded-lg border border-light-one_d dark:border-dark-one_d">
		<button
			type="button"
			onclick={() => (isExpanded = !isExpanded)}
			disabled={sucursales.length === 0}
			aria-expanded={isExpanded}
			aria-controls={panelId}
			class="flex min-h-10 w-full items-center justify-between gap-2 px-3 text-sm font-medium text-light-two transition-colors hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none disabled:cursor-default disabled:text-light-two_d disabled:hover:bg-transparent dark:text-dark-two dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three dark:disabled:text-dark-two_d"
		>
			{sucursalesLabel}
			{#if sucursales.length > 0}
				<ChevronDownIcon class="size-4 transition-transform {isExpanded ? 'rotate-180' : ''}" />
			{/if}
		</button>
		{#if isExpanded && sucursales.length > 0}
			<div id={panelId} class="border-t border-light-one_d p-2 dark:border-dark-one_d">
				<NegocioSucursales
					{sucursales}
					onEdit={(sucursal) => onEditSucursal(negocio, sucursal)}
					onDelete={onDeleteSucursal}
				/>
			</div>
		{/if}
	</div>

	<div class="mt-auto flex flex-col gap-2">
		<p class="text-xs text-light-two_d dark:text-dark-two_d">
			Creado el {formatDate(negocio.created_at)}
			{#if negocio.updated_at}
				· Actualizado el {formatDate(negocio.updated_at)}
			{/if}
		</p>
		<button
			type="button"
			onclick={() => onAddSucursal(negocio)}
			class="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-light-four text-sm font-medium text-light-two transition-colors hover:border-light-three hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:border-dark-four dark:text-dark-two dark:hover:border-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three"
		>
			<PlusIcon class="size-4" />
			Agregar sucursal
		</button>
	</div>
</article>
