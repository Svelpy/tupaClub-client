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

/** Roles de los usuarios del panel (los CLIENTE se gestionan aparte, en Clientes) */
export type PanelUserRole = Exclude<Role, typeof Role.CLIENTE>;

/**
 * Nivel jerárquico para gestionar usuarios del panel: un rol solo crea, edita, restablece la
 * contraseña o elimina a usuarios de un nivel inferior al suyo (nunca del mismo nivel).
 */
export const ROLE_LEVEL: Record<Role, number> = {
	[Role.SUPERADMIN]: 4,
	[Role.OWNER]: 3,
	[Role.ADMIN]: 2,
	[Role.CAJERO]: 1,
	[Role.SOCIO]: 1,
	[Role.CLIENTE]: 0
};

/** Roles que la API acepta al crear o editar un usuario del panel */
export const ASSIGNABLE_USER_ROLES = [Role.OWNER, Role.ADMIN, Role.CAJERO, Role.SOCIO] as const;
export type AssignableUserRole = (typeof ASSIGNABLE_USER_ROLES)[number];

/**
 * Roles que cada rol ve en Administradores, en el orden de las pestañas: su mismo nivel y los
 * inferiores. CAJERO y SOCIO no abren esa página.
 */
export const LISTABLE_USER_ROLES: Record<Role, readonly PanelUserRole[]> = {
	[Role.SUPERADMIN]: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN, Role.CAJERO, Role.SOCIO],
	[Role.OWNER]: [Role.OWNER, Role.ADMIN, Role.CAJERO, Role.SOCIO],
	[Role.ADMIN]: [Role.ADMIN, Role.CAJERO, Role.SOCIO],
	[Role.CAJERO]: [],
	[Role.CLIENTE]: [],
	[Role.SOCIO]: []
};

/**
 * Roles que ven el resumen de inicio del panel (`/resumen/admin`). En el backend no es un módulo:
 * la ruta usa `require_role(Role.OWNER, Role.ADMIN)`, así que SUPERADMIN no tiene acceso.
 */
export const RESUMEN_ADMIN_ROLES: readonly Role[] = [Role.OWNER, Role.ADMIN];

/** Roles que ven el resumen de sus propias compras del día (`/resumen/cajero`, `require_role(CAJERO)`) */
export const RESUMEN_CAJERO_ROLES: readonly Role[] = [Role.CAJERO];

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
