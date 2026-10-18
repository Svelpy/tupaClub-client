<script lang="ts">
	import { resolve } from '$app/paths';
	import { MiMovimientoListSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import {
		AlertTriangleIcon,
		RefreshIcon,
		SearchIcon,
		TredingUpIcon
	} from '#lib/icons/outline/index.ts';
	import type { MiMovimientoListItem, MovimientoTipo } from '#lib/interfaces/index.ts';
	import MiMovimientoItem from './miMovimientoItem.svelte';

	interface Props {
		movimientos: MiMovimientoListItem[];
		/** Pestaña activa, para el mensaje de lista vacía; null = todos los tipos */
		tipo: MovimientoTipo | null;
		/** Quedan páginas por traer con "Ver más" */
		hasMore: boolean;
		isLoading?: boolean;
		error?: string;
		onLoadMore: () => void;
		onRetry?: () => void;
	}

	let {
		movimientos,
		tipo,
		hasMore,
		isLoading = false,
		error = '',
		onLoadMore,
		onRetry
	}: Props = $props();

	const EMPTY_STATE: Record<MovimientoTipo | 'TODOS', { title: string; description: string }> = {
		TODOS: {
			title: 'Aún no tienes movimientos',
			description: 'Cada compra que sume puntos y cada vale que canjees aparecerá aquí.'
		},
		ACUMULA: {
			title: 'Aún no ganaste puntos',
			description:
				'Presenta tu cuenta al pagar en una sucursal y los puntos de tu compra se verán aquí.'
		},
		CANJE: {
			title: 'Aún no canjeaste puntos',
			description: 'Cuando canjees tus puntos por un vale, el descuento aparecerá aquí.'
		},
		AJUSTE: {
			title: 'No tienes ajustes',
			description: 'Si se corrige tu saldo (p. ej. al cancelar un canje), aparecerá aquí.'
		}
	};

	const hasData = $derived(movimientos.length > 0);
	// Primera carga: sin datos previos que mostrar mientras llega la respuesta
	const isInitialLoading = $derived(isLoading && !hasData);
	const emptyState = $derived(EMPTY_STATE[tipo ?? 'TODOS']);
</script>

<section aria-busy={isLoading}>
	{#if error && !hasData}
		<div
			role="alert"
			class="mt-4 flex flex-col items-center gap-3 rounded-3xl border border-light-one_d bg-light-one px-4 py-12 text-center dark:border-dark-one_d dark:bg-dark-one"
		>
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
		<MiMovimientoListSkeleton />
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-16 text-center">
			<TredingUpIcon class="size-10 text-light-two_d dark:text-dark-two_d" />
			<p class="font-medium text-light-two dark:text-dark-two">{emptyState.title}</p>
			<p class="max-w-sm text-sm text-light-two_d dark:text-dark-two_d">
				{emptyState.description}
			</p>
			{#if tipo === null || tipo === 'CANJE'}
				<Button href={resolve('/app/categorias')} size="sm" class="mt-2">
					{#snippet leftIcon()}<SearchIcon class="size-4" />{/snippet}
					Explorar vales
				</Button>
			{/if}
		</div>
	{:else}
		<ul
			class="mt-4 divide-y divide-light-one_d overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:divide-dark-one_d dark:border-dark-one_d dark:bg-dark-one"
		>
			{#each movimientos as item (item.movimiento.id)}
				<li>
					<MiMovimientoItem {item} />
				</li>
			{/each}
		</ul>

		{#if error}
			<div
				role="alert"
				class="mt-4 flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span class="flex-1">{error}</span>
				{#if onRetry}
					<button type="button" onclick={onRetry} class="font-medium underline underline-offset-2">
						Reintentar
					</button>
				{/if}
			</div>
		{:else if hasMore}
			<div class="mt-4 flex justify-center">
				<Button variant="outline" loading={isLoading} onclick={onLoadMore} class="w-full sm:w-auto">
					Ver más
				</Button>
			</div>
		{/if}
	{/if}
</section>
