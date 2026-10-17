<script lang="ts">
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import { NegocioAvatar } from '#lib/components/features/panel/negocios/index.ts';
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

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<ValeImage {vale} size="lg" />
		<div class="min-w-0 flex-1">
			<h3 class="font-semibold text-light-two dark:text-dark-two">{vale.nombre}</h3>
			<p class="mt-1 line-clamp-2 text-sm text-light-two_d dark:text-dark-four">
				{formatValue(vale.descripcion)}
			</p>
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
		<span class="flex min-w-0 items-center gap-2">
			{#if negocio}
				<NegocioAvatar {negocio} size="sm" />
			{/if}
			<span class="truncate text-light-two dark:text-dark-two">
				{negocio?.nombre ?? NO_DATA_LABEL}
			</span>
		</span>
		<span class="flex min-w-0 items-center gap-2">
			{#if categoria}
				<CategoriaIcon iconNumber={categoria.icon_number} size="sm" />
			{/if}
			<span class="truncate text-light-two_d dark:text-dark-four">
				{categoria?.nombre ?? NO_DATA_LABEL}
			</span>
		</span>
	</div>

	<dl
		class="mt-auto grid grid-cols-2 gap-3 border-t border-light-one_d pt-3 dark:border-dark-one_d"
	>
		<div>
			<dt class="text-xs text-light-two_d dark:text-dark-four_d">Valor</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatCurrency(vale.total_costo)}
			</dd>
		</div>
		<div class="text-right">
			<dt class="text-xs text-light-two_d dark:text-dark-four_d">Cuesta</dt>
			<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
				{formatNumber(vale.total_puntos)} pts
			</dd>
		</div>
	</dl>
</article>
