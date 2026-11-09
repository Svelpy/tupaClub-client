import { apiFidelityTupa } from '#lib/config/index.ts';
import type { ReportePuntosParams } from '#lib/interfaces/index.ts';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Un periodo largo puede tardar en generarse: más margen que el timeout por defecto
const REPORTE_TIMEOUT = 120_000;

class ReporteService {
	/**
	 * Excel de puntos asignados o canjeados en el periodo. Hojas: "Por sucursal" (una fila por día)
	 * y "Por usuario" (totales del periodo). Solo SUPERADMIN, OWNER y ADMIN.
	 */
	async descargarPuntos({ fecha_inicio, fecha_fin, tipo }: ReportePuntosParams): Promise<Blob> {
		const query = new URLSearchParams({ fecha_inicio, fecha_fin, tipo });
		return apiFidelityTupa.getBlob(`/reportes/puntos?${query}`, {
			requireAuth: true,
			timeout: REPORTE_TIMEOUT,
			customHeaders: { Accept: XLSX_MIME }
		});
	}
}

export const reporteService = new ReporteService();
