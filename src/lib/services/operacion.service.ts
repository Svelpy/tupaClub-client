import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	CreateOperacionRequest,
	OperacionDetail,
	OperacionListParams,
	OperacionListResponse
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

class OperacionService {
	/** Operaciones visibles para el usuario (según su rol y sucursales) */
	async list({
		emisor_id,
		receptor_id,
		sucursal_id,
		...pagination
	}: OperacionListParams = {}): Promise<OperacionListResponse> {
		const query = buildPaginationQuery(pagination);
		if (emisor_id) query.set('emisor_id', emisor_id);
		if (receptor_id) query.set('receptor_id', receptor_id);
		if (sucursal_id) query.set('sucursal_id', sucursal_id);

		return apiFidelityTupa.get<OperacionListResponse>(`/operaciones/?${query}`, {
			requireAuth: true
		});
	}

	/** Registra la compra y acumula los puntos según la configuración activa */
	async create(data: CreateOperacionRequest): Promise<OperacionDetail> {
		return apiFidelityTupa.post<OperacionDetail>('/operaciones/', data, { requireAuth: true });
	}
}

export const operacionService = new OperacionService();
