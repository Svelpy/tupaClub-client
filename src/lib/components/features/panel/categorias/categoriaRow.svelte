<script lang="ts">
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { Categoria } from '#lib/interfaces/index.ts';
	import { formatValue } from '#lib/utils/index.ts';
	import CategoriaActions from './categoriaActions.svelte';
	import CategoriaIcon from './categoriaIcon.svelte';

	interface Props {
		categoria: Categoria;
		onEdit?: (categoria: Categoria) => void;
		onDelete?: (categoria: Categoria) => void;
	}

	let { categoria, onEdit, onDelete }: Props = $props();

	// Sin ninguna acción permitida no se muestra la columna
	const hasActions = $derived(!!(onEdit || onDelete));
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/40"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<CategoriaIcon iconNumber={categoria.icon_number} />
			<div class="min-w-0">
				<p class="truncate font-medium text-light-two dark:text-dark-two">{categoria.nombre}</p>
				<p class="truncate text-xs text-light-two_d dark:text-dark-four_d">/{categoria.slug}</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3 text-sm text-light-two_d dark:text-dark-four">
		<p class="line-clamp-2">{formatValue(categoria.descripcion)}</p>
	</TableCell>
	{#if hasActions}
		<TableCell class="px-2 py-3 text-right">
			<CategoriaActions {categoria} {onEdit} {onDelete} />
		</TableCell>
	{/if}
</TableRow>
