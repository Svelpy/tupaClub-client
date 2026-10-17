<script lang="ts">
	import { Button, Pagination, Select } from '#lib/components/ui/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, RefreshIcon, SettingsIcon } from '#lib/icons/outline/index.ts';
	import type { ConfigPuntos } from '#lib/interfaces/index.ts';
	import ConfigPuntosCard from './configPuntosCard.svelte';
	import ConfigPuntosTable from './configPuntosTable.svelte';

	interface Props {
		configs: ConfigPuntos[];
		currentPage: number;
		totalPages: number;
		perPage: number;
		total: number;
		isLoading?: boolean;
		error?: string;
		onPageChange: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
		onRetry?: () => void;
	}

	let {
		configs,
		currentPage,
		totalPages,
		perPage,
		total,
		isLoading = false,
		error = '',
		onPageChange,
		onPerPageChange,
		onRetry
	}: Props = $props();

	function handlePerPageChange(event: Event & { currentTarget: HTMLSelectElement }) {
		onPerPageChange?.(Number(event.currentTarget.value));
	}

	const SKELETON_ITEMS = 5;

	const hasData = $derived(configs.length > 0);
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
		<ul
			class="divide-y divide-light-one_d dark:divide-dark-one_d"
			aria-label="Cargando configuraciones de puntos"
		>
			{#each Array.from({ length: SKELETON_ITEMS }, (_, i) => i) as i (i)}
				<li class="flex animate-pulse items-center gap-4 p-4">
					<div class="h-5 w-16 shrink-0 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="h-3.5 flex-1 rounded bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="h-3.5 flex-1 rounded bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="hidden h-3.5 flex-1 rounded bg-light-one_d md:block dark:bg-dark-one_d"></div>
				</li>
			{/each}
		</ul>
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
			<SettingsIcon class="size-10 text-light-four dark:text-dark-four" />
			<p class="font-medium text-light-two dark:text-dark-two">
				No hay configuraciones de puntos registradas
			</p>
			<p class="text-sm text-light-two_d dark:text-dark-four">
				Cuando se cree una configuración aparecerá aquí.
			</p>
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
				{#each configs as config (config.id)}
					<ConfigPuntosCard {config} />
				{/each}
			</div>

			<!-- Tablet y escritorio: tabla -->
			<div class="hidden md:block">
				<ConfigPuntosTable {configs} />
			</div>
		</div>

		<div
			class="flex flex-col-reverse border-t border-light-one_d md:flex-row md:items-center dark:border-dark-one_d"
		>
			{#if onPerPageChange}
				<div
					class="flex items-center justify-center gap-2 px-4 pb-3 text-sm text-light-two_d md:pt-3 md:pr-0 md:pl-6 dark:text-dark-four"
				>
					<label for="config-puntos-per-page" class="whitespace-nowrap">Mostrar</label>
					<Select
						id="config-puntos-per-page"
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
