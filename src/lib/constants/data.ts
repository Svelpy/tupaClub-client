import type { Role } from '#lib/config/permissions.config.ts';
import type { CanjeStatus } from '#lib/interfaces/canje.interface.ts';
import type { NegocioTipo } from '#lib/interfaces/negocio.interface.ts';
import type { NivelCliente } from '#lib/interfaces/resumen.interface.ts';

export const NO_DATA_LABEL = '—';

/** Límites de paginación que acepta la API (`per_page`: 1–100) */
export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_PER_PAGE: 20,
	MAX_PER_PAGE: 100,
	PER_PAGE_OPTIONS: [10, 20, 50, 100]
} as const;

export const NEGOCIO_TIPO_LABEL: Record<NegocioTipo, string> = {
	MAIN: 'Principal',
	SOCIO: 'Socio'
};

/** Etiquetas de estado de canje (valores que devuelve la API) */
export const CANJE_STATUS_LABEL: Record<CanjeStatus, string> = {
	PENDIENTE: 'Pendiente',
	CANJEADO: 'Canjeado',
	EXPIRADO: 'Expirado',
	CANCELADO: 'Cancelado'
};

/** Etiquetas de rol de usuario (valores que devuelve la API) */
export const ROLE_LABEL: Record<Role, string> = {
	SUPERADMIN: 'Superadministrador',
	OWNER: 'Propietario',
	ADMIN: 'Administrador',
	CAJERO: 'Cajero',
	SOCIO: 'Socio',
	CLIENTE: 'Cliente'
};

/** Etiquetas de rol en plural (p. ej. pestañas de Administradores) */
export const ROLE_PLURAL_LABEL: Record<Role, string> = {
	SUPERADMIN: 'Superadministradores',
	OWNER: 'Propietarios',
	ADMIN: 'Administradores',
	CAJERO: 'Cajeros',
	SOCIO: 'Socios',
	CLIENTE: 'Clientes'
};

/** Etiquetas de género de usuario (valores que acepta la API) */
export const USER_GENERO_LABEL: Record<'M' | 'F' | 'O', string> = {
	M: 'Masculino',
	F: 'Femenino',
	O: 'Otro'
};

/** Etiquetas de nivel del cliente (valores que devuelve la API). Su insignia es `NivelIcon` */
export const NIVEL_CLIENTE_LABEL: Record<NivelCliente, string> = {
	BRONCE: 'Bronce',
	PLATA: 'Plata',
	ORO: 'Oro',
	DIAMANTE: 'Diamante'
};

/** Días que tiene el cliente para presentar su código desde que canjea (lo fija el backend) */
export const CANJE_VIGENCIA_DIAS = 30;

/** Referencia que se guarda en los canjes solicitados desde el área de clientes */
export const CANJE_REFERENCIA_APP = 'Solicitud desde la aplicación';
