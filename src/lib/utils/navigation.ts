import type { Role } from '#lib/config/permissions.config.ts';
import type { NavItem, NavSection } from '#lib/interfaces/index.ts';
import { canAccessRoute } from './rbac.utils';

export function isNavItemActive(item: NavItem, pathname: string): boolean {
	if (item.exact) return pathname === item.href;
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Item activo para la ruta actual; si varios coinciden, gana la ruta más específica */
export function findActiveNavItem(sections: NavSection[], pathname: string): NavItem | undefined {
	return sections
		.flatMap((section) => section.items)
		.filter((item) => isNavItemActive(item, pathname))
		.sort((a, b) => b.href.length - a.href.length)[0];
}

/** Menú con solo las páginas que el rol puede abrir; las secciones que quedan vacías se quitan */
export function filterNavigation(sections: NavSection[], role: Role | null): NavSection[] {
	return sections
		.map((section) => ({
			...section,
			items: section.items.filter((item) => canAccessRoute(role, item.route))
		}))
		.filter((section) => section.items.length > 0);
}
