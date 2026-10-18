<script lang="ts">
	import { resolve } from '$app/paths';
	import { MiCanjeListSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import {
		AlertTriangleIcon,
		GiftIcon,
		RefreshIcon,
		SearchIcon
	} from '#lib/icons/outline/index.ts';
	import type { CanjeStatus, MiCanjeListItem } from '#lib/interfaces/index.ts';
	import MiCanjeCard from './miCanjeCard.svelte';

	interface Props {
		canjes: MiCanjeListItem[];
		/** Referencia de "ahora" para decidir qué pendientes ya vencieron (ms) */
		now: number;
		/** Pestaña activa, para el mensaje de lista vacía */
		status: CanjeStatus;
		/** Quedan páginas por traer con "Ver más" */
		hasMore: boolean;
		isLoading?: boolean;
		error?: string;
		onLoadMore: () => void;
		onRetry?: () => void;
		onShowCodigo?: (item: MiCanjeListItem) => void;
	}

	let {
		canjes,
		now,
		status,
		hasMore,
		isLoading = false,
		error = '',
		onLoadMore,
		onRetry,
		onShowCodigo
	}: Props = $props();

	const EMPTY_STATE: Record<CanjeStatus, { title: string; description: string }> = {
		PENDIENTE: {
			title: 'No tienes canjes vigentes',
			description: 'Canjea tus puntos por un vale y aquí tendrás su código para usarlo en caja.'
		},
		CANJEADO: {
			title: 'Aún no usaste ningún canje',
			description: 'Los vales que recibas en una sucursal aparecerán aquí.'
		},
		EXPIRADO: {
			title: 'No tienes canjes vencidos',
			description: 'Si un canje vence sin que lo uses, aparecerá aquí.'
		},
		CANCELADO: {
			title: 'No tienes canjes cancelados',
			description: 'Si se cancela alguno de tus canjes, aparecerá aquí.'
		}
	};

	const hasData = $derived(canjes.length > 0);
	// Primera carga: sin datos previos que mostrar mientras llega la respuesta
	const isInitialLoading = $derived(isLoading && !hasData);
	const emptyState = $derived(EMPTY_STATE[status]);
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
		<MiCanjeListSkeleton />
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-16 text-center">
			<GiftIcon class="size-10 text-light-two_d dark:text-dark-two_d" />
			<p class="font-medium text-light-two dark:text-dark-two">{emptyState.title}</p>
			<p class="max-w-sm text-sm text-light-two_d dark:text-dark-two_d">
				{emptyState.description}
			</p>
			{#if status === 'PENDIENTE'}
				<Button href={resolve('/app/categorias')} size="sm" class="mt-2">
					{#snippet leftIcon()}<SearchIcon class="size-4" />{/snippet}
					Explorar vales
				</Button>
			{/if}
		</div>
	{:else}
		<ul class="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each canjes as item (item.canje.id)}
				<li>
					<MiCanjeCard {item} {now} {onShowCodigo} />
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
