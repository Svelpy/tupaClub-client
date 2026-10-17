import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	CreateNegocioRequest,
	NegocioDetail,
	NegocioListParams,
	NegocioListResponse,
	UpdateNegocioRequest
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

class NegocioService {
	async list({ tipo, ...pagination }: NegocioListParams = {}): Promise<NegocioListResponse> {
		const query = buildPaginationQuery(pagination);
		if (tipo) query.set('tipo', tipo);

		return apiFidelityTupa.get<NegocioListResponse>(`/negocios/?${query}`, {
			requireAuth: true
		});
	}

	async create(data: CreateNegocioRequest): Promise<NegocioDetail> {
		return apiFidelityTupa.post<NegocioDetail>('/negocios/', data, { requireAuth: true });
	}

	async update(id: string, data: UpdateNegocioRequest): Promise<NegocioDetail> {
		return apiFidelityTupa.patch<NegocioDetail>(`/negocios/${encodeURIComponent(id)}`, data, {
			requireAuth: true
		});
	}

	/** Responde 204 sin cuerpo */
	async delete(id: string): Promise<void> {
		await apiFidelityTupa.delete(`/negocios/${encodeURIComponent(id)}`, undefined, {
			requireAuth: true
		});
	}

	/** Sube o reemplaza la imagen (multipart/form-data, campo `file`) */
	async uploadImage(id: string, file: File): Promise<NegocioDetail> {
		const formData = new FormData();
		formData.append('file', file);
		return apiFidelityTupa.post<NegocioDetail>(
			`/negocios/${encodeURIComponent(id)}/image`,
			formData,
			{ requireAuth: true }
		);
	}

	async deleteImage(id: string): Promise<NegocioDetail> {
		return apiFidelityTupa.delete<NegocioDetail>(
			`/negocios/${encodeURIComponent(id)}/image`,
			undefined,
			{ requireAuth: true }
		);
	}
}

export const negocioService = new NegocioService();
