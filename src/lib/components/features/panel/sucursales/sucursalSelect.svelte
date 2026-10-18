<script lang="ts">
	import { Select } from '#lib/components/ui/index.ts';
	import type { NegocioListItem } from '#lib/interfaces/index.ts';

	interface Props {
		id: string;
		/** Negocios con sus sucursales: las opciones se agrupan por negocio */
		negocios: NegocioListItem[];
		/** null = opción vacía */
		value: string | null;
		/** Texto de la opción vacía (p. ej. "Todas" en un filtro, "Selecciona la sucursal" en un formulario) */
		placeholder: string;
		/** Campo obligatorio: la opción vacía no se puede elegir */
		required?: boolean;
		label?: string;
		error?: string;
		isLoading?: boolean;
		disabled?: boolean;
		class?: string;
		onChange: (sucursalId: string | null) => void;
	}

	let {
		id,
		negocios,
		value,
		placeholder,
		required = false,
		label,
		error,
		isLoading = false,
		disabled = false,
		class: className,
		onChange
	}: Props = $props();

	const byNombre = (a: { nombre: string }, b: { nombre: string }) =>
		a.nombre.localeCompare(b.nombre, 'es');

	// Los negocios sin sucursales no aportan opciones
	const groups = $derived(
		negocios
			.filter(({ sucursales }) => sucursales.length > 0)
			.map(({ negocio, sucursales }) => ({ negocio, sucursales: [...sucursales].sort(byNombre) }))
			.sort((a, b) => byNombre(a.negocio, b.negocio))
	);
</script>

<Select
	{id}
	{label}
	{error}
	{required}
	value={value ?? ''}
	onchange={(event) => onChange(event.currentTarget.value || null)}
	disabled={disabled || isLoading}
	aria-invalid={!!error}
	class={className}
>
	<option value="" disabled={required}>{isLoading ? 'Cargando…' : placeholder}</option>
	{#each groups as { negocio, sucursales } (negocio.id)}
		<optgroup label={negocio.nombre}>
			{#each sucursales as sucursal (sucursal.id)}
				<option value={sucursal.id}>{sucursal.nombre}</option>
			{/each}
		</optgroup>
	{/each}
</Select>
