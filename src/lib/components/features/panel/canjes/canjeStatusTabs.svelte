<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { Tabs } from '#lib/components/ui/index.ts';
	import {
		CalendarIcon,
		CircleCheckIcon,
		ListIcon,
		StopwatchIcon,
		XIcon
	} from '#lib/icons/outline/index.ts';
	import type { CanjeStatus } from '#lib/interfaces/index.ts';

	interface Props {
		/** Pestaña activa; null = todos los estados */
		status: CanjeStatus | null;
		/** Total de la pestaña activa; null mientras carga */
		total: number | null;
		onChange: (status: CanjeStatus | null) => void;
		/** Controles a la derecha de las pestañas (p. ej. filtro de sucursal) */
		toolbar?: Snippet;
		/** Contenido de la pestaña activa */
		children: Snippet;
	}

	let { status, total, onChange, toolbar, children }: Props = $props();

	// "TODOS" representa el filtro sin estado (null) dentro de las pestañas
	type TabValue = CanjeStatus | 'TODOS';

	const OPTIONS: { value: TabValue; label: string; icon: Component }[] = [
		{ value: 'PENDIENTE', label: 'Pendientes', icon: StopwatchIcon },
		{ value: 'CANJEADO', label: 'Canjeados', icon: CircleCheckIcon },
		{ value: 'EXPIRADO', label: 'Expirados', icon: CalendarIcon },
		{ value: 'CANCELADO', label: 'Cancelados', icon: XIcon },
		{ value: 'TODOS', label: 'Todos', icon: ListIcon }
	];
</script>

<Tabs
	id="canjes"
	label="Estado de los canjes"
	options={OPTIONS}
	value={status ?? 'TODOS'}
	onChange={(value) => onChange(value === 'TODOS' ? null : value)}
	count={total}
	{toolbar}
	class="mt-6"
>
	{@render children()}
</Tabs>
