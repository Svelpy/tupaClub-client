<script lang="ts">
	import type { MovimientoListItem } from '#lib/interfaces/index.ts';
	import { formatCurrency, formatValue } from '#lib/utils/index.ts';

	interface Props {
		item: MovimientoListItem;
	}

	let { item }: Props = $props();

	// Qué originó el movimiento: la compra (acumulación), el vale canjeado o un ajuste
	const detalle = $derived.by(() => {
		const { movimiento, operacion, canje, vale } = item;
		if (movimiento.tipo_movimiento === 'ACUMULA' && operacion) {
			return {
				title: `Compra de ${formatCurrency(operacion.total_compra)}`,
				subtitle: formatValue(operacion.referencia)
			};
		}
		if (movimiento.tipo_movimiento === 'CANJE' && (vale || canje)) {
			return {
				title: formatValue(vale?.nombre, { fallback: 'Canje de vale' }),
				subtitle: canje ? `Código ${canje.codigo_canje}` : formatValue(null)
			};
		}
		return {
			title: 'Ajuste de puntos',
			subtitle: movimiento.movimiento_origen_id
				? 'Corrige un movimiento anterior'
				: formatValue(null)
		};
	});
</script>

<p class="truncate text-light-two dark:text-dark-two" title={detalle.title}>{detalle.title}</p>
<p class="truncate text-xs text-light-two_d dark:text-dark-two_d" title={detalle.subtitle}>
	{detalle.subtitle}
</p>
