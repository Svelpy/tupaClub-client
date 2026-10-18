<script lang="ts">
	interface Props {
		/** Cantidad de filas a mostrar */
		items?: number;
	}

	let { items = 6 }: Props = $props();

	// Anchos variados para que las líneas no se vean idénticas
	const TITLE_WIDTHS = ['w-2/5', 'w-3/5', 'w-1/2', 'w-2/3'];
	const SUBTITLE_WIDTHS = ['w-1/2', 'w-2/5', 'w-3/5', 'w-1/3'];

	const rows = $derived(Array.from({ length: items }, (_, i) => i));

	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que la lista de MiMovimientoItem -->
<div role="status" aria-label="Cargando tus movimientos" class="mt-4">
	<span class="sr-only">Cargando…</span>

	<ul
		class="divide-y divide-light-one_d overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:divide-dark-one_d dark:border-dark-one_d dark:bg-dark-one"
		aria-hidden="true"
	>
		{#each rows as i (i)}
			<li class="flex animate-pulse items-center gap-3 px-4 py-3.5">
				<div class="size-10 shrink-0 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
				<div class="min-w-0 flex-1 space-y-2">
					<div class={['h-3.5', block, TITLE_WIDTHS[i % TITLE_WIDTHS.length]]}></div>
					<div class={['h-3', block, SUBTITLE_WIDTHS[i % SUBTITLE_WIDTHS.length]]}></div>
				</div>
				<div class="flex shrink-0 flex-col items-end gap-2">
					<div class={['h-4 w-16', block]}></div>
					<div class={['h-3 w-12', block]}></div>
				</div>
			</li>
		{/each}
	</ul>
</div>
