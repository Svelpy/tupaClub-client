/**
 * Puntos que genera una compra con la configuración activa, igual que el backend:
 * floor(total × puntos / bolivianos). Se calcula en centavos para evitar errores de coma flotante.
 */
export function calcularPuntosCompra(
	total: number,
	asignacionBolivianos: number,
	asignacionPuntos: number
): number {
	if (!(total > 0) || !(asignacionBolivianos > 0) || !(asignacionPuntos > 0)) return 0;
	const centavos = Math.round(total * 100);
	return Math.floor((centavos * asignacionPuntos) / (asignacionBolivianos * 100));
}
