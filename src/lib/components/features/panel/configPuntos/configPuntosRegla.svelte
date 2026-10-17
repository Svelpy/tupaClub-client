<script lang="ts">
	import { formatDecimal } from '#lib/utils/index.ts';

	interface Props {
		/** asignacion: puntos ganados por compra · vale: puntos que cuesta un vale */
		type: 'asignacion' | 'vale';
		bolivianos: number;
		puntos: number;
	}

	let { type, bolivianos, puntos }: Props = $props();
</script>

<p class="text-light-two dark:text-dark-two">
	{#if type === 'asignacion'}
		<span class="font-semibold tabular-nums">{formatDecimal(puntos)} puntos</span>
		por cada
		<span class="font-semibold tabular-nums">Bs {formatDecimal(bolivianos)}</span>
		de compra
	{:else}
		Vale de
		<span class="font-semibold tabular-nums">Bs {formatDecimal(bolivianos)}</span>
		cuesta
		<span class="font-semibold tabular-nums">{formatDecimal(puntos)} puntos</span>
	{/if}
</p>
