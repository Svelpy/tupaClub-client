import type { PaginatedResponse, PaginationParams } from './pagination.interface';

/** Solo una configuración está ACTIVE a la vez */
export type ConfigPuntosStatus = 'ACTIVE' | 'INACTIVE';

export interface ConfigPuntos {
	id: string;
	status: ConfigPuntosStatus;
	start_date: string;
	/** Monto de compra en Bs que otorga `asignacion_puntos` */
	asignacion_bolivianos: number;
	/** Puntos que gana el cliente por cada `asignacion_bolivianos` de compra */
	asignacion_puntos: number;
	/** Monto del vale en Bs que cuesta `costo_vale_puntos` */
	costo_vale_bolivianos: number;
	/** Puntos que cuesta canjear un vale de `costo_vale_bolivianos` */
	costo_vale_puntos: number;
	created_at: string;
	updated_at: string;
}

export type ConfigPuntosListParams = PaginationParams;

export type ConfigPuntosListResponse = PaginatedResponse<ConfigPuntos>;

/** Equivalencia entre bolivianos y puntos */
export interface ConfigPuntosEquivalencia {
	bolivianos: number;
	puntos: number;
}

export interface CreateConfigPuntosRequest {
	/** Puntos que gana el cliente por monto de compra */
	asignacion: ConfigPuntosEquivalencia;
	/** Puntos que cuesta un vale por su monto en Bs */
	costo_vale: ConfigPuntosEquivalencia;
}

/** Respuesta de crear: la nueva configuración, ya con status ACTIVE */
export interface ConfigPuntosDetail extends ConfigPuntos {
	is_deleted: boolean;
}
