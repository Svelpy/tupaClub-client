import type { Component } from 'svelte';
import type { ResolvedPathname } from '$app/types';
import type { StaticRouteId } from '#lib/config/routeAccess.config.ts';

export interface NavItem {
	id: string;
	label: string;
	/** Ruta de SvelteKit: decide qué roles ven el item (ROLE_ACCESS); un typo es error de tipos */
	route: StaticRouteId;
	/** `route` ya resuelta con resolve() */
	href: ResolvedPathname;
	icon: Component<{ class?: string }>;
	/** Activo solo si la ruta coincide exactamente (p. ej. el inicio del panel) */
	exact?: boolean;
}

export interface NavSection {
	id: string;
	label: string;
	items: NavItem[];
}
