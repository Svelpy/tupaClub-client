import { resolve } from '$app/paths';
import {
	ArrowsLeftRightIcon,
	BriefcaseIcon,
	BuildindStoreIcon,
	GiftIcon,
	HomeDotIcon,
	SearchIcon,
	SettingsIcon,
	ShieldIcon,
	ShoppingCartIcon,
	SparklesIcon,
	TagIcon,
	TicketIcon,
	TredingUpIcon,
	UserIcon,
	UsersIcon
} from '#lib/icons/outline/index.ts';
import type { ClientNavItem, NavItem, NavSection } from '#lib/interfaces/index.ts';

/** El href se resuelve desde la ruta: una sola fuente para el link y para el control de acceso */
function navItem(item: Omit<NavItem, 'href'>): NavItem {
	return { ...item, href: resolve(item.route) };
}

function clientNavItem(item: Omit<ClientNavItem, 'href'>): ClientNavItem {
	return { ...item, href: resolve(item.route) };
}

/**
 * Navegación del área de clientes (/app): pestañas inferiores en móvil y barra superior en escritorio.
 * Las pestañas solo se muestran en estas páginas raíz; en las de detalle se ocultan (patrón de pila nativo).
 * El perfil no es pestaña: se abre desde el menú del avatar en la cabecera.
 */
export const CLIENT_NAVIGATION: ClientNavItem[] = [
	clientNavItem({
		id: 'inicio',
		label: 'Inicio',
		shortLabel: 'Inicio',
		route: '/app',
		icon: HomeDotIcon,
		exact: true
	}),
	clientNavItem({
		id: 'explorar',
		label: 'Explorar',
		shortLabel: 'Explorar',
		route: '/app/categorias',
		icon: SearchIcon
	}),
	clientNavItem({
		id: 'mis-canjes',
		label: 'Mis canjes',
		shortLabel: 'Canjes',
		route: '/app/mis-canjes',
		icon: GiftIcon
	}),
	clientNavItem({
		id: 'mis-movimientos',
		label: 'Mis movimientos',
		shortLabel: 'Movimientos',
		route: '/app/mis-movimientos',
		icon: SparklesIcon
	})
];

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
				id: 'movimientos',
				label: 'Movimientos',
				route: '/panel/movimientos',
				icon: TredingUpIcon
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
	},
	{
		id: 'cuenta',
		label: 'Cuenta',
		items: [navItem({ id: 'perfil', label: 'Mi perfil', route: '/panel/perfil', icon: UserIcon })]
	}
];
