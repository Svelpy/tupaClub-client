<script lang="ts">
	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
	const card =
		'rounded-2xl border border-light-one_d bg-light-one dark:border-dark-one_d dark:bg-dark-one';
</script>

<!-- Mismo layout que el detalle del vale en /app/vales/[valeId] -->
<div
	role="status"
	aria-label="Cargando vale"
	class="mt-4 grid animate-pulse gap-6 md:mt-0 md:grid-cols-2 md:gap-8 lg:gap-12"
>
	<span class="sr-only">Cargando…</span>

	<div class="aspect-4/3 rounded-3xl bg-light-one_d dark:bg-dark-one_d" aria-hidden="true"></div>

	<div class="space-y-6" aria-hidden="true">
		<div class="space-y-3">
			<div class="h-7 w-32 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
			<div class={['h-7 w-4/5', block]}></div>
			<div class="flex items-center gap-2.5">
				<div class="size-10 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
				<div class={['h-4 w-36', block]}></div>
			</div>
		</div>

		<div class={['space-y-3 p-4', card]}>
			<div class="flex items-center justify-between">
				<div class={['h-4 w-28', block]}></div>
				<div class={['h-7 w-24', block]}></div>
			</div>
			<div class={['h-4 w-11/12', block]}></div>
		</div>

		<div class="space-y-2">
			<div class={['h-4 w-24', block]}></div>
			<div class={['h-3.5 w-full', block]}></div>
			<div class={['h-3.5 w-3/4', block]}></div>
		</div>

		<div class={['divide-y divide-light-one_d dark:divide-dark-one_d', card]}>
			{#each [0, 1, 2] as i (i)}
				<div class="flex gap-3 p-4">
					<div class="size-10 shrink-0 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="flex-1 space-y-2">
						<div class={['h-4 w-1/3', block]}></div>
						<div class={['h-3.5 w-4/5', block]}></div>
					</div>
				</div>
			{/each}
		</div>

		<div class="hidden h-13 rounded-lg bg-light-one_d md:block dark:bg-dark-one_d"></div>
	</div>
</div>
