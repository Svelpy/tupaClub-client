import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	CanjeDetail,
	CanjeListParams,
	CanjeListResponse,
	ExpireCanjesResponse,
	RedeemCanjeRequest
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

class CanjeService {
	/** Canjes visibles para el usuario (según su rol y sucursales), cada uno con su vale */
	async list({
		status,
		sucursal_id,
		...pagination
	}: CanjeListParams = {}): Promise<CanjeListResponse> {
		const query = buildPaginationQuery(pagination);
		if (status) query.set('status', status);
		if (sucursal_id) query.set('sucursal_id', sucursal_id);

		return apiFidelityTupa.get<CanjeListResponse>(`/canjes/?${query}`, { requireAuth: true });
	}

	/** Confirma el canje pendiente que corresponde al código que presenta el cliente */
	async redeem(data: RedeemCanjeRequest): Promise<CanjeDetail> {
		return apiFidelityTupa.post<CanjeDetail>('/canjes/redeem', data, { requireAuth: true });
	}

	/** Solo se pueden cancelar canjes PENDIENTE */
	async cancel(id: string): Promise<CanjeDetail> {
		return apiFidelityTupa.post<CanjeDetail>(
			`/canjes/${encodeURIComponent(id)}/cancel`,
			undefined,
			{ requireAuth: true }
		);
	}

	/** Pasa a EXPIRADO todos los canjes pendientes cuyo expires_at ya pasó */
	async expire(): Promise<ExpireCanjesResponse> {
		return apiFidelityTupa.post<ExpireCanjesResponse>('/canjes/expire', undefined, {
			requireAuth: true
		});
	}
}

export const canjeService = new CanjeService();
