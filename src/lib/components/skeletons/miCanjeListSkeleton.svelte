<script lang="ts">
	interface Props {
		/** Cantidad de tarjetas a mostrar */
		items?: number;
	}

	let { items = 4 }: Props = $props();

	// Anchos variados para que las líneas no se vean idénticas
	const NEGOCIO_WIDTHS = ['w-1/2', 'w-2/3', 'w-2/5', 'w-3/5'];
	const NOMBRE_WIDTHS = ['w-11/12', 'w-4/5', 'w-full', 'w-3/4'];
	const FECHA_WIDTHS = ['w-4/5', 'w-3/4', 'w-5/6', 'w-2/3'];

	const cards = $derived(Array.from({ length: items }, (_, i) => i));

	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que la grilla de MiCanjeCard -->
<div role="status" aria-label="Cargando tus canjes" class="mt-4">
	<span class="sr-only">Cargando…</span>

	<ul class="grid gap-3 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
		{#each cards as i (i)}
			<li
				class="flex animate-pulse gap-4 rounded-2xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
			>
				<div class="min-w-0 flex-1 space-y-2">
					<div class="aspect-4/3 w-full rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
					<div class={['mt-3 h-3.5', block, NEGOCIO_WIDTHS[i % NEGOCIO_WIDTHS.length]]}></div>
					<div class={['h-3.5', block, NOMBRE_WIDTHS[i % NOMBRE_WIDTHS.length]]}></div>
					<div class={['h-3', block, FECHA_WIDTHS[i % FECHA_WIDTHS.length]]}></div>
					<div class={['h-3 w-1/2', block]}></div>
				</div>
				<div class="flex w-28 shrink-0 flex-col items-center gap-1.5">
					<div class={['h-3 w-20', block]}></div>
					<div class="size-28 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
					<div class={['h-5 w-24', block]}></div>
				</div>
			</li>
		{/each}
	</ul>
</div>
