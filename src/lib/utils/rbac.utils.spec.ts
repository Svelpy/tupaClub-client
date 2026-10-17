import { describe, it, expect } from 'vitest';
import { Action, Module, Role } from '#lib/config/permissions.config.ts';
import type { NavSection } from '#lib/interfaces/index.ts';
import { filterNavigation } from './navigation';
import { can, canAccessRoute, getHomeRoute, isRole, isSafeRedirect } from './rbac.utils';

const ADMINS = [Role.SUPERADMIN, Role.OWNER, Role.ADMIN];

const PANEL_ROUTES = [
	'/panel',
	'/panel/registrar-compra',
	'/panel/canjes',
	'/panel/operaciones',
	'/panel/configuracion-puntos',
	'/panel/vales',
	'/panel/categorias',
	'/panel/clientes',
	'/panel/mis-sucursales',
	'/panel/negocios',
	'/panel/administradores'
];

const CAJERO_ROUTES = [
	'/panel/registrar-compra',
	'/panel/categorias',
	'/panel/vales',
	'/panel/operaciones',
	'/panel/canjes',
	'/panel/clientes',
	'/panel/configuracion-puntos'
];

describe('isRole', () => {
	it('acepta solo roles conocidos', () => {
		expect(isRole('CAJERO')).toBe(true);
		expect(isRole('ROOT')).toBe(false);
		expect(isRole(undefined)).toBe(false);
	});
});

describe('canAccessRoute', () => {
	it.each(Object.values(Role))('la página de inicio de %s es accesible para ese rol', (role) => {
		expect(canAccessRoute(role, getHomeRoute(role))).toBe(true);
	});

	it.each(ADMINS)('%s accede a todo /panel pero no a /app', (role) => {
		for (const route of PANEL_ROUTES) expect(canAccessRoute(role, route)).toBe(true);
		expect(canAccessRoute(role, '/app')).toBe(false);
	});

	it('CAJERO accede solo a sus páginas del panel', () => {
		for (const route of PANEL_ROUTES) {
			expect(canAccessRoute(Role.CAJERO, route)).toBe(CAJERO_ROUTES.includes(route));
		}
		expect(canAccessRoute(Role.CAJERO, '/app')).toBe(false);
	});

	it('SOCIO accede solo a /panel/canjes', () => {
		for (const route of PANEL_ROUTES) {
			expect(canAccessRoute(Role.SOCIO, route)).toBe(route === '/panel/canjes');
		}
	});

	it('CLIENTE accede a todo /app y a nada de /panel', () => {
		for (const route of ['/app', '/app/categorias', '/app/vales/[id]', '/app/my-canjes']) {
			expect(canAccessRoute(Role.CLIENTE, route)).toBe(true);
		}
		for (const route of PANEL_ROUTES) expect(canAccessRoute(Role.CLIENTE, route)).toBe(false);
	});

	it('compara por segmentos, no por prefijo de texto', () => {
		expect(canAccessRoute(Role.SOCIO, '/panel/canjes/[id]')).toBe(true);
		expect(canAccessRoute(Role.SOCIO, '/panel/canjes-historial')).toBe(false);
		expect(canAccessRoute(Role.CLIENTE, '/application')).toBe(false);
	});

	it('ignora los grupos de rutas', () => {
		expect(canAccessRoute(Role.SOCIO, '/(staff)/panel/canjes')).toBe(true);
		expect(canAccessRoute(Role.SOCIO, '/(staff)/panel/negocios')).toBe(false);
	});

	it('deniega sin rol o sin ruta', () => {
		expect(canAccessRoute(null, '/panel')).toBe(false);
		expect(canAccessRoute(Role.ADMIN, null)).toBe(false);
	});
});

describe('can', () => {
	it('CAJERO lista y crea clientes, pero no los edita ni elimina', () => {
		expect(can(Role.CAJERO, Module.USUARIO, Action.READ)).toBe(true);
		expect(can(Role.CAJERO, Module.USUARIO, Action.CREATE)).toBe(true);
		expect(can(Role.CAJERO, Module.USUARIO, Action.UPDATE)).toBe(false);
		expect(can(Role.CAJERO, Module.USUARIO, Action.DELETE)).toBe(false);
	});

	it('CAJERO solo lee categorías, vales y configuración de puntos', () => {
		for (const module of [Module.CATEGORIA, Module.VALE, Module.CONFIG_PUNTOS]) {
			expect(can(Role.CAJERO, module, Action.READ)).toBe(true);
			expect(can(Role.CAJERO, module, Action.CREATE)).toBe(false);
			expect(can(Role.CAJERO, module, Action.UPDATE)).toBe(false);
			expect(can(Role.CAJERO, module, Action.DELETE)).toBe(false);
		}
	});

	it('SOCIO lee y actualiza canjes, nada más sobre ellos', () => {
		expect(can(Role.SOCIO, Module.CANJE, Action.READ)).toBe(true);
		expect(can(Role.SOCIO, Module.CANJE, Action.UPDATE)).toBe(true);
		expect(can(Role.SOCIO, Module.CANJE, Action.CREATE)).toBe(false);
		expect(can(Role.SOCIO, Module.CATEGORIA, Action.READ)).toBe(false);
	});

	it.each(ADMINS)('%s tiene todo salvo escribir movimientos de puntos', (role) => {
		expect(can(role, Module.NEGOCIO, Action.DELETE)).toBe(true);
		expect(can(role, Module.MOVIMIENTOS_PUNTOS, Action.READ)).toBe(true);
		expect(can(role, Module.MOVIMIENTOS_PUNTOS, Action.CREATE)).toBe(false);
	});

	it('deniega sin rol', () => {
		expect(can(null, Module.CATEGORIA, Action.READ)).toBe(false);
	});
});

describe('isSafeRedirect', () => {
	it('acepta solo rutas internas', () => {
		expect(isSafeRedirect('/panel/canjes?page=2')).toBe(true);
		expect(isSafeRedirect('//evil.com')).toBe(false);
		expect(isSafeRedirect('/\\evil.com')).toBe(false);
		expect(isSafeRedirect('https://evil.com')).toBe(false);
		expect(isSafeRedirect(null)).toBe(false);
	});
});

describe('filterNavigation', () => {
	const icon = (() => {}) as unknown as NavSection['items'][number]['icon'];
	const sections: NavSection[] = [
		{
			id: 'general',
			label: 'General',
			items: [{ id: 'inicio', label: 'Inicio', route: '/panel', href: '/panel', icon }]
		},
		{
			id: 'puntos',
			label: 'Puntos',
			items: [
				{ id: 'canjes', label: 'Canjes', route: '/panel/canjes', href: '/panel/canjes', icon },
				{
					id: 'operaciones',
					label: 'Operaciones',
					route: '/panel/operaciones',
					href: '/panel/operaciones',
					icon
				}
			]
		}
	];

	it('deja solo los items permitidos y quita las secciones vacías', () => {
		const result = filterNavigation(sections, Role.SOCIO);
		expect(result.map((section) => section.id)).toEqual(['puntos']);
		expect(result[0].items.map((item) => item.id)).toEqual(['canjes']);
	});

	it('sin rol no muestra nada', () => {
		expect(filterNavigation(sections, null)).toEqual([]);
	});
});
