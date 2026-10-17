<script lang="ts">
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

	const hasActions = $derived(!!(onEdit || onDelete));
</script>

<article
	class="flex gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<CategoriaIcon iconNumber={categoria.icon_number} size="lg" />
	<div class="min-w-0 flex-1">
		<h3 class=" font-semibold text-light-two dark:text-dark-two">{categoria.nombre}</h3>
		<p class="truncate text-xs text-light-two_d dark:text-dark-four_d">/{categoria.slug}</p>
		<p class="mt-2 line-clamp-3 text-sm text-light-two_d dark:text-dark-four">
			{formatValue(categoria.descripcion)}
		</p>
	</div>
	{#if hasActions}
		<div class="-mt-1.5 -mr-2 shrink-0 self-start">
			<CategoriaActions {categoria} {onEdit} {onDelete} />
		</div>
	{/if}
</article>
