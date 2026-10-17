<script lang="ts">
	import { CanjeListSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button, Pagination, Select } from '#lib/components/ui/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, GiftIcon, RefreshIcon } from '#lib/icons/outline/index.ts';
	import type { CanjeListItem, CanjeStatus } from '#lib/interfaces/index.ts';
	import CanjeCard from './canjeCard.svelte';
	import CanjeTable from './canjeTable.svelte';

	interface Props {
		canjes: CanjeListItem[];
		/** Referencia de "ahora" para decidir qué pendientes ya vencieron (ms) */
		now: number;
		/** Pestaña activa (null = todos), para el mensaje de lista vacía */
		status: CanjeStatus | null;
		/** Hay un filtro de sucursal aplicado */
		isFiltered?: boolean;
		currentPage: number;
		totalPages: number;
		perPage: number;
		total: number;
		isLoading?: boolean;
		error?: string;
		onPageChange: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
		onRetry?: () => void;
		/** Acción opcional: si no se pasa no se muestra (según permisos) */
		onCancel?: (item: CanjeListItem) => void;
	}

	let {
		canjes,
		now,
		status,
		isFiltered = false,
		currentPage,
		totalPages,
		perPage,
		total,
		isLoading = false,
		error = '',
		onPageChange,
		onPerPageChange,
		onRetry,
		onCancel
	}: Props = $props();

	const EMPTY_STATE: Record<CanjeStatus | 'TODOS', { title: string; description: string }> = {
		PENDIENTE: {
			title: 'No hay canjes pendientes',
			description:
				'Cuando un cliente canjee sus puntos por un vale aparecerá aquí hasta que lo confirmes.'
		},
		CANJEADO: {
			title: 'Aún no hay canjes confirmados',
			description: 'Los canjes que confirmes con el código del cliente aparecerán aquí.'
		},
		EXPIRADO: {
			title: 'No hay canjes expirados',
			description: 'Los canjes vencidos aparecen aquí una vez que se marcan como expirados.'
		},
		CANCELADO: {
			title: 'No hay canjes cancelados',
			description: 'Los canjes pendientes que se cancelen aparecerán aquí.'
		},
		TODOS: {
			title: 'No hay canjes registrados',
			description: 'Cuando los clientes canjeen sus puntos por vales aparecerán aquí.'
		}
	};

	function handlePerPageChange(event: Event & { currentTarget: HTMLSelectElement }) {
		onPerPageChange?.(Number(event.currentTarget.value));
	}

	const hasData = $derived(canjes.length > 0);
	// Primera carga: sin datos previos que mostrar mientras llega la respuesta
	const isInitialLoading = $derived(isLoading && !hasData);
	const emptyState = $derived(EMPTY_STATE[status ?? 'TODOS']);
</script>

<section
	aria-busy={isLoading}
	class="mt-4 overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:border-dark-one_d dark:bg-dark-one"
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
		<CanjeListSkeleton />
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
			<GiftIcon class="size-10 text-light-four dark:text-dark-four" />
			<p class="font-medium text-light-two dark:text-dark-two">{emptyState.title}</p>
			<p class="max-w-md text-sm text-light-two_d dark:text-dark-two_d">
				{isFiltered ? 'Prueba con otra sucursal o quita el filtro.' : emptyState.description}
			</p>
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
				{#each canjes as item (item.canje.id)}
					<CanjeCard {item} {now} {onCancel} />
				{/each}
			</div>

			<!-- Tablet y escritorio: tabla -->
			<div class="hidden md:block">
				<CanjeTable {canjes} {now} {onCancel} />
			</div>
		</div>
		<div
			class="flex flex-col-reverse border-t border-light-one_d md:flex-row md:items-center dark:border-dark-one_d"
		>
			{#if onPerPageChange}
				<div
					class="flex items-center justify-center gap-2 px-4 pb-3 text-sm text-light-two_d md:pt-3 md:pr-0 md:pl-6 dark:text-dark-two_d"
				>
					<label for="canjes-per-page" class="whitespace-nowrap">Mostrar</label>
					<Select
						id="canjes-per-page"
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
