import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	Cliente,
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
	async list({
		order_by_points,
		...pagination
	}: ClienteListParams = {}): Promise<ClienteListResponse> {
		const query = buildPaginationQuery(pagination);
		query.set('role', CLIENTE_ROLE);
		// Solo se envía cuando se pide el orden por puntos
		if (order_by_points) query.set('order_by_points', 'true');
		return apiFidelityTupa.get<ClienteListResponse>(`/users/?${query}`, {
			requireAuth: true
		});
	}

	/**
	 * Usuario con esa cédula (solo dígitos, 6 a 20). Puede tener cualquier rol: validar que sea CLIENTE.
	 * Responde 404 si no existe.
	 */
	async getByCi(ci: string): Promise<Cliente> {
		return apiFidelityTupa.get<Cliente>(`/users/ci/${encodeURIComponent(ci)}`, {
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
