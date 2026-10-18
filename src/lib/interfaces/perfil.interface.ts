import type { UserGenero } from './auth.interface';

/** Datos que el usuario puede editar de su propio perfil (la cédula y el rol no se modifican) */
export interface PerfilDatos {
	nombre: string;
	apellidos: string | null;
	telefono: string;
	genero: UserGenero;
	email: string | null;
	/** Formato YYYY-MM-DD */
	birth_date: string | null;
	direccion: string | null;
}

/** PATCH: solo se envían los campos modificados */
export type UpdatePerfilRequest = Partial<PerfilDatos>;

export interface ChangePerfilPasswordRequest {
	current_password: string;
	new_password: string;
}
