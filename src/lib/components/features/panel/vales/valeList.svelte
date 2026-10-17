<script lang="ts">
	import { Button, Pagination, Select } from '#lib/components/ui/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, RefreshIcon, TicketIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria, Negocio, Vale } from '#lib/interfaces/index.ts';
	import ValeCard from './valeCard.svelte';
	import ValeTable from './valeTable.svelte';

	interface Props {
		vales: Vale[];
		categoriasById: Map<string, Categoria>;
		negociosById: Map<string, Negocio>;
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
	}

	let {
		vales,
		categoriasById,
		negociosById,
		currentPage,
		totalPages,
		perPage,
		total,
		isLoading = false,
		error = '',
		isFiltered = false,
		onPageChange,
		onPerPageChange,
		onRetry
	}: Props = $props();

	function handlePerPageChange(event: Event & { currentTarget: HTMLSelectElement }) {
		onPerPageChange?.(Number(event.currentTarget.value));
	}

	const SKELETON_ITEMS = 5;

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
			<p class="text-sm text-light-two_d dark:text-dark-four">{error}</p>
			{#if onRetry}
				<Button variant="outline" size="sm" onclick={onRetry}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			{/if}
		</div>
	{:else if isInitialLoading}
		<ul class="divide-y divide-light-one_d dark:divide-dark-one_d" aria-label="Cargando vales">
			{#each Array.from({ length: SKELETON_ITEMS }, (_, i) => i) as i (i)}
				<li class="flex animate-pulse items-center gap-3 p-4">
					<div class="size-11 shrink-0 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="flex-1 space-y-2">
						<div class="h-3.5 w-1/3 rounded bg-light-one_d dark:bg-dark-one_d"></div>
						<div class="h-3 w-2/3 rounded bg-light-one_d dark:bg-dark-one_d"></div>
					</div>
					<div class="hidden h-3.5 w-20 rounded bg-light-one_d sm:block dark:bg-dark-one_d"></div>
				</li>
			{/each}
		</ul>
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
			<TicketIcon class="size-10 text-light-four dark:text-dark-four" />
			{#if isFiltered}
				<p class="font-medium text-light-two dark:text-dark-two">Sin resultados</p>
				<p class="text-sm text-light-two_d dark:text-dark-four">
					No hay vales que coincidan con los filtros seleccionados.
				</p>
			{:else}
				<p class="font-medium text-light-two dark:text-dark-two">No hay vales registrados</p>
				<p class="text-sm text-light-two_d dark:text-dark-four">
					Cuando se creen vales aparecerán aquí.
				</p>
			{/if}
		</div>
	{:else}
		{#if error}
			<div
				role="alert"
				class="flex items-start gap-2.5 border-b border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error"
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
				{#each vales as vale (vale.id)}
					<ValeCard
						{vale}
						categoria={categoriasById.get(vale.categoria_id)}
						negocio={negociosById.get(vale.negocio_id)}
					/>
				{/each}
			</div>

			<!-- Tablet y escritorio: tabla -->
			<div class="hidden md:block">
				<ValeTable {vales} {categoriasById} {negociosById} />
			</div>
		</div>
		{#if totalPages > 1}
			<div
				class="flex flex-col-reverse border-t border-light-one_d md:flex-row md:items-center dark:border-dark-one_d"
			>
				{#if onPerPageChange}
					<div
						class="flex items-center justify-center gap-2 px-4 pb-3 text-sm text-light-two_d md:pt-3 md:pr-0 md:pl-6 dark:text-dark-four"
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
	{/if}
</section>
