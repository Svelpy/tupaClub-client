import {
	ROLE_PERMISSIONS,
	Role,
	type Action,
	type Module
} from '#lib/config/permissions.config.ts';
import { ROLE_ACCESS, type StaticRouteId } from '#lib/config/routeAccess.config.ts';

const ROLES = new Set<string>(Object.values(Role));

/** true si el valor (p. ej. el rol que devuelve la API) es un rol conocido por el frontend */
export function isRole(value: unknown): value is Role {
	return typeof value === 'string' && ROLES.has(value);
}

/** true si el rol tiene la acción habilitada en ese módulo (equivale a `has_permission` del backend) */
export function can(role: Role | null, module: Module, action: Action): boolean {
	if (!role) return false;
	return ROLE_PERMISSIONS[role]?.[module]?.includes(action) ?? false;
}

// Los grupos de rutas `(grupo)` no forman parte de la URL: '/(admin)/panel' equivale a '/panel'
function stripRouteGroups(routeId: string): string {
	return routeId.replace(/\/\([^)]+\)/g, '') || '/';
}

/** true si el rol puede abrir la ruta (route id de SvelteKit, p. ej. '/app/vales/[id]') */
export function canAccessRoute(role: Role | null, routeId: string | null): boolean {
	if (!role || !routeId) return false;
	const access = ROLE_ACCESS[role];
	if (!access) return false;

	const id = stripRouteGroups(routeId);
	// Por segmentos: '/panel/canjes' habilita '/panel/canjes/[id]' pero no '/panel/canjes-x'
	return access.routes.some((route) => id === route || id.startsWith(`${route}/`));
}

/** Página de inicio del rol */
export function getHomeRoute(role: Role): StaticRouteId {
	return ROLE_ACCESS[role].home;
}

/** Solo rutas internas del sitio: evita redirecciones abiertas con `?redirectTo=//otro-sitio.com` */
export function isSafeRedirect(path: string | null): path is string {
	return !!path && path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
}
