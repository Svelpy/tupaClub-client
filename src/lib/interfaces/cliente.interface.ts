import type { UserGenero, UserRole } from './auth.interface';
import type { PaginatedResponse, PaginationParams } from './pagination.interface';

/** Usuario con rol CLIENTE devuelto por `/users/` */
export interface Cliente {
	id: string;
	/** Cédula de identidad */
	ci: string;
	nombre: string;
	apellidos: string | null;
	email: string | null;
	telefono: string | null;
	direccion: string | null;
	/** Formato YYYY-MM-DD */
	birth_date: string | null;
	genero: UserGenero | null;
	avatar_url: string | null;
	puntos: number;
	role: UserRole;
	/** Sucursal donde se registró el cliente */
	sucursal_id: string | null;
	created_at: string;
	updated_at: string | null;
}

/** El rol se fija internamente en el service (siempre CLIENTE) */
export interface ClienteListParams extends PaginationParams {
	/** true = ordenados de más a menos puntos */
	order_by_points?: boolean;
}

export type ClienteListResponse = PaginatedResponse<Cliente>;

/** El rol se agrega internamente en el service (siempre CLIENTE) */
export interface CreateClienteRequest {
	nombre: string;
	apellidos: string | null;
	/** Cédula de identidad */
	ci: string;
	telefono: string;
	genero: UserGenero;
	email: string | null;
	/** Formato YYYY-MM-DD */
	birth_date: string | null;
	direccion: string | null;
}

/** Cliente completo con datos de auditoría (respuesta de crear/editar) */
export interface ClienteDetail extends Cliente {
	is_deleted: boolean;
}

/** PATCH: solo se envían los campos modificados */
export type UpdateClienteRequest = Partial<CreateClienteRequest>;

export interface ResetClientePasswordRequest {
	new_password: string;
}
