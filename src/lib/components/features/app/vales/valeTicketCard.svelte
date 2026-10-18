<script lang="ts">
	import { resolve } from '$app/paths';
	import { Image } from '#lib/components/ui/index.ts';
	import { TicketIcon } from '#lib/icons/outline/index.ts';
	import { CoinIcon } from '#lib/icons/solid/index.ts';
	import type { ValeListItem } from '#lib/interfaces/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		item: ValeListItem;
	}

	let { item }: Props = $props();

	const vale = $derived(item.vale);
	const href = $derived(resolve('/app/vales/[valeId]', { valeId: item.vale.id }));
</script>

<!--
	Vale con forma de ticket: las muescas a los lados de la línea punteada se recortan con una
	máscara (transparentes sobre cualquier fondo). Deben coincidir con la altura del pie (h-21).
	Toda la tarjeta abre el detalle a través del enlace "Ver más" (after:inset-0).
-->
<article
	class="group relative flex h-full flex-col rounded-2xl border border-light-one_d bg-light-one transition-transform has-active:scale-[0.98] dark:border-dark-one_d dark:bg-dark-one"
	style="--notch: calc(100% - 5.25rem); mask: radial-gradient(circle 0.5rem at 0 var(--notch), #0000 0.5rem, #000 calc(0.5rem + 0.5px)) left / 51% 100% no-repeat, radial-gradient(circle 0.5rem at 100% var(--notch), #0000 0.5rem, #000 calc(0.5rem + 0.5px)) right / 51% 100% no-repeat;"
>
	<div
		class="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-t-2xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
	>
		{#if vale.image_url}
			<Image
				src={vale.image_url}
				alt=""
				class="transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
			/>
		{:else}
			<TicketIcon class="size-10" />
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-1 px-3 pt-3 pb-4">
		<p class="truncate text-xs font-semibold text-light-three dark:text-dark-three">
			{item.negocio.nombre}
		</p>
		<h3 class="line-clamp-2 text-sm leading-snug font-medium text-light-two dark:text-dark-two">
			{vale.nombre}
		</h3>
	</div>

	<div
		class="flex h-21 flex-col gap-2.5 border-t-2 border-dashed border-light-one_d px-3 pt-2.5 pb-3 dark:border-dark-one_d"
	>
		<p class="flex items-center justify-center gap-1">
			<CoinIcon class="size-4 text-light-warning dark:text-dark-warning" />
			<span class="text-lg font-bold text-light-two tabular-nums dark:text-dark-two">
				{formatNumber(vale.total_puntos)}
			</span>
			<span class="text-xs font-semibold text-light-two_d dark:text-dark-two_d">pts</span>
		</p>
		<a
			{href}
			class="flex h-9 items-center justify-center rounded-full bg-light-three text-xs font-bold text-light-one transition-colors [-webkit-tap-highlight-color:transparent] group-hover:bg-light-three_d after:absolute after:inset-0 after:rounded-2xl focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-dark-three dark:text-dark-one dark:group-hover:bg-dark-three_d dark:focus-visible:ring-dark-three/40"
		>
			Ver más<span class="sr-only">: {vale.nombre}</span>
		</a>
	</div>
</article>
