<script lang="ts">
	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que el resumen del cajero en /panel (ventas de hoy + registrar compra) -->
<div
	role="status"
	aria-label="Cargando resumen"
	class="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-3"
>
	<span class="sr-only">Cargando…</span>

	<div
		class="space-y-6 rounded-2xl bg-light-three/15 p-5 md:p-6 lg:col-span-2 dark:bg-dark-three/15"
		aria-hidden="true"
	>
		<div class="space-y-2">
			<div class={['h-4 w-36', block]}></div>
			<div class={['h-10 w-56 md:h-12', block]}></div>
		</div>
		<div class="grid grid-cols-3 gap-3 pt-4">
			{#each [0, 1, 2] as i (i)}
				<div class="space-y-2">
					<div class={['h-3 w-16', block]}></div>
					<div class={['h-6 w-14', block]}></div>
				</div>
			{/each}
		</div>
	</div>

	<div
		class="space-y-4 rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
		aria-hidden="true"
	>
		<div class="size-11 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
		<div class="space-y-2">
			<div class={['h-4 w-40', block]}></div>
			<div class={['h-3.5 w-full', block]}></div>
		</div>
		<div class="h-11 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
	</div>
</div>
