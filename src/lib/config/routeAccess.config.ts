import type { RouteId, RouteParams } from '$app/types';
import { Role } from './permissions.config';

/** Rutas sin parámetros (`[id]`): se pueden resolver a una URL sin datos extra */
export type StaticRouteId = {
	[K in RouteId]: RouteParams<K> extends Record<string, never> ? K : never;
}[RouteId];

/**
 * Páginas que puede abrir cada rol. Es independiente de los permisos por módulo:
 * leer un módulo (p. ej. NEGOCIO para mostrar el negocio en el header) no implica ver su página.
 */
export interface RoleAccess {
	/** Página de inicio del rol: destino tras el login y al entrar a una ruta no permitida */
	home: StaticRouteId;
	/** Cada ruta habilita también todas sus subrutas ('/app' cubre '/app/vales/[id]') */
	routes: readonly RouteId[];
	/**
	 * Solo esa página, sin sus subrutas. Para abrir una página raíz (p. ej. el inicio '/panel')
	 * sin habilitar todo lo que cuelga de ella.
	 */
	exactRoutes?: readonly RouteId[];
	/**
	 * Se deniegan aunque `routes` las cubra (también sus subrutas). Para quitar una página puntual
	 * a un rol que abre todo un área (p. ej. el perfil a SUPERADMIN, que abre todo '/panel').
	 */
	excludedRoutes?: readonly RouteId[];
}

const PANEL_ADMIN: RoleAccess = { home: '/panel', routes: ['/panel'] };

/** `Record<Role, ...>` obliga a configurar aquí cualquier rol nuevo. Lo no listado se deniega. */
export const ROLE_ACCESS: Record<Role, RoleAccess> = {
	// SUPERADMIN no tiene perfil propio
	[Role.SUPERADMIN]: { ...PANEL_ADMIN, excludedRoutes: ['/panel/perfil'] },
	[Role.OWNER]: PANEL_ADMIN,
	[Role.ADMIN]: PANEL_ADMIN,
	[Role.CAJERO]: {
		// Su inicio muestra el resumen de sus compras de hoy (/resumen/cajero)
		home: '/panel',
		exactRoutes: ['/panel'],
		routes: [
			'/panel/registrar-compra',
			'/panel/categorias',
			'/panel/vales',
			'/panel/operaciones',
			'/panel/movimientos',
			'/panel/canjes',
			'/panel/configuracion-puntos',
			'/panel/perfil'
		]
	},
	[Role.SOCIO]: { home: '/panel/canjes', routes: ['/panel/canjes', '/panel/perfil'] },
	[Role.CLIENTE]: { home: '/app', routes: ['/app'] }
};
