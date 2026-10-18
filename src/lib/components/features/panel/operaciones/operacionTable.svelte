<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { OperacionListItem } from '#lib/interfaces/index.ts';
	import OperacionRow from './operacionRow.svelte';

	interface Props {
		operaciones: OperacionListItem[];
		onFilterReceptor?: (operacion: OperacionListItem) => void;
		onFilterEmisor?: (operacion: OperacionListItem) => void;
	}

	let { operaciones, onFilterReceptor, onFilterEmisor }: Props = $props();

	// Sin ninguna acción disponible no se muestra la columna
	const hasActions = $derived(!!onFilterReceptor || !!onFilterEmisor);

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class={headClass}>Cliente</TableHead>
				<TableHead class="{headClass} w-32 text-right">Puntos</TableHead>
				<TableHead class="{headClass} hidden w-44 lg:table-cell">Sucursal</TableHead>
				<TableHead class="{headClass} hidden w-48 xl:table-cell">Registrado por</TableHead>
				<TableHead class="{headClass} w-48">Fecha</TableHead>
				{#if hasActions}
					<TableHead class="h-11 w-14 px-2">
						<span class="sr-only">Acciones</span>
					</TableHead>
				{/if}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each operaciones as operacion (operacion.id)}
				<OperacionRow {operacion} {onFilterReceptor} {onFilterEmisor} />
			{/each}
		</TableBody>
	</Table>
</div>
