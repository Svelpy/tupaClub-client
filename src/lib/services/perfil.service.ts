import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	ChangePerfilPasswordRequest,
	ChangePerfilSucursalRequest,
	CurrentUser,
	UpdatePerfilRequest,
	User
} from '#lib/interfaces/index.ts';

/** Perfil del usuario de la sesión: todo sobre `/users/me`, sin ID en la URL */
class PerfilService {
	/** Siempre del servidor: el perfil no se lee de la sesión guardada en el navegador */
	async get(): Promise<CurrentUser> {
		return apiFidelityTupa.get<CurrentUser>('/users/me', { requireAuth: true });
	}

	async update(data: UpdatePerfilRequest): Promise<User> {
		return apiFidelityTupa.patch<User>('/users/me', data, { requireAuth: true });
	}

	/** Solo ADMIN y CAJERO, y solo hacia sucursales del negocio MAIN. Devuelve la sesión completa */
	async changeSucursal(sucursalId: string): Promise<CurrentUser> {
		const body: ChangePerfilSucursalRequest = { sucursal_id: sucursalId };
		return apiFidelityTupa.patch<CurrentUser>('/users/me/sucursal', body, { requireAuth: true });
	}

	async changePassword(data: ChangePerfilPasswordRequest): Promise<User> {
		return apiFidelityTupa.patch<User>('/users/me/password', data, { requireAuth: true });
	}

	/** Sube o reemplaza el avatar (multipart/form-data, campo `file`) */
	async uploadAvatar(file: File): Promise<User> {
		const formData = new FormData();
		formData.append('file', file);
		return apiFidelityTupa.post<User>('/users/me/avatar', formData, { requireAuth: true });
	}

	async deleteAvatar(): Promise<User> {
		return apiFidelityTupa.delete<User>('/users/me/avatar', undefined, { requireAuth: true });
	}
}

export const perfilService = new PerfilService();
