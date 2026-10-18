<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { Tabs } from '#lib/components/ui/index.ts';
	import { GiftIcon, ListIcon, ScaleIcon, SparklesIcon } from '#lib/icons/outline/index.ts';
	import type { MovimientoTipo } from '#lib/interfaces/index.ts';

	interface Props {
		/** Pestaña activa; null = todos los tipos */
		tipo: MovimientoTipo | null;
		/** Total de la pestaña activa; null mientras carga */
		total: number | null;
		onChange: (tipo: MovimientoTipo | null) => void;
		/** Contenido de la pestaña activa */
		children: Snippet;
	}

	let { tipo, total, onChange, children }: Props = $props();

	// "TODOS" representa el filtro sin tipo (null) dentro de las pestañas
	type TabValue = MovimientoTipo | 'TODOS';

	const OPTIONS: { value: TabValue; label: string; icon: Component }[] = [
		{ value: 'TODOS', label: 'Todos', icon: ListIcon },
		{ value: 'ACUMULA', label: 'Acumulaciones', icon: SparklesIcon },
		{ value: 'CANJE', label: 'Canjes', icon: GiftIcon },
		{ value: 'AJUSTE', label: 'Ajustes', icon: ScaleIcon }
	];
</script>

<Tabs
	id="movimientos"
	label="Tipo de movimiento"
	options={OPTIONS}
	value={tipo ?? 'TODOS'}
	onChange={(value) => onChange(value === 'TODOS' ? null : value)}
	count={total}
	class="mt-6"
>
	{@render children()}
</Tabs>
