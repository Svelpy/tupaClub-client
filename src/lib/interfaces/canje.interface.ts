import type { PaginatedResponse, PaginationParams } from './pagination.interface';
import type { Vale } from './vale.interface';

/** PENDIENTE = esperando que el cliente presente su código en la sucursal */
export type CanjeStatus = 'PENDIENTE' | 'CANJEADO' | 'EXPIRADO' | 'CANCELADO';

export interface Canje {
	id: string;
	cliente_id: string;
	vale_id: string;
	config_punto_id: string;
	/** Código que el cliente presenta para confirmar el canje (p. ej. "00123456") */
	codigo_canje: string;
	referencia: string | null;
	status: CanjeStatus;
	/** Valor del vale en Bs al solicitar el canje, decimal como string (p. ej. "50.00") */
	total_costo: string;
	/** Puntos descontados al cliente por el canje */
	total_puntos: number;
	/** 30 días después de created_at. Vencido, sigue PENDIENTE hasta que se ejecuta /expire */
	expires_at: string;
	created_at: string;
	updated_at: string;
}

/** Vale tal como viene en el listado de canjes (sin imagen) */
export type CanjeVale = Omit<Vale, 'image_url'>;

/** Item del listado: el canje junto al vale canjeado */
export interface CanjeListItem {
	canje: Canje;
	vale: CanjeVale;
}

export interface CanjeListParams extends PaginationParams {
	/** Sin valor = todos los estados */
	status?: CanjeStatus | null;
	/** Sin valor = todas las sucursales visibles */
	sucursal_id?: string | null;
}

export type CanjeListResponse = PaginatedResponse<CanjeListItem>;

/** Canje completo con datos de auditoría (respuesta de confirmar y cancelar) */
export interface CanjeDetail extends Canje {
	is_deleted: boolean;
	created_by: string | null;
	updated_by: string | null;
}

export interface RedeemCanjeRequest {
	codigo_canje: string;
}

export interface ExpireCanjesResponse {
	/** Canjes pendientes vencidos que pasaron a EXPIRADO */
	expired_count: number;
}
