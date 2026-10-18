<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { Tabs } from '#lib/components/ui/index.ts';
	import { TredingUpIcon, UsersIcon } from '#lib/icons/outline/index.ts';

	interface Props {
		/** true = clientes ordenados de más a menos puntos */
		orderByPoints: boolean;
		/** Total del listado; null mientras carga */
		total: number | null;
		onChange: (orderByPoints: boolean) => void;
		/** Listado de clientes */
		children: Snippet;
	}

	let { orderByPoints, total, onChange, children }: Props = $props();

	type TabValue = 'TODOS' | 'PUNTOS';

	const OPTIONS: { value: TabValue; label: string; icon: Component }[] = [
		{ value: 'TODOS', label: 'Todos', icon: UsersIcon },
		{ value: 'PUNTOS', label: 'Con más puntos', icon: TredingUpIcon }
	];
</script>

<Tabs
	id="clientes"
	label="Orden de los clientes"
	options={OPTIONS}
	value={orderByPoints ? 'PUNTOS' : 'TODOS'}
	onChange={(value) => onChange(value === 'PUNTOS')}
	count={total}
	class="mt-6"
>
	{@render children()}
</Tabs>
