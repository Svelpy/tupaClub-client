<script lang="ts">
	import { Select } from '#lib/components/ui/index.ts';
	import type { NegocioListItem } from '#lib/interfaces/index.ts';

	interface Props {
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
		negocios,
		sucursalId,
		isLoadingOptions = false,
		optionsError = '',
		disabled = false,
		onChange,
		onRetry
	}: Props = $props();

	const byNombre = (a: { nombre: string }, b: { nombre: string }) =>
		a.nombre.localeCompare(b.nombre, 'es');

	// Agrupadas por negocio; los negocios sin sucursales no aportan opciones
	const groups = $derived(
		negocios
			.filter(({ sucursales }) => sucursales.length > 0)
			.map(({ negocio, sucursales }) => ({ negocio, sucursales: [...sucursales].sort(byNombre) }))
			.sort((a, b) => byNombre(a.negocio, b.negocio))
	);
	const sucursalesCount = $derived(
		groups.reduce((count, group) => count + group.sucursales.length, 0)
	);
	// Con una sola sucursal visible el filtro no aporta nada
	const isVisible = $derived(
		isLoadingOptions || !!optionsError || !!sucursalId || sucursalesCount > 1
	);
</script>

{#if isVisible}
	<div class="flex flex-col gap-1 lg:w-64">
		<label for="canjes-sucursal" class="text-sm font-medium text-light-two dark:text-dark-two">
			Sucursal
		</label>
		<Select
			id="canjes-sucursal"
			value={sucursalId ?? ''}
			onchange={(event) => onChange(event.currentTarget.value || null)}
			disabled={disabled || isLoadingOptions}
		>
			<option value="">{isLoadingOptions ? 'Cargando…' : 'Todas'}</option>
			{#each groups as { negocio, sucursales } (negocio.id)}
				<optgroup label={negocio.nombre}>
					{#each sucursales as sucursal (sucursal.id)}
						<option value={sucursal.id}>{sucursal.nombre}</option>
					{/each}
				</optgroup>
			{/each}
		</Select>

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
