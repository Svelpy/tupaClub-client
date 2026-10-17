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
}

const PANEL_ADMIN: RoleAccess = { home: '/panel', routes: ['/panel'] };

/** `Record<Role, ...>` obliga a configurar aquí cualquier rol nuevo. Lo no listado se deniega. */
export const ROLE_ACCESS: Record<Role, RoleAccess> = {
	[Role.SUPERADMIN]: PANEL_ADMIN,
	[Role.OWNER]: PANEL_ADMIN,
	[Role.ADMIN]: PANEL_ADMIN,
	[Role.CAJERO]: {
		home: '/panel/registrar-compra',
		routes: [
			'/panel/registrar-compra',
			'/panel/categorias',
			'/panel/vales',
			'/panel/operaciones',
			'/panel/canjes',
			'/panel/clientes',
			'/panel/configuracion-puntos'
		]
	},
	[Role.SOCIO]: { home: '/panel/canjes', routes: ['/panel/canjes'] },
	[Role.CLIENTE]: { home: '/app', routes: ['/app'] }
};
