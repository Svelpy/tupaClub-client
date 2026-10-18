import type { Movimiento } from '#lib/interfaces/index.ts';
import { formatNumber } from './format';

/**
 * Puntos con el signo con que cambian el saldo: una acumulación suma y un canje resta aunque la
 * API los envíe en positivo. Un ajuste puede ir en cualquier sentido: se respeta el signo recibido.
 */
export function getMovimientoDelta({
	tipo_movimiento,
	puntos
}: Pick<Movimiento, 'tipo_movimiento' | 'puntos'>): number {
	if (tipo_movimiento === 'ACUMULA') return Math.abs(puntos);
	if (tipo_movimiento === 'CANJE') return -Math.abs(puntos);
	return puntos;
}

/** Puntos del movimiento con signo (p. ej. "+150 pts", "-500 pts") */
export function formatMovimientoPuntos(
	movimiento: Pick<Movimiento, 'tipo_movimiento' | 'puntos'>
): string {
	return `${formatNumber(getMovimientoDelta(movimiento), { signDisplay: 'exceptZero' })} pts`;
}
