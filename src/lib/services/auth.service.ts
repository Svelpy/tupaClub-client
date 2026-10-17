import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	AuthTokens,
	CurrentUser,
	LoginCredentials,
	LoginResponse,
	RegisterRequest,
	RegisterResponse
} from '#lib/interfaces/index.ts';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from '#lib/constants/index.ts';

class AuthService {
	public static getTokens(): AuthTokens | null {
		try {
			if (typeof localStorage === 'undefined') return null;
			const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
			const csrfToken = localStorage.getItem(REFRESH_TOKEN_KEY);

			if (accessToken && csrfToken) {
				return { accessToken, csrfToken };
			}
			return null;
		} catch (error) {
			console.warn('Error accessing localStorage for tokens:', error);
			return null;
		}
	}

	public static setTokens(tokens: AuthTokens): void {
		try {
			if (typeof localStorage === 'undefined') return;
			localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
			// El refresh_token llega como cookie HttpOnly; se guarda el csrf_token que lo acompaña
			localStorage.setItem(REFRESH_TOKEN_KEY, tokens.csrfToken);
		} catch (error) {
			console.warn('Error saving tokens to localStorage:', error);
		}
	}

	getCurrentUser(): CurrentUser | null {
		try {
			if (typeof localStorage === 'undefined') return null;
			const data = localStorage.getItem(USER_DATA_KEY);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.warn('Error accessing localStorage for user data:', error);
			return null;
		}
	}

	setCurrentUser(user: CurrentUser): void {
		try {
			if (typeof localStorage === 'undefined') return;
			localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
		} catch (error) {
			console.warn('Error saving user data to localStorage:', error);
		}
	}

	public static clearAuth(): void {
		try {
			if (typeof localStorage === 'undefined') return;
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(REFRESH_TOKEN_KEY);
			localStorage.removeItem(USER_DATA_KEY);
		} catch (error) {
			console.warn('Error clearing auth data:', error);
		}
	}

	public static isAuthenticated(): boolean {
		return !!this.getTokens()?.accessToken;
	}

	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		try {
			// El endpoint espera application/x-www-form-urlencoded (OAuth2 password flow)
			const body = new URLSearchParams({
				grant_type: 'password',
				username: credentials.username,
				password: credentials.password
			});

			const response = await apiFidelityTupa.postPublic<LoginResponse>('/auth/login', body, {
				withCredentials: true
			});

			AuthService.setTokens({
				accessToken: response.access_token,
				csrfToken: response.csrf_token
			});

			// Obtener la información completa del usuario inmediatamente después del login
			await this.getMe();

			return response;
		} catch (error) {
			AuthService.clearAuth();
			throw error;
		}
	}

	async getMe(): Promise<CurrentUser> {
		const currentUser = await apiFidelityTupa.get<CurrentUser>('/users/me', { requireAuth: true });
		this.setCurrentUser(currentUser);
		return currentUser;
	}

	async register(data: RegisterRequest): Promise<RegisterResponse> {
		return apiFidelityTupa.postPublic<RegisterResponse>('/auth/register', data);
	}

	async forgotPassword(email: string): Promise<void> {
		await apiFidelityTupa.postPublic('/auth/forgot-password', { email });
	}

	async resetPassword(token: string, password: string): Promise<void> {
		await apiFidelityTupa.postPublic(`/auth/reset-password/${token}`, { password });
	}

	async logout(): Promise<void> {
		AuthService.clearAuth();
	}
	getToken(): string | null {
		return AuthService.getTokens()?.accessToken || null;
	}

	getCsrfToken(): string | null {
		return AuthService.getTokens()?.csrfToken || null;
	}

	async refreshToken(): Promise<string> {
		const csrfToken = this.getCsrfToken();
		if (!csrfToken) {
			AuthService.clearAuth();
			throw new Error('No csrf token available');
		}

		try {
			// Usamos postPublic para evitar headers de auth y recursión infinita.
			// El refresh_token viaja en la cookie HttpOnly.
			const response = await apiFidelityTupa.postPublic<LoginResponse>('/auth/refresh', undefined, {
				withCredentials: true,
				customHeaders: { 'X-CSRF-Token': csrfToken }
			});

			AuthService.setTokens({
				accessToken: response.access_token,
				csrfToken: response.csrf_token ?? csrfToken
			});
			return response.access_token;
		} catch (error) {
			AuthService.clearAuth();
			throw error;
		}
	}

	clearToken(): void {
		AuthService.clearAuth();
	}
}

export const authService = new AuthService();
