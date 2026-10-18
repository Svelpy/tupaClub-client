<script lang="ts">
	interface Props {
		/** Igual que en PerfilView: bloque del saldo de puntos en el resumen */
		showPuntos?: boolean;
		/** Igual que en PerfilView: tarjeta de negocio y sucursal */
		showSucursal?: boolean;
	}

	let { showPuntos = false, showSucursal = false }: Props = $props();

	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
	const card =
		'rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one';
	const input = 'h-11 rounded-xl bg-light-one_d dark:bg-dark-one_d';
</script>

<!-- Mismo layout que PerfilView: resumen (y sucursal) a la izquierda, formularios a la derecha -->
<div
	role="status"
	aria-label="Cargando tu perfil"
	class="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start"
>
	<span class="sr-only">Cargando…</span>

	<div class="space-y-6" aria-hidden="true">
		<!-- PerfilResumenCard -->
		<div class={[card, 'flex flex-col items-center']}>
			<div class="size-28 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
			<div class={['mt-3 h-3 w-40', block]}></div>
			<div class={['mt-5 h-6 w-48', block]}></div>
			<div class={['mt-2 h-4 w-24', block]}></div>
			<div class="mt-3 h-5 w-24 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
			{#if showPuntos}
				<div class="mt-5 h-17 w-full rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
			{/if}
			<div class="mt-5 w-full space-y-3 border-t border-light-one_d pt-4 dark:border-dark-one_d">
				<div class="flex justify-between">
					<div class={['h-4 w-24', block]}></div>
					<div class={['h-4 w-20', block]}></div>
				</div>
				<div class="flex justify-between">
					<div class={['h-4 w-32', block]}></div>
					<div class={['h-4 w-28', block]}></div>
				</div>
			</div>
		</div>

		<!-- PerfilSucursalCard -->
		{#if showSucursal}
			<div class={card}>
				<div class={['h-5 w-36', block]}></div>
				<div class="mt-4 flex items-center gap-3">
					<div class="size-11 shrink-0 rounded-xl bg-light-one_d dark:bg-dark-one_d"></div>
					<div class="flex-1 space-y-2">
						<div class={['h-4 w-2/3', block]}></div>
						<div class="h-5 w-16 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
					</div>
				</div>
				<div class="mt-4 space-y-4 border-t border-light-one_d pt-4 dark:border-dark-one_d">
					{#each ['w-1/2', 'w-4/5', 'w-1/3'] as width (width)}
						<div class="flex gap-3">
							<div class="size-9 shrink-0 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
							<div class="flex-1 space-y-1.5">
								<div class={['h-3 w-16', block]}></div>
								<div class={['h-4', width, block]}></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="space-y-6" aria-hidden="true">
		<!-- PerfilDatosForm -->
		<div class={card}>
			<div class={['h-5 w-40', block]}></div>
			<div class={['mt-2 h-4 w-3/4', block]}></div>
			<div class="mt-5 grid gap-5 sm:grid-cols-2">
				{#each [0, 1, 2, 3, 4, 5] as i (i)}
					<div class="space-y-2">
						<div class={['h-4', i % 2 ? 'w-36' : 'w-24', block]}></div>
						<div class={input}></div>
					</div>
				{/each}
				<div class="space-y-2 sm:col-span-2">
					<div class={['h-4 w-32', block]}></div>
					<div class={input}></div>
				</div>
			</div>
			<div class="mt-5 flex justify-end">
				<div class="h-11 w-full rounded-lg bg-light-one_d sm:w-40 dark:bg-dark-one_d"></div>
			</div>
		</div>

		<!-- PerfilPasswordForm -->
		<div class={card}>
			<div class={['h-5 w-44', block]}></div>
			<div class={['mt-2 h-4 w-2/3', block]}></div>
			<div class="mt-5 space-y-5">
				<div class="space-y-2 sm:max-w-[calc(50%-0.625rem)]">
					<div class={['h-4 w-32', block]}></div>
					<div class={input}></div>
				</div>
				<div class="grid gap-5 sm:grid-cols-2">
					{#each ['w-36', 'w-44'] as width (width)}
						<div class="space-y-2">
							<div class={['h-4', width, block]}></div>
							<div class={input}></div>
						</div>
					{/each}
				</div>
			</div>
			<div class="mt-5 flex justify-end">
				<div class="h-11 w-full rounded-lg bg-light-one_d sm:w-48 dark:bg-dark-one_d"></div>
			</div>
		</div>
	</div>
</div>
