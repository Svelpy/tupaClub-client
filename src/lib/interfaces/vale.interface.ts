import type { PaginatedResponse, PaginationParams } from './pagination.interface';

export interface Vale {
	id: string;
	nombre: string;
	descripcion: string | null;
	image_url: string | null;
	/** Valor del vale en Bs, decimal como string (p. ej. "50.00") */
	total_costo: string;
	/** Puntos que cuesta canjear el vale */
	total_puntos: number;
	categoria_id: string;
	negocio_id: string;
	created_at: string;
	updated_at: string;
}

export interface ValeListParams extends PaginationParams {
	/** Sin valor = todas las categorías */
	categoria_id?: string | null;
	/** Sin valor = todos los negocios */
	negocio_id?: string | null;
}

export type ValeListResponse = PaginatedResponse<Vale>;
