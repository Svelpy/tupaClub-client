import { apiFidelityTupa } from '#lib/config/index.ts';
import type { ValeListParams, ValeListResponse } from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

class ValeService {
	async list({
		categoria_id,
		negocio_id,
		...pagination
	}: ValeListParams = {}): Promise<ValeListResponse> {
		const query = buildPaginationQuery(pagination);
		if (categoria_id) query.set('categoria_id', categoria_id);
		if (negocio_id) query.set('negocio_id', negocio_id);

		return apiFidelityTupa.get<ValeListResponse>(`/vales/?${query}`, { requireAuth: true });
	}
}

export const valeService = new ValeService();
