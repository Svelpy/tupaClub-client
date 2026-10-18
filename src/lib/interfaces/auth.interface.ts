import type { Role } from '#lib/config/permissions.config.ts';
import type { Negocio } from './negocio.interface';
import type { Sucursal } from './sucursal.interface';

export interface LoginCredentials {
	/** Cédula de identidad */
	username: string;
	password: string;
}

export interface AuthActionResponse {
	status: string;
	message: string;
}

export interface RegisterRequest {
	nombre: string;
	apellidos: string | null;
	ci: string;
	telefono: string;
	genero: UserGenero;
	email: string | null;
	/** Formato YYYY-MM-DD */
	birth_date: string | null;
	direccion: string | null;
}

export type RegisterResponse = RegisterRequest;

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	password: string;
}

export interface LoginResponse {
	access_token: string;
	csrf_token: string;
	token_type: 'bearer';
}

export interface AuthTokens {
	accessToken: string;
	/** El refresh_token real viaja en una cookie HttpOnly; aquí se guarda el csrf_token asociado */
	csrfToken: string;
}

/**
 * Rol tal como llega de la API. Admite roles que el frontend aún no conoce:
 * validar con `isRole()` antes de usarlo para permisos (lo desconocido se deniega).
 */
export type UserRole = Role | (string & {});
export type UserGenero = 'M' | 'F' | 'O' | (string & {});

/** Usuario de la sesión (`/users/me`); también es la respuesta de editar el perfil */
export interface User {
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
	sucursal_id: string | null;
	created_at: string;
	updated_at: string | null;
}

/** Respuesta de `/users/me`. Un CLIENTE no tiene negocio ni sucursal (llegan en null) */
export interface CurrentUser {
	user: User;
	negocio: Negocio | null;
	sucursal: Sucursal | null;
}
