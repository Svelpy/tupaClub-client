<script lang="ts">
	interface Props {
		/** Cantidad de cuadros a mostrar */
		items?: number;
	}

	let { items = 12 }: Props = $props();

	// Anchos variados para que los nombres no se vean idénticos
	const NAME_WIDTHS = ['w-3/4', 'w-1/2', 'w-2/3', 'w-4/5', 'w-3/5'];

	const tiles = $derived(Array.from({ length: items }, (_, i) => i));
</script>

<!-- Mismo layout que la grilla de CategoriaTile en /app/categorias -->
<div role="status" aria-label="Cargando categorías">
	<span class="sr-only">Cargando…</span>

	<ul class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6" aria-hidden="true">
		{#each tiles as i (i)}
			<li
				class="flex animate-pulse flex-col items-center justify-center gap-3 rounded-2xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
			>
				<div class="size-12 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
				<div class="flex min-h-8 w-full items-center justify-center">
					<div
						class={[
							'h-3 rounded bg-light-one_d dark:bg-dark-one_d',
							NAME_WIDTHS[i % NAME_WIDTHS.length]
						]}
					></div>
				</div>
			</li>
		{/each}
	</ul>
</div>
