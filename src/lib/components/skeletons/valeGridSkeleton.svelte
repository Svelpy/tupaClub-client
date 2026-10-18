<script lang="ts">
	interface Props {
		/** Cantidad de tickets a mostrar */
		items?: number;
	}

	let { items = 8 }: Props = $props();

	// Anchos variados para que las líneas no se vean idénticas
	const NEGOCIO_WIDTHS = ['w-1/2', 'w-2/3', 'w-2/5', 'w-3/5'];
	const NOMBRE_WIDTHS = ['w-4/5', 'w-3/5', 'w-11/12', 'w-2/3'];

	const cards = $derived(Array.from({ length: items }, (_, i) => i));

	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que la grilla de ValeTicketCard -->
<div role="status" aria-label="Cargando vales">
	<span class="sr-only">Cargando…</span>

	<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
		{#each cards as i (i)}
			<li
				class="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:border-dark-one_d dark:bg-dark-one"
			>
				<div class="aspect-4/3 w-full bg-light-one_d dark:bg-dark-one_d"></div>
				<div class="flex-1 space-y-2 px-3 pt-3 pb-4">
					<div class={['h-3', block, NEGOCIO_WIDTHS[i % NEGOCIO_WIDTHS.length]]}></div>
					<div class={['h-3.5', block, NOMBRE_WIDTHS[i % NOMBRE_WIDTHS.length]]}></div>
					<div class={['h-3.5 w-1/3', block]}></div>
				</div>
				<div
					class="flex h-21 flex-col items-center gap-2.5 border-t-2 border-dashed border-light-one_d px-3 pt-2.5 pb-3 dark:border-dark-one_d"
				>
					<div class={['h-7 w-16', block]}></div>
					<div class="h-9 w-full rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
				</div>
			</li>
		{/each}
	</ul>
</div>
