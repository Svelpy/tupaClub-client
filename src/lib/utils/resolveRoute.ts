import { resolve } from '$app/paths';
import type { StaticRouteId } from '#lib/config/routeAccess.config.ts';

/**
 * `resolve()` de SvelteKit tipa sus argumentos como una unión de tuplas (una por ruta), así que no
 * acepta una ruta cuyo tipo es la unión `StaticRouteId` (p. ej. `getHomeRoute(role)` o `item.route`).
 * Todas las `StaticRouteId` son rutas sin parámetros, por lo que resolverlas así es seguro.
 */
export function resolveStaticRoute(route: StaticRouteId): ReturnType<typeof resolve> {
	return resolve(...([route] as Parameters<typeof resolve>));
}
