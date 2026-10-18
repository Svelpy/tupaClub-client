import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	MiMovimientoListParams,
	MiMovimientoListResponse,
	MovimientoListParams,
	MovimientoListResponse
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

/** Movimientos de puntos: solo lectura, los generan las compras, los canjes y los ajustes */
class MovimientoService {
	async list({
		usuario_id,
		tipo,
		...pagination
	}: MovimientoListParams = {}): Promise<MovimientoListResponse> {
		const query = buildPaginationQuery(pagination);
		if (usuario_id) query.set('usuario_id', usuario_id);
		if (tipo) query.set('tipo', tipo);

		return apiFidelityTupa.get<MovimientoListResponse>(`/movimientos-puntos/?${query}`, {
			requireAuth: true
		});
	}

	/** Solo para el rol CLIENTE: sus propios movimientos, del más reciente al más antiguo */
	async listMine({
		tipo,
		...pagination
	}: MiMovimientoListParams = {}): Promise<MiMovimientoListResponse> {
		const query = buildPaginationQuery(pagination);
		if (tipo) query.set('tipo', tipo);

		return apiFidelityTupa.get<MiMovimientoListResponse>(`/movimientos-puntos/me?${query}`, {
			requireAuth: true
		});
	}
}

export const movimientoService = new MovimientoService();
