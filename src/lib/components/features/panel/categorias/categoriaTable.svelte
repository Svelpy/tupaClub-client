<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { Categoria } from '#lib/interfaces/index.ts';
	import CategoriaRow from './categoriaRow.svelte';

	interface Props {
		categorias: Categoria[];
		onEdit?: (categoria: Categoria) => void;
		onDelete?: (categoria: Categoria) => void;
	}

	let { categorias, onEdit, onDelete }: Props = $props();

	// Sin ninguna acción permitida no se muestra la columna
	const hasActions = $derived(!!(onEdit || onDelete));
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead
					class="h-11 w-[45%] text-xs tracking-wide text-light-two_d uppercase lg:w-2/5 dark:text-dark-four_d"
				>
					Categoría
				</TableHead>
				<TableHead
					class="h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-four_d"
				>
					Descripción
				</TableHead>
				{#if hasActions}
					<TableHead class="h-11 w-14 px-2">
						<span class="sr-only">Acciones</span>
					</TableHead>
				{/if}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each categorias as categoria (categoria.id)}
				<CategoriaRow {categoria} {onEdit} {onDelete} />
			{/each}
		</TableBody>
	</Table>
</div>
