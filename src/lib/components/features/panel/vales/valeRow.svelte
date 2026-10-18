<script lang="ts">
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import { NegocioAvatar } from '#lib/components/features/panel/negocios/index.ts';
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { ValeListItem } from '#lib/interfaces/index.ts';
	import { formatCurrency, formatNumber, formatValue } from '#lib/utils/index.ts';
	import ValeActions from './valeActions.svelte';
	import ValeImage from './valeImage.svelte';

	interface Props {
		item: ValeListItem;
		onView: (item: ValeListItem) => void;
		onEdit?: (item: ValeListItem) => void;
		onDelete?: (item: ValeListItem) => void;
	}

	let { item, onView, onEdit, onDelete }: Props = $props();

	const { vale, categoria, negocio } = $derived(item);
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<ValeImage {vale} />
			<div class="min-w-0">
				<button
					type="button"
					onclick={() => onView(item)}
					class="block max-w-full truncate text-left font-medium text-light-two hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-two"
				>
					{vale.nombre}
				</button>
				<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
					<!-- En tablet la categoría no tiene columna propia -->
					<span class="lg:hidden">{categoria.nombre} · </span>
					{formatValue(vale.descripcion)}
				</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-2">
			<NegocioAvatar {negocio} size="sm" />
			<span class="truncate text-light-two dark:text-dark-two">{negocio.nombre}</span>
		</div>
	</TableCell>
	<TableCell class="hidden px-4 py-3 lg:table-cell">
		<div class="flex min-w-0 items-center gap-2">
			<CategoriaIcon iconNumber={categoria.icon_number} size="sm" />
			<span class="truncate text-light-two dark:text-dark-two">{categoria.nombre}</span>
		</div>
	</TableCell>
	<TableCell
		class="px-4 py-3 text-right font-medium whitespace-nowrap text-light-two tabular-nums dark:text-dark-two"
	>
		{formatCurrency(vale.total_costo)}
	</TableCell>
	<TableCell
		class="px-4 py-3 text-right font-semibold whitespace-nowrap text-light-three tabular-nums dark:text-dark-three"
	>
		{formatNumber(vale.total_puntos)} pts
	</TableCell>
	<TableCell class="px-2 py-3 text-right">
		<ValeActions {item} {onView} {onEdit} {onDelete} />
	</TableCell>
</TableRow>
