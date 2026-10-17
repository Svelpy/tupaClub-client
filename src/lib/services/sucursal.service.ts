import { apiFidelityTupa } from '#lib/config/index.ts';
import type { CreateSucursalRequest, SucursalDetail } from '#lib/interfaces/index.ts';

class SucursalService {
	async create(data: CreateSucursalRequest): Promise<SucursalDetail> {
		return apiFidelityTupa.post<SucursalDetail>('/sucursales/', data, { requireAuth: true });
	}
}

export const sucursalService = new SucursalService();
