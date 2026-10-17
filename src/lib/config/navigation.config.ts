import { resolve } from '$app/paths';
import {
	ArrowsLeftRightIcon,
	BriefcaseIcon,
	BuildindStoreIcon,
	GiftIcon,
	HomeDotIcon,
	SettingsIcon,
	ShieldIcon,
	ShoppingCartIcon,
	TagIcon,
	TicketIcon,
	UsersIcon
} from '#lib/icons/outline/index.ts';
import type { NavItem, NavSection } from '#lib/interfaces/index.ts';

/** El href se resuelve desde la ruta: una sola fuente para el link y para el control de acceso */
function navItem(item: Omit<NavItem, 'href'>): NavItem {
	return { ...item, href: resolve(item.route) };
}

/**
 * Menú del panel de gestión (/panel), única fuente de verdad para el sidebar y el título del header.
 * Cada usuario ve solo los items que su rol puede abrir según `ROLE_ACCESS` (filterNavigation).
 */
export const PANEL_NAVIGATION: NavSection[] = [
	{
		id: 'general',
		label: 'General',
		items: [
			navItem({ id: 'inicio', label: 'Inicio', route: '/panel', icon: HomeDotIcon, exact: true })
		]
	},
	{
		id: 'puntos',
		label: 'Puntos',
		items: [
			navItem({
				id: 'registrar-compra',
				label: 'Registrar compra',
				route: '/panel/registrar-compra',
				icon: ShoppingCartIcon
			}),
			navItem({ id: 'canjes', label: 'Canjes', route: '/panel/canjes', icon: GiftIcon }),
			navItem({
				id: 'operaciones',
				label: 'Operaciones',
				route: '/panel/operaciones',
				icon: ArrowsLeftRightIcon
			}),
			navItem({
				id: 'configuracion-puntos',
				label: 'Configuración de puntos',
				route: '/panel/configuracion-puntos',
				icon: SettingsIcon
			})
		]
	},
	{
		id: 'catalogo',
		label: 'Catálogo',
		items: [
			navItem({ id: 'vales', label: 'Vales', route: '/panel/vales', icon: TicketIcon }),
			navItem({ id: 'categorias', label: 'Categorías', route: '/panel/categorias', icon: TagIcon })
		]
	},
	{
		id: 'gestion',
		label: 'Gestión',
		items: [
			navItem({ id: 'clientes', label: 'Clientes', route: '/panel/clientes', icon: UsersIcon }),
			navItem({
				id: 'mis-sucursales',
				label: 'Mis sucursales',
				route: '/panel/mis-sucursales',
				icon: BuildindStoreIcon
			}),
			navItem({ id: 'negocios', label: 'Negocios', route: '/panel/negocios', icon: BriefcaseIcon }),
			navItem({
				id: 'administradores',
				label: 'Administradores',
				route: '/panel/administradores',
				icon: ShieldIcon
			})
		]
	}
];
