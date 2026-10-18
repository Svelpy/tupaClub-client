import type { Categoria } from './categoria.interface';
import type { Negocio } from './negocio.interface';
import type { PaginatedResponse, PaginationParams } from './pagination.interface';
import type { Sucursal } from './sucursal.interface';

export interface Vale {
	id: string;
	nombre: string;
	descripcion: string | null;
	/** El listado actual no la envía: sin imagen se muestra el icono del vale */
	image_url?: string | null;
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

/** Item del listado: el vale junto a su categoría y su negocio */
export interface ValeListItem {
	vale: Vale;
	categoria: Categoria;
	negocio: Negocio;
}

export type ValeListResponse = PaginatedResponse<ValeListItem>;

/** Vale con datos de auditoría (respuesta de crear/editar) */
export interface ValeDetail extends Vale {
	is_deleted: boolean;
}

/** Detalle completo: el vale, su categoría, su negocio y las sucursales donde se canjea */
export interface ValeDetailResponse {
	vale: Vale;
	categoria: Categoria;
	negocio: Negocio;
	sucursales: Sucursal[];
}

/** Se envía como multipart/form-data */
export interface CreateValeRequest {
	nombre: string;
	descripcion: string | null;
	/** Decimal con 2 decimales como string (p. ej. "50.00") */
	total_costo: string;
	total_puntos: number;
	categoria_id: string;
	negocio_id: string;
	/** Imagen opcional; sin archivo el vale se muestra con su icono */
	image: File | null;
}

/** PATCH: solo se envían los campos modificados */
export type UpdateValeRequest = Partial<CreateValeRequest>;

export interface SugerirPuntosRequest {
	/** Decimal con 2 decimales como string */
	total_costo: string;
}

export interface SugerirPuntosResponse {
	/** Puntos calculados con la configuración activa (costo del vale) */
	puntos_sugeridos: number;
}
