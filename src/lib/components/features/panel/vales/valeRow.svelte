<script lang="ts">
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import { NegocioAvatar } from '#lib/components/features/panel/negocios/index.ts';
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import { NO_DATA_LABEL } from '#lib/constants/index.ts';
	import type { Categoria, Negocio, Vale } from '#lib/interfaces/index.ts';
	import { formatCurrency, formatNumber, formatValue } from '#lib/utils/index.ts';
	import ValeImage from './valeImage.svelte';

	interface Props {
		vale: Vale;
		/** undefined si aún no se cargó o ya no existe */
		categoria?: Categoria;
		negocio?: Negocio;
	}

	let { vale, categoria, negocio }: Props = $props();
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/40"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<ValeImage {vale} />
			<div class="min-w-0">
				<p class="truncate font-medium text-light-two dark:text-dark-two">{vale.nombre}</p>
				<p class="truncate text-xs text-light-two_d dark:text-dark-four_d">
					<!-- En tablet la categoría no tiene columna propia -->
					<span class="lg:hidden">{categoria?.nombre ?? NO_DATA_LABEL} · </span>
					{formatValue(vale.descripcion)}
				</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3">
		{#if negocio}
			<div class="flex min-w-0 items-center gap-2">
				<NegocioAvatar {negocio} size="sm" />
				<span class="truncate text-light-two dark:text-dark-two">{negocio.nombre}</span>
			</div>
		{:else}
			<span class="text-light-two_d dark:text-dark-four">{NO_DATA_LABEL}</span>
		{/if}
	</TableCell>
	<TableCell class="hidden px-4 py-3 lg:table-cell">
		{#if categoria}
			<div class="flex min-w-0 items-center gap-2">
				<CategoriaIcon iconNumber={categoria.icon_number} size="sm" />
				<span class="truncate text-light-two dark:text-dark-two">{categoria.nombre}</span>
			</div>
		{:else}
			<span class="text-light-two_d dark:text-dark-four">{NO_DATA_LABEL}</span>
		{/if}
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
</TableRow>
