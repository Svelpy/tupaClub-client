<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { CanjeListItem } from '#lib/interfaces/index.ts';
	import CanjeRow from './canjeRow.svelte';

	interface Props {
		canjes: CanjeListItem[];
		now: number;
		onCancel?: (item: CanjeListItem) => void;
	}

	let { canjes, now, onCancel }: Props = $props();

	// Sin ninguna acción permitida no se muestra la columna
	const hasActions = $derived(!!onCancel);

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class={headClass}>Vale</TableHead>
				<TableHead class="{headClass} hidden w-32 lg:table-cell">Código</TableHead>
				<TableHead class="{headClass} w-28 text-right">Puntos</TableHead>
				<TableHead class="{headClass} w-48">Estado</TableHead>
				<TableHead class="{headClass} hidden w-48 xl:table-cell">Solicitado</TableHead>
				{#if hasActions}
					<TableHead class="h-11 w-14 px-2">
						<span class="sr-only">Acciones</span>
					</TableHead>
				{/if}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each canjes as item (item.canje.id)}
				<CanjeRow {item} {now} {onCancel} />
			{/each}
		</TableBody>
	</Table>
</div>
