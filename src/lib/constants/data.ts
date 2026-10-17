import type { CanjeStatus } from '#lib/interfaces/canje.interface.ts';
import type { NegocioTipo } from '#lib/interfaces/negocio.interface.ts';

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

/** Etiquetas de género de usuario (valores que acepta la API) */
export const USER_GENERO_LABEL: Record<'M' | 'F' | 'O', string> = {
	M: 'Masculino',
	F: 'Femenino',
	O: 'Otro'
};
