<script lang="ts">
	const block = 'rounded bg-light-one/20 dark:bg-dark-one/20';
</script>

<!-- Mismo layout que ResumenPuntosCard -->
<div
	role="status"
	aria-label="Cargando tu resumen"
	class="animate-pulse space-y-5 rounded-3xl bg-light-three p-6 shadow-lg md:p-8 dark:bg-dark-three"
>
	<span class="sr-only">Cargando…</span>

	<div class="flex items-center justify-between gap-3" aria-hidden="true">
		<div class="space-y-3">
			<div class={['h-4 w-24', block]}></div>
			<div class={['h-10 w-32 md:h-12', block]}></div>
		</div>
		<div class="flex flex-col items-center gap-1.5">
			<div class="size-16 rounded-2xl bg-light-one/20 md:size-20 dark:bg-dark-one/20"></div>
			<div class="h-5 w-16 rounded-full bg-light-one/20 dark:bg-dark-one/20"></div>
		</div>
	</div>

	<div class="space-y-2.5" aria-hidden="true">
		<div class="flex items-center gap-3">
			<div class="size-8 shrink-0 rounded-lg bg-light-one/20 dark:bg-dark-one/20"></div>
			<div class="h-2.5 flex-1 rounded-full bg-light-one/20 dark:bg-dark-one/20"></div>
			<div class="size-8 shrink-0 rounded-lg bg-light-one/20 dark:bg-dark-one/20"></div>
		</div>
		<div class="flex justify-between gap-2">
			<div class={['h-4 w-2/5', block]}></div>
			<div class={['h-3 w-20', block]}></div>
		</div>
	</div>

	<div class={['h-4 w-28', block]} aria-hidden="true"></div>
</div>
