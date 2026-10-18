import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	Canje,
	CanjeConsulta,
	CanjeDetail,
	CanjeListParams,
	CanjeListResponse,
	CreateCanjeRequest,
	ExpireCanjesResponse,
	MiCanjeListParams,
	MiCanjeListResponse
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

	/** Solo para el rol CLIENTE: canjes del usuario en sesión, cada uno con su vale y su negocio */
	async listMine({ status, ...pagination }: MiCanjeListParams = {}): Promise<MiCanjeListResponse> {
		const query = buildPaginationQuery(pagination);
		if (status) query.set('status', status);

		return apiFidelityTupa.get<MiCanjeListResponse>(`/canjes/me?${query}`, { requireAuth: true });
	}

	/**
	 * Solo para el rol CLIENTE: canjea el vale con sus puntos. El canje queda PENDIENTE con su
	 * código hasta que lo presenta en una sucursal. Responde 409 si no le alcanzan los puntos.
	 */
	async create(data: CreateCanjeRequest): Promise<CanjeDetail> {
		return apiFidelityTupa.post<CanjeDetail>('/canjes/', data, { requireAuth: true });
	}

	/**
	 * Canje que corresponde al código que presenta el cliente, en cualquier estado. Se consulta antes
	 * de confirmarlo o cancelarlo para ver si sigue pendiente. Responde 404 si el código no existe.
	 */
	async getByCodigo(codigo: string): Promise<CanjeConsulta> {
		return apiFidelityTupa.get<CanjeConsulta>(`/canjes/codigo/${encodeURIComponent(codigo)}`, {
			requireAuth: true
		});
	}

	/** Confirma un canje PENDIENTE: el cliente se lleva el vale */
	async redeem(id: string): Promise<CanjeConsulta> {
		return apiFidelityTupa.post<CanjeConsulta>(
			`/canjes/${encodeURIComponent(id)}/redeem`,
			undefined,
			{ requireAuth: true }
		);
	}

	/** Solo se pueden cancelar canjes PENDIENTE */
	async cancel(id: string): Promise<Canje> {
		return apiFidelityTupa.post<Canje>(`/canjes/${encodeURIComponent(id)}/cancel`, undefined, {
			requireAuth: true
		});
	}

	/** Pasa a EXPIRADO todos los canjes pendientes cuyo expires_at ya pasó */
	async expire(): Promise<ExpireCanjesResponse> {
		return apiFidelityTupa.post<ExpireCanjesResponse>('/canjes/expire', undefined, {
			requireAuth: true
		});
	}
}

export const canjeService = new CanjeService();
