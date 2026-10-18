<script lang="ts">
	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que el contenido de RegistrarCompraResumen -->
<div
	role="status"
	aria-label="Cargando configuración de puntos"
	class="animate-pulse space-y-5 p-5"
>
	<span class="sr-only">Cargando…</span>

	<div class="space-y-2" aria-hidden="true">
		<div class={['h-3 w-20', block]}></div>
		<div class={['h-4 w-4/5', block]}></div>
	</div>

	<div
		class="flex flex-col items-center gap-2 rounded-xl bg-light-one_d/60 p-4 dark:bg-dark-one_d/60"
		aria-hidden="true"
	>
		<div class="h-3 w-28 rounded bg-light-one dark:bg-dark-one"></div>
		<div class="h-9 w-20 rounded bg-light-one dark:bg-dark-one"></div>
		<div class="h-3 w-12 rounded bg-light-one dark:bg-dark-one"></div>
		<div class="mt-2 h-3 w-3/4 rounded bg-light-one dark:bg-dark-one"></div>
	</div>

	<div class="h-13 w-full rounded-lg bg-light-one_d dark:bg-dark-one_d" aria-hidden="true"></div>
</div>
