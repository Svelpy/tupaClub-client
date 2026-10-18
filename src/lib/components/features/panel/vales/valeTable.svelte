<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { ValeListItem } from '#lib/interfaces/index.ts';
	import ValeRow from './valeRow.svelte';

	interface Props {
		vales: ValeListItem[];
		onView: (item: ValeListItem) => void;
		onEdit?: (item: ValeListItem) => void;
		onDelete?: (item: ValeListItem) => void;
	}

	let { vales, onView, onEdit, onDelete }: Props = $props();

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class="{headClass} w-[40%] lg:w-[32%]">Vale</TableHead>
				<TableHead class={headClass}>Negocio</TableHead>
				<TableHead class="{headClass} hidden lg:table-cell">Categoría</TableHead>
				<TableHead class="{headClass} w-28 text-right">Valor</TableHead>
				<TableHead class="{headClass} w-28 text-right">Puntos</TableHead>
				<TableHead class="h-11 w-14 px-2">
					<span class="sr-only">Acciones</span>
				</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each vales as item (item.vale.id)}
				<ValeRow {item} {onView} {onEdit} {onDelete} />
			{/each}
		</TableBody>
	</Table>
</div>
