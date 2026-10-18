<script lang="ts">
	import type { Component } from 'svelte';
	import { MOVIMIENTO_TIPO_LABEL } from '#lib/constants/index.ts';
	import { GiftIcon, ScaleIcon, SparklesIcon } from '#lib/icons/outline/index.ts';
	import type { MiMovimientoListItem, MovimientoTipo } from '#lib/interfaces/index.ts';
	import {
		formatCodigoCanje,
		formatCurrency,
		formatDateTime,
		formatMovimientoPuntos,
		formatValue,
		getMovimientoDelta
	} from '#lib/utils/index.ts';

	interface Props {
		item: MiMovimientoListItem;
	}

	let { item }: Props = $props();

	const TIPO_STYLES: Record<MovimientoTipo, { icon: Component; class: string }> = {
		ACUMULA: {
			icon: SparklesIcon,
			class: 'bg-light-success/10 text-light-success dark:bg-dark-success/10 dark:text-dark-success'
		},
		CANJE: {
			icon: GiftIcon,
			class: 'bg-light-three/10 text-light-three dark:bg-dark-three/10 dark:text-dark-three'
		},
		AJUSTE: {
			icon: ScaleIcon,
			class: 'bg-light-warning/10 text-light-warning dark:bg-dark-warning/10 dark:text-dark-warning'
		}
	};

	const movimiento = $derived(item.movimiento);
	const tipoStyle = $derived(TIPO_STYLES[movimiento.tipo_movimiento] ?? TIPO_STYLES.AJUSTE);
	const delta = $derived(getMovimientoDelta(movimiento));

	// Qué originó el movimiento, en palabras del cliente: la compra, el vale canjeado o un ajuste
	const detalle = $derived.by(() => {
		const { operacion, canje, vale } = item;
		if (movimiento.tipo_movimiento === 'ACUMULA') {
			return {
				title: operacion
					? `Compra de ${formatCurrency(operacion.total_compra)}`
					: 'Puntos por compra',
				extra: operacion?.referencia ?? null
			};
		}
		if (movimiento.tipo_movimiento === 'CANJE') {
			return {
				title: formatValue(vale?.nombre, { fallback: 'Canje de vale' }),
				extra: canje ? `Código ${formatCodigoCanje(canje.codigo_canje)}` : null
			};
		}
		return {
			title: 'Ajuste de puntos',
			extra: movimiento.movimiento_origen_id ? 'Corrige un movimiento anterior' : null
		};
	});
</script>

<article class="flex items-center gap-3 px-4 py-3.5">
	<span
		class={['flex size-10 shrink-0 items-center justify-center rounded-full', tipoStyle.class]}
		aria-hidden="true"
	>
		<tipoStyle.icon class="size-5" />
	</span>

	<div class="min-w-0 flex-1">
		<h3
			class="truncate text-sm font-medium text-light-two dark:text-dark-two"
			title={detalle.title}
		>
			{detalle.title}
		</h3>
		<p class="mt-0.5 truncate text-xs text-light-two_d dark:text-dark-two_d">
			<time datetime={movimiento.created_at}>{formatDateTime(movimiento.created_at)}</time>
			{#if detalle.extra}
				<span aria-hidden="true">·</span>
				{detalle.extra}
			{/if}
		</p>
	</div>

	<div class="shrink-0 text-right">
		<p
			class={[
				'font-semibold tabular-nums',
				delta >= 0 ? 'text-light-three dark:text-dark-three' : 'text-light-two dark:text-dark-two'
			]}
		>
			{formatMovimientoPuntos(movimiento)}
		</p>
		<p class="mt-0.5 text-xs text-light-two_d dark:text-dark-two_d">
			{MOVIMIENTO_TIPO_LABEL[movimiento.tipo_movimiento] ?? movimiento.tipo_movimiento}
		</p>
	</div>
</article>
