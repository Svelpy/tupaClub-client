/** Puntos que entraron por compras (ASIGNADOS) o salieron por canjes (CANJEADOS) */
export type ReporteTipo = 'ASIGNADOS' | 'CANJEADOS';

/** Query de `GET /reportes/puntos`. Fechas en formato YYYY-MM-DD, ambas inclusive */
export interface ReportePuntosParams {
	fecha_inicio: string;
	fecha_fin: string;
	tipo: ReporteTipo;
}
