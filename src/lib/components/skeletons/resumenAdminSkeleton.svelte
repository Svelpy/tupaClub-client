<script lang="ts">
	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
	const card =
		'rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one';
</script>

<!-- Mismo layout que el resumen de /panel (hoy, pendientes, mes, top de vales y clientes) -->
<div role="status" aria-label="Cargando resumen" class="animate-pulse space-y-6">
	<span class="sr-only">Cargando…</span>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-hidden="true">
		<div
			class="space-y-6 rounded-2xl bg-light-three/15 p-5 md:p-6 lg:col-span-2 dark:bg-dark-three/15"
		>
			<div class="space-y-2">
				<div class={['h-4 w-40', block]}></div>
				<div class={['h-10 w-56 md:h-12', block]}></div>
			</div>
			<div class="grid grid-cols-3 gap-3 pt-4">
				{#each [0, 1, 2] as i (i)}
					<div class="space-y-2">
						<div class={['h-3 w-16', block]}></div>
						<div class={['h-6 w-12', block]}></div>
					</div>
				{/each}
			</div>
		</div>
		<div class={['space-y-4', card]}>
			<div class="flex gap-3">
				<div class="size-10 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
				<div class="space-y-2">
					<div class={['h-4 w-32', block]}></div>
					<div class={['h-3 w-40', block]}></div>
				</div>
			</div>
			<div class={['h-10 w-16', block]}></div>
			<div class={['h-4 w-28', block]}></div>
		</div>
	</div>

	<div class="space-y-3" aria-hidden="true">
		<div class={['h-5 w-24', block]}></div>
		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{#each [0, 1, 2, 3] as i (i)}
				<div
					class="space-y-3 rounded-2xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
				>
					<div class="flex items-center gap-2">
						<div class="size-8 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
						<div class={['h-4 w-20', block]}></div>
					</div>
					<div class={['h-7 w-24', block]}></div>
					<div class={['h-3 w-16', block]}></div>
				</div>
			{/each}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-hidden="true">
		<div class={['space-y-5 lg:col-span-2', card]}>
			<div class={['h-5 w-40', block]}></div>
			{#each ['w-full', 'w-3/4', 'w-1/2', 'w-1/3'] as width (width)}
				<div class="flex items-center gap-3">
					<div class="size-7 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="flex-1 space-y-2">
						<div class={['h-4 w-1/2', block]}></div>
						<div class={['h-2', block, width]}></div>
					</div>
				</div>
			{/each}
		</div>
		<div class={['space-y-4', card]}>
			<div class={['h-5 w-24', block]}></div>
			{#each [0, 1, 2] as i (i)}
				<div class="flex items-center gap-3">
					<div class="size-9 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
					<div class={['h-4 flex-1', block]}></div>
					<div class={['h-5 w-14', block]}></div>
				</div>
			{/each}
		</div>
	</div>
</div>
