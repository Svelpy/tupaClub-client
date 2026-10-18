<script lang="ts">
	import { resolve } from '$app/paths';
	import { NIVEL_CLIENTE_LABEL } from '#lib/constants/index.ts';
	import { NivelIcon } from '#lib/icons/niveles/index.ts';
	import { ChevronRightIcon, SparklesIcon } from '#lib/icons/outline/index.ts';
	import type { ResumenCliente } from '#lib/interfaces/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';
	import NivelProgress from './nivelProgress.svelte';

	interface Props {
		resumen: ResumenCliente;
	}

	let { resumen }: Props = $props();
</script>

<!-- Saldo y nivel: el dato principal de la app. Abre el detalle de movimientos -->
<a
	href={resolve('/app/mis-movimientos')}
	class="group block space-y-5 rounded-3xl bg-light-three p-6 text-light-one shadow-lg transition-transform [-webkit-tap-highlight-color:transparent] focus-visible:ring-4 focus-visible:ring-light-three/30 focus-visible:outline-none active:scale-[0.98] md:p-8 dark:bg-dark-three dark:text-dark-one dark:focus-visible:ring-dark-three/30"
>
	<div class="flex items-center justify-between gap-3">
		<div class="min-w-0">
			<p
				class="flex items-center gap-2 text-sm font-medium text-light-one/80 dark:text-dark-one/80"
			>
				<SparklesIcon class="size-4" />
				Tus puntos
			</p>
			<p class="mt-1 text-4xl font-bold tabular-nums md:text-5xl">
				{formatNumber(resumen.puntos)}
			</p>
		</div>

		<!-- Insignia del nivel actual -->
		<div class="flex shrink-0 flex-col items-center gap-1.5">
			<NivelIcon
				nivel={resumen.nivel.actual}
				class="size-16 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none md:size-20"
			/>
			<span
				class="rounded-full bg-light-one/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase dark:bg-dark-one/15"
			>
				{NIVEL_CLIENTE_LABEL[resumen.nivel.actual]}
			</span>
		</div>
	</div>

	<NivelProgress nivel={resumen.nivel} />

	<p
		class="inline-flex items-center gap-1 text-sm font-medium text-light-one/80 dark:text-dark-one/80"
	>
		Ver movimientos
		<ChevronRightIcon class="size-4 transition-transform group-hover:translate-x-0.5" />
	</p>
</a>
