import type { AssignableUserRole, PanelUserRole } from '#lib/config/permissions.config.ts';
import type { UserGenero, UserRole } from './auth.interface';
import type { PaginatedResponse, PaginationParams } from './pagination.interface';

/** Usuario del panel (cualquier rol salvo CLIENTE) devuelto por `/users/` */
export interface Administrador {
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
	/** Sucursal a la que pertenece el usuario */
	sucursal_id: string | null;
	created_at: string;
	updated_at: string | null;
}

export interface AdministradorListParams extends PaginationParams {
	/** Siempre se filtra por un rol: sin él la API también devuelve los CLIENTE */
	role: PanelUserRole;
	/** Sin valor = todas las sucursales */
	sucursal_id?: string | null;
}

export type AdministradorListResponse = PaginatedResponse<Administrador>;

export interface CreateAdministradorRequest {
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
	role: AssignableUserRole;
	sucursal_id: string;
}

/** Usuario completo con datos de auditoría (respuesta de crear/editar/restablecer contraseña) */
export interface AdministradorDetail extends Administrador {
	is_deleted: boolean;
}

/** PATCH: solo se envían los campos modificados */
export type UpdateAdministradorRequest = Partial<CreateAdministradorRequest>;

export interface ResetAdministradorPasswordRequest {
	new_password: string;
}
