<script lang="ts">
	import { NIVEL_CLIENTE_LABEL } from '#lib/constants/index.ts';
	import { NivelIcon } from '#lib/icons/niveles/index.ts';
	import type { NivelClienteResumen } from '#lib/interfaces/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		nivel: NivelClienteResumen;
	}

	let { nivel }: Props = $props();

	// La API ya lo envía entre 0 y 100; se acota por si llega fuera de rango
	const progreso = $derived(Math.min(100, Math.max(0, nivel.progreso)));
	const siguienteLabel = $derived(nivel.siguiente ? NIVEL_CLIENTE_LABEL[nivel.siguiente] : null);
	const rango = $derived(
		nivel.puntos_max === null
			? `${formatNumber(nivel.puntos_min)}+ pts`
			: `${formatNumber(nivel.puntos_min)} – ${formatNumber(nivel.puntos_max)} pts`
	);
</script>

<div class="space-y-2.5">
	<!-- Del nivel actual al siguiente -->
	<div class="flex items-center gap-3">
		<NivelIcon nivel={nivel.actual} class="size-8 shrink-0" />
		<div
			role="progressbar"
			aria-valuenow={progreso}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={siguienteLabel
				? `Progreso hacia el nivel ${siguienteLabel}`
				: 'Nivel máximo alcanzado'}
			class="h-2.5 flex-1 overflow-hidden rounded-full bg-light-one/20 dark:bg-dark-one/20"
		>
			<div
				class="h-full rounded-full bg-light-one transition-[width] duration-700 ease-out motion-reduce:transition-none dark:bg-dark-one"
				style:width="{progreso}%"
			></div>
		</div>
		{#if nivel.siguiente}
			<NivelIcon nivel={nivel.siguiente} class="size-8 shrink-0" />
		{/if}
	</div>

	<div class="flex items-center justify-between gap-2 text-sm">
		<p class="text-light-one/90 dark:text-dark-one/90">
			{#if siguienteLabel && nivel.puntos_para_siguiente !== null}
				Te faltan
				<strong class="font-semibold tabular-nums">
					{formatNumber(nivel.puntos_para_siguiente)} pts
				</strong>
				para {siguienteLabel}
			{:else}
				¡Alcanzaste el nivel máximo!
			{/if}
		</p>
		<p class="shrink-0 text-xs text-light-one/70 tabular-nums dark:text-dark-one/70">{rango}</p>
	</div>
</div>
