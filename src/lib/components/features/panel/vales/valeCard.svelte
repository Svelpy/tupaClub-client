<script lang="ts">
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import { NegocioAvatar } from '#lib/components/features/panel/negocios/index.ts';
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

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<ValeImage {vale} size="lg" />
		<div class="min-w-0 flex-1">
			<h3 class="font-semibold text-light-two dark:text-dark-two">
				<button
					type="button"
					onclick={() => onView(item)}
					class="text-left hover:underline focus-visible:underline focus-visible:outline-none"
				>
					{vale.nombre}
				</button>
			</h3>
			<p class="mt-1 line-clamp-2 text-sm text-light-two_d dark:text-dark-two_d">
				{formatValue(vale.descripcion)}
			</p>
		</div>
		<div class="-mt-1.5 -mr-2 shrink-0 self-start">
			<ValeActions {item} {onView} {onEdit} {onDelete} />
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<span class="flex min-w-0 items-center gap-2">
			<NegocioAvatar {negocio} size="sm" />
			<span class="truncate text-light-two dark:text-dark-two">{negocio.nombre}</span>
		</span>
		<span class="flex min-w-0 items-center gap-2">
			<CategoriaIcon iconNumber={categoria.icon_number} size="sm" />
			<span class="truncate text-light-two_d dark:text-dark-two_d">{categoria.nombre}</span>
		</span>
	</div>

	<dl
		class="mt-auto grid grid-cols-2 gap-3 border-t border-light-one_d pt-3 dark:border-dark-one_d"
	>
		<div>
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Valor</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatCurrency(vale.total_costo)}
			</dd>
		</div>
		<div class="text-right">
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Cuesta</dt>
			<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
				{formatNumber(vale.total_puntos)} pts
			</dd>
		</div>
	</dl>
</article>
