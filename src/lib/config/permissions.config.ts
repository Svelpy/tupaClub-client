/**
 * Permisos por rol sobre cada módulo: quién puede hacer qué, sobre qué módulo.
 * Espejo de `shared/services/permissions.py` del backend; si cambia allá, cambia aquí.
 *
 * Solo decide qué se muestra en la UI (botones, opciones). La seguridad real la aplica
 * el backend con `has_permission` en cada endpoint.
 * El acceso a páginas se configura aparte en `routeAccess.config.ts`.
 */

export const Role = {
	SUPERADMIN: 'SUPERADMIN',
	OWNER: 'OWNER',
	ADMIN: 'ADMIN',
	CAJERO: 'CAJERO',
	CLIENTE: 'CLIENTE',
	SOCIO: 'SOCIO'
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Module = {
	CATEGORIA: 'CATEGORIA',
	NEGOCIO: 'NEGOCIO',
	SUCURSAL: 'SUCURSAL',
	USUARIO: 'USUARIO',
	CANJE: 'CANJE',
	OPERACION: 'OPERACION',
	CONFIG_PUNTOS: 'CONFIG_PUNTOS',
	MOVIMIENTOS_PUNTOS: 'MOVIMIENTOS_PUNTOS',
	VALE: 'VALE'
} as const;
export type Module = (typeof Module)[keyof typeof Module];

export const Action = {
	CREATE: 'CREATE',
	READ: 'READ',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE'
} as const;
export type Action = (typeof Action)[keyof typeof Action];

type ModulePermissions = Partial<Record<Module, readonly Action[]>>;

const ALL_ACTIONS: readonly Action[] = [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE];
const SOLO_LECTURA: readonly Action[] = [Action.READ];

/** Todas las acciones en todos los módulos, salvo los movimientos de puntos (solo lectura) */
function fullAccess(): ModulePermissions {
	const permissions: ModulePermissions = {};
	for (const module of Object.values(Module)) permissions[module] = ALL_ACTIONS;
	permissions[Module.MOVIMIENTOS_PUNTOS] = SOLO_LECTURA;
	return permissions;
}

/**
 * Un módulo ausente en un rol = sin acceso a ese módulo (ni siquiera lectura).
 * `Record<Role, ...>` obliga a configurar aquí cualquier rol nuevo.
 */
export const ROLE_PERMISSIONS: Record<Role, ModulePermissions> = {
	[Role.SUPERADMIN]: fullAccess(),
	[Role.OWNER]: fullAccess(),
	[Role.ADMIN]: fullAccess(),
	[Role.CAJERO]: {
		[Module.CATEGORIA]: SOLO_LECTURA,
		[Module.NEGOCIO]: SOLO_LECTURA,
		[Module.SUCURSAL]: SOLO_LECTURA,
		// El backend permite SIN_ELIMINAR; en el panel el cajero solo lista y crea clientes
		[Module.USUARIO]: [Action.CREATE, Action.READ],
		[Module.CANJE]: [Action.READ, Action.UPDATE],
		[Module.OPERACION]: [Action.CREATE, Action.READ],
		[Module.CONFIG_PUNTOS]: SOLO_LECTURA,
		[Module.MOVIMIENTOS_PUNTOS]: SOLO_LECTURA,
		[Module.VALE]: SOLO_LECTURA
	},
	[Role.CLIENTE]: {
		[Module.CATEGORIA]: SOLO_LECTURA,
		[Module.NEGOCIO]: SOLO_LECTURA,
		[Module.SUCURSAL]: SOLO_LECTURA,
		[Module.USUARIO]: SOLO_LECTURA,
		[Module.CANJE]: [Action.CREATE, Action.READ],
		[Module.MOVIMIENTOS_PUNTOS]: SOLO_LECTURA,
		[Module.VALE]: SOLO_LECTURA
	},
	[Role.SOCIO]: {
		[Module.NEGOCIO]: SOLO_LECTURA,
		[Module.SUCURSAL]: SOLO_LECTURA,
		[Module.USUARIO]: SOLO_LECTURA,
		[Module.CANJE]: [Action.READ, Action.UPDATE]
	}
};
