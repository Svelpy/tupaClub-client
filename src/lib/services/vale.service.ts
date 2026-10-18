import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	CreateValeRequest,
	SugerirPuntosRequest,
	SugerirPuntosResponse,
	UpdateValeRequest,
	ValeDetail,
	ValeDetailResponse,
	ValeListParams,
	ValeListResponse
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

/** Campos del vale como multipart: se omiten los que no se envían (undefined) o no tienen valor */
function toFormData(data: UpdateValeRequest): FormData {
	const formData = new FormData();
	for (const [field, value] of Object.entries(data)) {
		if (value === undefined || value === null) continue;
		formData.append(field, value instanceof File ? value : String(value));
	}
	return formData;
}

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

	async get(id: string): Promise<ValeDetailResponse> {
		return apiFidelityTupa.get<ValeDetailResponse>(`/vales/${encodeURIComponent(id)}`, {
			requireAuth: true
		});
	}

	async create(data: CreateValeRequest): Promise<ValeDetail> {
		return apiFidelityTupa.post<ValeDetail>('/vales/', toFormData(data), { requireAuth: true });
	}

	async update(id: string, data: UpdateValeRequest): Promise<ValeDetail> {
		const formData = toFormData(data);
		// En multipart no existe null: vaciar la descripción se envía como texto vacío
		if (data.descripcion === null) formData.append('descripcion', '');

		return apiFidelityTupa.patch<ValeDetail>(`/vales/${encodeURIComponent(id)}`, formData, {
			requireAuth: true
		});
	}

	/** Responde 204 sin cuerpo */
	async delete(id: string): Promise<void> {
		await apiFidelityTupa.delete(`/vales/${encodeURIComponent(id)}`, undefined, {
			requireAuth: true
		});
	}

	/** Puntos que debería costar un vale de ese valor según la configuración activa */
	async sugerirPuntos(data: SugerirPuntosRequest): Promise<SugerirPuntosResponse> {
		return apiFidelityTupa.post<SugerirPuntosResponse>('/vales/sugerir-puntos', data, {
			requireAuth: true
		});
	}
}

export const valeService = new ValeService();
