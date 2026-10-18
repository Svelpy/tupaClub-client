import type { PaginatedResponse, PaginationParams } from './pagination.interface';
import type { Sucursal } from './sucursal.interface';

/** MAIN = matriz principal, SOCIO = negocio afiliado */
export type NegocioTipo = 'MAIN' | 'SOCIO';

export interface Negocio {
	id: string;
	nombre: string;
	tipo: NegocioTipo;
	descripcion: string | null;
	telefono: string | null;
	image_url: string | null;
	created_at: string;
	updated_at: string | null;
}

/** Item del listado: el negocio junto a sus sucursales */
export interface NegocioListItem {
	negocio: Negocio;
	sucursales: Sucursal[];
}

/** Sucursal junto a su negocio, para mostrar "Sucursal · Negocio" a partir de un sucursal_id */
export interface SucursalConNegocio {
	sucursal: Sucursal;
	negocio: Negocio;
}

export interface NegocioListParams extends PaginationParams {
	/** Sin valor = todos los tipos */
	tipo?: NegocioTipo | null;
}

export type NegocioListResponse = PaginatedResponse<NegocioListItem>;

export interface CreateNegocioRequest {
	nombre: string;
	tipo: NegocioTipo;
	descripcion: string | null;
	telefono: string | null;
}

/** Negocio completo con datos de auditoría (respuesta de crear) */
export interface NegocioDetail extends Negocio {
	is_deleted: boolean;
	created_at: string;
	created_by: string | null;
	updated_at: string | null;
	updated_by: string | null;
}

/** PATCH: solo se envían los campos modificados */
export type UpdateNegocioRequest = Partial<CreateNegocioRequest>;
