import { writable, derived, get } from 'svelte/store';
import type { LoginCredentials, CurrentUser, User } from '#lib/interfaces/index.ts';
import { AppError, authService } from '#lib/services/index.ts';
import { isRole } from '#lib/utils/rbac.utils.ts';

// Store for current user data
export const currentUserStore = writable<CurrentUser | null>(authService.getCurrentUser());

// Derived store to check authentication status
export const isAuthenticated = derived(currentUserStore, ($user) => $user !== null);

// Rol del usuario actual; null sin sesión o si el rol no es uno conocido por el frontend
export const currentRole = derived(currentUserStore, ($user) => {
	const role = $user?.user.role;
	return isRole(role) ? role : null;
});

// Store for loading states
export const isLoading = writable<boolean>(false);

// true cuando el usuario ya se validó contra /users/me en esta carga de la app.
// Se pierde al recargar: así el rol siempre sale del servidor y no del localStorage (editable).
let isSessionVerified = false;

// El servidor rechazó la sesión (refresh fallido): se sincroniza el store con el localStorage ya limpio
authService.onSessionExpired(() => {
	isSessionVerified = false;
	currentUserStore.set(null);
});

export const authStore = {
	/**
	 * Performs login and updates the store with user data
	 */
	login: async (credentials: LoginCredentials) => {
		isLoading.set(true);
		try {
			const loginResponse = await authService.login(credentials);
			// login() internally calls getMe() which saves to localStorage
			// Now sync the store with what was saved
			const userData = authService.getCurrentUser();
			if (userData) {
				currentUserStore.set(userData);
				isSessionVerified = true;
			}
			return loginResponse;
		} finally {
			isLoading.set(false);
		}
	},

	/**
	 * Devuelve la sesión validada por el servidor, o null si no hay sesión válida.
	 * La primera llamada de cada carga de la app consulta /users/me; las siguientes usan el store.
	 */
	ensureSession: async (): Promise<CurrentUser | null> => {
		// Sin token (logout o 401 de la API, que lo borra) no hay sesión
		if (!authService.getToken()) {
			isSessionVerified = false;
			currentUserStore.set(null);
			return null;
		}

		if (isSessionVerified) return get(currentUserStore);

		try {
			const userData = await authService.getMe();
			currentUserStore.set(userData);
			isSessionVerified = true;
			return userData;
		} catch (error) {
			// Token vencido o inválido: se cierra la sesión. Otros errores (red, 5xx) no la cierran
			if (error instanceof AppError && (error.status === 401 || error.status === 403)) {
				authStore.logout();
				return null;
			}
			throw error;
		}
	},

	/**
	 * Refreshes user data from the server
	 */
	refreshUser: async () => {
		try {
			const userData = await authService.getMe();
			currentUserStore.set(userData);
		} catch (error) {
			console.error('Error refreshing user data:', error);
			// Optional: logout if me() fails?
		}
	},

	/**
	 * Directly sets the user data in the store and service
	 */
	setUser: (userData: CurrentUser) => {
		currentUserStore.set(userData);
		authService.setCurrentUser(userData);
	},

	/** Reemplaza los datos del usuario de la sesión (p. ej. tras editar su perfil o su avatar) */
	setUserData: (user: User) => {
		const current = get(currentUserStore);
		if (!current) return;
		authStore.setUser({ ...current, user });
	},

	/** Actualiza el saldo de puntos de la sesión (p. ej. tras un canje o al cargar el resumen) */
	setPuntos: (puntos: number) => {
		const current = get(currentUserStore);
		if (!current || current.user.puntos === puntos) return;
		authStore.setUser({ ...current, user: { ...current.user, puntos } });
	},

	/**
	 * Clears auth data and redirects to login
	 */
	logout: () => {
		isSessionVerified = false;
		currentUserStore.set(null);
		authService.logout();
	},

	setLoading: (loading: boolean) => {
		isLoading.set(loading);
	}
};
