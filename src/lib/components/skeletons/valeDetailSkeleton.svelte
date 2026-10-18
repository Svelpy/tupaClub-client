<script lang="ts">
	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que el contenido de ValeDetailModal -->
<div role="status" aria-label="Cargando vale" class="animate-pulse space-y-6">
	<span class="sr-only">Cargando…</span>

	<div
		class="flex flex-col items-center gap-4 rounded-2xl border border-light-one_d p-4 sm:flex-row dark:border-dark-one_d"
		aria-hidden="true"
	>
		<div class="size-20 shrink-0 rounded-2xl bg-light-one_d dark:bg-dark-one_d"></div>
		<div class="w-full flex-1 space-y-2">
			<div class={['mx-auto h-5 w-2/3 sm:mx-0', block]}></div>
			<div class={['mx-auto h-3.5 w-4/5 sm:mx-0', block]}></div>
			<div class={['mx-auto h-3.5 w-1/3 sm:mx-0', block]}></div>
		</div>
		<div class="h-20 w-24 shrink-0 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
	</div>

	<div class="space-y-3" aria-hidden="true">
		<div class={['h-3 w-20', block]}></div>
		<div class="flex items-center gap-3">
			<div class="size-11 shrink-0 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
			<div class="flex-1 space-y-2">
				<div class={['h-4 w-1/3', block]}></div>
				<div class={['h-3 w-1/4', block]}></div>
			</div>
		</div>
	</div>

	<div class="space-y-3" aria-hidden="true">
		<div class={['h-3 w-32', block]}></div>
		<div class="grid gap-2 sm:grid-cols-2">
			<div class="h-20 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
			<div class="h-20 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
		</div>
	</div>
</div>
