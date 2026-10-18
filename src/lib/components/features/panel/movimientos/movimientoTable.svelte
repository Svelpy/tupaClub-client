<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { MovimientoListItem } from '#lib/interfaces/index.ts';
	import MovimientoRow from './movimientoRow.svelte';

	interface Props {
		movimientos: MovimientoListItem[];
		onFilterCliente?: (item: MovimientoListItem) => void;
	}

	let { movimientos, onFilterCliente }: Props = $props();

	// Sin ninguna acción disponible no se muestra la columna
	const hasActions = $derived(!!onFilterCliente);

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class={headClass}>Cliente</TableHead>
				<TableHead class="{headClass} w-56">Movimiento</TableHead>
				<TableHead class="{headClass} w-32 text-right">Puntos</TableHead>
				<TableHead class="{headClass} hidden w-48 xl:table-cell">Registrado por</TableHead>
				<TableHead class="{headClass} hidden w-48 lg:table-cell">Fecha</TableHead>
				{#if hasActions}
					<TableHead class="h-11 w-14 px-2">
						<span class="sr-only">Acciones</span>
					</TableHead>
				{/if}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each movimientos as item (item.movimiento.id)}
				<MovimientoRow {item} {onFilterCliente} />
			{/each}
		</TableBody>
	</Table>
</div>
