<script lang="ts">
	import { ValeListSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button, Pagination, Select } from '#lib/components/ui/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, RefreshIcon, TicketIcon } from '#lib/icons/outline/index.ts';
	import type { ValeListItem } from '#lib/interfaces/index.ts';
	import ValeCard from './valeCard.svelte';
	import ValeTable from './valeTable.svelte';

	interface Props {
		/** Cada item trae el vale con su categoría y su negocio */
		vales: ValeListItem[];
		currentPage: number;
		totalPages: number;
		perPage: number;
		total: number;
		isLoading?: boolean;
		error?: string;
		isFiltered?: boolean;
		onPageChange: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
		onRetry?: () => void;
		onView: (item: ValeListItem) => void;
		/** Acciones opcionales: las que no se pasan no se muestran (según permisos) */
		onEdit?: (item: ValeListItem) => void;
		onDelete?: (item: ValeListItem) => void;
	}

	let {
		vales,
		currentPage,
		totalPages,
		perPage,
		total,
		isLoading = false,
		error = '',
		isFiltered = false,
		onPageChange,
		onPerPageChange,
		onRetry,
		onView,
		onEdit,
		onDelete
	}: Props = $props();

	function handlePerPageChange(event: Event & { currentTarget: HTMLSelectElement }) {
		onPerPageChange?.(Number(event.currentTarget.value));
	}

	const hasData = $derived(vales.length > 0);
	// Primera carga: sin datos previos que mostrar mientras llega la respuesta
	const isInitialLoading = $derived(isLoading && !hasData);
</script>

<section
	aria-busy={isLoading}
	class="mt-6 overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:border-dark-one_d dark:bg-dark-one"
>
	{#if error && !hasData}
		<div role="alert" class="flex flex-col items-center gap-3 px-4 py-12 text-center">
			<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
			<p class="text-sm text-light-two_d dark:text-dark-two_d">{error}</p>
			{#if onRetry}
				<Button variant="outline" size="sm" onclick={onRetry}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			{/if}
		</div>
	{:else if isInitialLoading}
		<ValeListSkeleton />
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
			<TicketIcon class="size-10 text-light-four dark:text-dark-four" />
			{#if isFiltered}
				<p class="font-medium text-light-two dark:text-dark-two">Sin resultados</p>
				<p class="text-sm text-light-two_d dark:text-dark-two_d">
					No hay vales que coincidan con los filtros seleccionados.
				</p>
			{:else}
				<p class="font-medium text-light-two dark:text-dark-two">No hay vales registrados</p>
				<p class="text-sm text-light-two_d dark:text-dark-two_d">
					Cuando se creen vales aparecerán aquí.
				</p>
			{/if}
		</div>
	{:else}
		{#if error}
			<div
				role="alert"
				class="flex items-start gap-2.5 border-b border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span class="flex-1">{error}</span>
				{#if onRetry}
					<button type="button" onclick={onRetry} class="font-medium underline underline-offset-2">
						Reintentar
					</button>
				{/if}
			</div>
		{/if}

		<div class={['transition-opacity', isLoading && 'pointer-events-none opacity-60']}>
			<!-- Móvil y tablet pequeña: tarjetas -->
			<div class="grid gap-3 p-3 sm:grid-cols-2 md:hidden">
				{#each vales as item (item.vale.id)}
					<ValeCard {item} {onView} {onEdit} {onDelete} />
				{/each}
			</div>

			<!-- Tablet y escritorio: tabla -->
			<div class="hidden md:block">
				<ValeTable {vales} {onView} {onEdit} {onDelete} />
			</div>
		</div>
		<div
			class="flex flex-col-reverse border-t border-light-one_d md:flex-row md:items-center dark:border-dark-one_d"
		>
			{#if onPerPageChange}
				<div
					class="flex items-center justify-center gap-2 px-4 pb-3 text-sm text-light-two_d md:pt-3 md:pr-0 md:pl-6 dark:text-dark-two_d"
				>
					<label for="vales-per-page" class="whitespace-nowrap">Mostrar</label>
					<Select
						id="vales-per-page"
						value={perPage}
						onchange={handlePerPageChange}
						disabled={isLoading}
						class="w-20"
					>
						{#each PAGINATION.PER_PAGE_OPTIONS as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</Select>
					<span class="whitespace-nowrap">por página</span>
				</div>
			{/if}

			<div class="min-w-0 flex-1">
				<Pagination {currentPage} {totalPages} {perPage} {total} {onPageChange} />
			</div>
		</div>
	{/if}
</section>
