<script lang="ts">
	import { SucursalFilter } from '#lib/components/features/panel/sucursales/index.ts';
	import { XIcon } from '#lib/icons/outline/index.ts';
	import type { Administrador, Cliente, NegocioListItem } from '#lib/interfaces/index.ts';
	import { formatFullName } from '#lib/utils/index.ts';

	interface Props {
		/** Negocios visibles con sus sucursales (opciones del filtro de sucursal) */
		negocios: NegocioListItem[];
		/** null = todas las sucursales */
		sucursalId: string | null;
		/** Cliente elegido desde una operación; null = todos */
		receptor: Cliente | null;
		/** Usuario del panel elegido desde una operación; null = todos */
		emisor: Administrador | null;
		isLoadingOptions?: boolean;
		optionsError?: string;
		disabled?: boolean;
		onSucursalChange: (sucursalId: string | null) => void;
		onClearReceptor: () => void;
		onClearEmisor: () => void;
		onClear: () => void;
		onRetryOptions?: () => void;
	}

	let {
		negocios,
		sucursalId,
		receptor,
		emisor,
		isLoadingOptions = false,
		optionsError = '',
		disabled = false,
		onSucursalChange,
		onClearReceptor,
		onClearEmisor,
		onClear,
		onRetryOptions
	}: Props = $props();

	const isFiltered = $derived(!!sucursalId || !!receptor || !!emisor);

	const chips = $derived(
		[
			receptor && {
				id: 'receptor',
				label: 'Cliente',
				value: formatFullName(receptor),
				onRemove: onClearReceptor
			},
			emisor && {
				id: 'emisor',
				label: 'Registrado por',
				value: formatFullName(emisor),
				onRemove: onClearEmisor
			}
		].filter((chip) => !!chip)
	);
</script>

<div class="mt-6 space-y-3">
	<div class="grid gap-3 sm:grid-cols-2 lg:flex lg:items-end">
		<SucursalFilter
			id="operaciones-sucursal"
			{negocios}
			{sucursalId}
			{isLoadingOptions}
			{optionsError}
			{disabled}
			onChange={onSucursalChange}
			onRetry={onRetryOptions}
		/>

		{#if isFiltered}
			<button
				type="button"
				onclick={onClear}
				{disabled}
				class="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none disabled:opacity-50 sm:justify-self-start dark:text-dark-four dark:hover:bg-dark-one_d dark:hover:text-dark-two"
			>
				<XIcon class="size-4" />
				Limpiar filtros
			</button>
		{/if}
	</div>

	{#if chips.length > 0}
		<ul class="flex flex-wrap gap-2" aria-label="Filtros aplicados">
			{#each chips as chip (chip.id)}
				<li
					class="inline-flex max-w-full items-center gap-1 rounded-full border border-light-three/15 bg-light-three/10 py-1 pr-1 pl-3 text-sm text-light-three dark:border-dark-three/15 dark:bg-dark-three/10 dark:text-dark-three"
				>
					<span class="truncate">
						<span class="text-light-two_d dark:text-dark-two_d">{chip.label}:</span>
						<span class="font-medium">{chip.value}</span>
					</span>
					<button
						type="button"
						onclick={chip.onRemove}
						{disabled}
						aria-label="Quitar filtro {chip.label}: {chip.value}"
						class="inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-light-three/15 focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none disabled:opacity-50 dark:hover:bg-dark-three/15 dark:focus-visible:ring-dark-three"
					>
						<XIcon class="size-4" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
