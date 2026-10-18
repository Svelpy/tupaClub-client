<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tabs } from '#lib/components/ui/index.ts';
	import type { MovimientoTipo } from '#lib/interfaces/index.ts';

	interface Props {
		/** Pestaña activa; null = todos los tipos */
		tipo: MovimientoTipo | null;
		onChange: (tipo: MovimientoTipo | null) => void;
		/** Contenido de la pestaña activa */
		children: Snippet;
	}

	let { tipo, onChange, children }: Props = $props();

	// "TODOS" representa el filtro sin tipo (null) dentro de las pestañas
	type TabValue = MovimientoTipo | 'TODOS';

	// Nombres cortos pensados para el cliente: las cuatro pestañas comparten el ancho del móvil
	const OPTIONS: { value: TabValue; label: string }[] = [
		{ value: 'TODOS', label: 'Todos' },
		{ value: 'ACUMULA', label: 'Ganados' },
		{ value: 'CANJE', label: 'Canjes' },
		{ value: 'AJUSTE', label: 'Ajustes' }
	];
</script>

<Tabs
	id="mis-movimientos"
	label="Tipo de movimiento"
	variant="underline"
	options={OPTIONS}
	value={tipo ?? 'TODOS'}
	onChange={(value) => onChange(value === 'TODOS' ? null : value)}
>
	{@render children()}
</Tabs>
