import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	ClienteDetail,
	ClienteListParams,
	ClienteListResponse,
	CreateClienteRequest,
	ResetClientePasswordRequest,
	UpdateClienteRequest,
	UserRole
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

/** Los clientes se gestionan desde `/users/` siempre con este rol */
const CLIENTE_ROLE: UserRole = 'CLIENTE';

class ClienteService {
	async list(params: ClienteListParams = {}): Promise<ClienteListResponse> {
		const query = buildPaginationQuery(params);
		query.set('role', CLIENTE_ROLE);
		return apiFidelityTupa.get<ClienteListResponse>(`/users/?${query}`, {
			requireAuth: true
		});
	}

	async create(data: CreateClienteRequest): Promise<ClienteDetail> {
		return apiFidelityTupa.post<ClienteDetail>(
			'/users/',
			{ ...data, role: CLIENTE_ROLE },
			{ requireAuth: true }
		);
	}

	async update(id: string, data: UpdateClienteRequest): Promise<ClienteDetail> {
		return apiFidelityTupa.patch<ClienteDetail>(`/users/${encodeURIComponent(id)}`, data, {
			requireAuth: true
		});
	}

	/** Responde 204 sin cuerpo */
	async delete(id: string): Promise<void> {
		await apiFidelityTupa.delete(`/users/${encodeURIComponent(id)}`, undefined, {
			requireAuth: true
		});
	}

	async resetPassword(id: string, data: ResetClientePasswordRequest): Promise<void> {
		await apiFidelityTupa.patch(`/users/${encodeURIComponent(id)}/password`, data, {
			requireAuth: true
		});
	}
}

export const clienteService = new ClienteService();
