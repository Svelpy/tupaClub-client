import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	CreateSucursalRequest,
	SucursalDetail,
	UpdateSucursalRequest
} from '#lib/interfaces/index.ts';

class SucursalService {
	async create(data: CreateSucursalRequest): Promise<SucursalDetail> {
		return apiFidelityTupa.post<SucursalDetail>('/sucursales/', data, { requireAuth: true });
	}

	async update(id: string, data: UpdateSucursalRequest): Promise<SucursalDetail> {
		return apiFidelityTupa.patch<SucursalDetail>(`/sucursales/${encodeURIComponent(id)}`, data, {
			requireAuth: true
		});
	}

	/** Responde 204 sin cuerpo */
	async delete(id: string): Promise<void> {
		await apiFidelityTupa.delete(`/sucursales/${encodeURIComponent(id)}`, undefined, {
			requireAuth: true
		});
	}
}

export const sucursalService = new SucursalService();
