<script lang="ts">
	import type { NegocioListItem } from '#lib/interfaces/index.ts';
	import SucursalSelect from './sucursalSelect.svelte';

	interface Props {
		id: string;
		/** Negocios visibles con sus sucursales */
		negocios: NegocioListItem[];
		/** null = todas las sucursales */
		sucursalId: string | null;
		isLoadingOptions?: boolean;
		optionsError?: string;
		disabled?: boolean;
		onChange: (sucursalId: string | null) => void;
		onRetry?: () => void;
	}

	let {
		id,
		negocios,
		sucursalId,
		isLoadingOptions = false,
		optionsError = '',
		disabled = false,
		onChange,
		onRetry
	}: Props = $props();

	const sucursalesCount = $derived(
		negocios.reduce((count, { sucursales }) => count + sucursales.length, 0)
	);
	// Con una sola sucursal visible el filtro no aporta nada
	const isVisible = $derived(
		isLoadingOptions || !!optionsError || !!sucursalId || sucursalesCount > 1
	);
</script>

{#if isVisible}
	<div class="flex flex-col gap-1 lg:w-64">
		<label for={id} class="text-sm font-medium text-light-two dark:text-dark-two">Sucursal</label>
		<SucursalSelect
			{id}
			{negocios}
			value={sucursalId}
			placeholder="Todas"
			isLoading={isLoadingOptions}
			{disabled}
			{onChange}
		/>

		{#if optionsError}
			<p role="alert" class="text-sm text-light-error dark:text-dark-error">
				No se pudieron cargar las sucursales.
				{#if onRetry}
					<button type="button" onclick={onRetry} class="font-medium underline underline-offset-2">
						Reintentar
					</button>
				{/if}
			</p>
		{/if}
	</div>
{/if}
