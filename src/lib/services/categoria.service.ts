import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	CategoriaDetail,
	CategoriaListParams,
	CategoriaListResponse,
	CreateCategoriaRequest,
	UpdateCategoriaRequest
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

class CategoriaService {
	async list(params: CategoriaListParams = {}): Promise<CategoriaListResponse> {
		const query = buildPaginationQuery(params);
		return apiFidelityTupa.get<CategoriaListResponse>(`/categorias/?${query}`, {
			requireAuth: true
		});
	}

	async get(id: string): Promise<CategoriaDetail> {
		return apiFidelityTupa.get<CategoriaDetail>(`/categorias/${encodeURIComponent(id)}`, {
			requireAuth: true
		});
	}

	async create(data: CreateCategoriaRequest): Promise<CategoriaDetail> {
		return apiFidelityTupa.post<CategoriaDetail>('/categorias/', data, { requireAuth: true });
	}

	async update(id: string, data: UpdateCategoriaRequest): Promise<CategoriaDetail> {
		return apiFidelityTupa.patch<CategoriaDetail>(`/categorias/${encodeURIComponent(id)}`, data, {
			requireAuth: true
		});
	}

	/** Responde 204 sin cuerpo */
	async delete(id: string): Promise<void> {
		await apiFidelityTupa.delete(`/categorias/${encodeURIComponent(id)}`, undefined, {
			requireAuth: true
		});
	}
}

export const categoriaService = new CategoriaService();
