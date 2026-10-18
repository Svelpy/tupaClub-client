import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	AdministradorDetail,
	AdministradorListParams,
	AdministradorListResponse,
	CreateAdministradorRequest,
	ResetAdministradorPasswordRequest,
	UpdateAdministradorRequest
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

/** Usuarios del panel: se gestionan desde `/users/`, igual que los clientes pero con otros roles */
class AdministradorService {
	async list({
		role,
		sucursal_id,
		...pagination
	}: AdministradorListParams): Promise<AdministradorListResponse> {
		const query = buildPaginationQuery(pagination);
		query.set('role', role);
		if (sucursal_id) query.set('sucursal_id', sucursal_id);

		return apiFidelityTupa.get<AdministradorListResponse>(`/users/?${query}`, {
			requireAuth: true
		});
	}

	async create(data: CreateAdministradorRequest): Promise<AdministradorDetail> {
		return apiFidelityTupa.post<AdministradorDetail>('/users/', data, { requireAuth: true });
	}

	async update(id: string, data: UpdateAdministradorRequest): Promise<AdministradorDetail> {
		return apiFidelityTupa.patch<AdministradorDetail>(`/users/${encodeURIComponent(id)}`, data, {
			requireAuth: true
		});
	}

	/** Responde 204 sin cuerpo */
	async delete(id: string): Promise<void> {
		await apiFidelityTupa.delete(`/users/${encodeURIComponent(id)}`, undefined, {
			requireAuth: true
		});
	}

	async resetPassword(
		id: string,
		data: ResetAdministradorPasswordRequest
	): Promise<AdministradorDetail> {
		return apiFidelityTupa.patch<AdministradorDetail>(
			`/users/${encodeURIComponent(id)}/password`,
			data,
			{ requireAuth: true }
		);
	}
}

export const administradorService = new AdministradorService();
