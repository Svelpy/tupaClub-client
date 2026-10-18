<script lang="ts">
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import { ChevronDownIcon, PlusIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, Sucursal } from '#lib/interfaces/index.ts';
	import { formatDate, formatDateTime, formatValue } from '#lib/utils/index.ts';
	import NegocioActions from './negocioActions.svelte';
	import NegocioAvatar from './negocioAvatar.svelte';
	import NegocioSucursales from './negocioSucursales.svelte';
	import NegocioTipoBadge from './negocioTipoBadge.svelte';

	interface Props {
		negocio: Negocio;
		sucursales: Sucursal[];
		/** Columnas de la tabla, para que la fila de sucursales ocupe todo el ancho */
		colspan: number;
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
		colspan,
		onView,
		onEdit,
		onImage,
		onDelete,
		onAddSucursal,
		onEditSucursal,
		onDeleteSucursal
	}: Props = $props();

	let isExpanded = $state(false);

	const panelId = $derived(`negocio-${negocio.id}-sucursales`);
	const sucursalesLabel = $derived(
		`${sucursales.length} ${sucursales.length === 1 ? 'sucursal' : 'sucursales'}`
	);
</script>

<TableRow
	class={[
		'border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50',
		isExpanded && 'border-b-0 bg-light-one_d/50 dark:bg-dark-one_d/50'
	]}
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<NegocioAvatar {negocio} />
			<div class="min-w-0">
				<button
					type="button"
					onclick={() => onView(negocio)}
					class="block max-w-full truncate text-left font-medium text-light-two hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-two"
				>
					{negocio.nombre}
				</button>
				<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
					{formatValue(negocio.descripcion)}
				</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3">
		<NegocioTipoBadge tipo={negocio.tipo} />
	</TableCell>
	<TableCell
		class="hidden px-4 py-3 text-sm whitespace-nowrap text-light-two lg:table-cell dark:text-dark-two"
	>
		{#if negocio.telefono}
			<a href="tel:{negocio.telefono}" class="hover:underline">{negocio.telefono}</a>
		{:else}
			{formatValue(negocio.telefono)}
		{/if}
	</TableCell>
	<TableCell class="px-4 py-3">
		{#if sucursales.length > 0}
			<button
				type="button"
				onclick={() => (isExpanded = !isExpanded)}
				aria-expanded={isExpanded}
				aria-controls={panelId}
				class="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-medium whitespace-nowrap text-light-three transition-colors hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:text-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three"
			>
				{sucursalesLabel}
				<ChevronDownIcon class="size-4 transition-transform {isExpanded ? 'rotate-180' : ''}" />
			</button>
		{:else}
			<span class="px-2 text-sm text-light-two_d dark:text-dark-two_d">Sin sucursales</span>
		{/if}
	</TableCell>
	<TableCell class="hidden px-4 py-3 xl:table-cell">
		<p class="text-sm whitespace-nowrap text-light-two dark:text-dark-two">
			{formatDateTime(negocio.updated_at ?? negocio.created_at)}
		</p>
		<p class="text-xs whitespace-nowrap text-light-two_d dark:text-dark-two_d">
			Creado el {formatDate(negocio.created_at)}
		</p>
	</TableCell>
	<TableCell class="px-2 py-3">
		<div class="flex items-center justify-end gap-1">
			<button
				type="button"
				onclick={() => onAddSucursal(negocio)}
				title="Agregar sucursal a {negocio.nombre}"
				aria-label="Agregar sucursal a {negocio.nombre}"
				class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-light-four px-2.5 text-sm font-medium text-light-two transition-colors hover:border-light-three hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 lg:px-3 dark:border-dark-four dark:text-dark-two dark:hover:border-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three"
			>
				<PlusIcon class="size-4" />
				<span class="hidden lg:inline">Sucursal</span>
			</button>
			<NegocioActions {negocio} {onView} {onEdit} {onImage} {onDelete} {onAddSucursal} />
		</div>
	</TableCell>
</TableRow>

{#if isExpanded}
	<TableRow
		id={panelId}
		class="border-light-one_d bg-light-one_d/50 hover:bg-light-one_d/50 dark:border-dark-one_d dark:bg-dark-one_d/50 dark:hover:bg-dark-one_d/50"
	>
		<TableCell {colspan} class="px-4 pt-0 pb-4">
			<p
				class="mb-2 text-xs font-semibold tracking-wide text-light-two_d uppercase dark:text-dark-two_d"
			>
				Sucursales de {negocio.nombre}
			</p>
			<NegocioSucursales
				{sucursales}
				onEdit={(sucursal) => onEditSucursal(negocio, sucursal)}
				onDelete={onDeleteSucursal}
				class="lg:grid-cols-2 xl:grid-cols-3"
			/>
		</TableCell>
	</TableRow>
{/if}
