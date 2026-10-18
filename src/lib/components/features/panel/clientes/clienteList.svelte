<script lang="ts">
	import { ClienteListSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button, Pagination, Select } from '#lib/components/ui/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, RefreshIcon, UsersIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import ClienteCard from './clienteCard.svelte';
	import ClienteTable from './clienteTable.svelte';

	interface Props {
		clientes: Cliente[];
		currentPage: number;
		totalPages: number;
		perPage: number;
		total: number;
		isLoading?: boolean;
		error?: string;
		onPageChange: (page: number) => void;
		onPerPageChange?: (perPage: number) => void;
		onRetry?: () => void;
		onView: (cliente: Cliente) => void;
		/** Acciones opcionales: las que no se pasan no se muestran (según permisos) */
		onEdit?: (cliente: Cliente) => void;
		onResetPassword?: (cliente: Cliente) => void;
		onDelete?: (cliente: Cliente) => void;
	}

	let {
		clientes,
		currentPage,
		totalPages,
		perPage,
		total,
		isLoading = false,
		error = '',
		onPageChange,
		onPerPageChange,
		onRetry,
		onView,
		onEdit,
		onResetPassword,
		onDelete
	}: Props = $props();

	function handlePerPageChange(event: Event & { currentTarget: HTMLSelectElement }) {
		onPerPageChange?.(Number(event.currentTarget.value));
	}

	const hasData = $derived(clientes.length > 0);
	// Primera carga: sin datos previos que mostrar mientras llega la respuesta
	const isInitialLoading = $derived(isLoading && !hasData);
</script>

<section
	aria-busy={isLoading}
	class="mt-4 overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:border-dark-one_d dark:bg-dark-one"
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
		<ClienteListSkeleton />
	{:else if !hasData}
		<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
			<UsersIcon class="size-10 text-light-four dark:text-dark-four" />
			<p class="font-medium text-light-two dark:text-dark-two">No hay clientes registrados</p>
			<p class="text-sm text-light-two_d dark:text-dark-four">
				Cuando se registren o crees clientes aparecerán aquí.
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
				{#each clientes as cliente (cliente.id)}
					<ClienteCard {cliente} {onView} {onEdit} {onResetPassword} {onDelete} />
				{/each}
			</div>

			<!-- Tablet y escritorio: tabla -->
			<div class="hidden md:block">
				<ClienteTable {clientes} {onView} {onEdit} {onResetPassword} {onDelete} />
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
						<label for="clientes-per-page" class="whitespace-nowrap">Mostrar</label>
						<Select
							id="clientes-per-page"
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
