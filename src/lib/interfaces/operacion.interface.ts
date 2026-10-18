import type { Administrador } from './administrador.interface';
import type { Cliente, CreateClienteRequest } from './cliente.interface';
import type { PaginatedResponse, PaginationParams } from './pagination.interface';
import type { Sucursal } from './sucursal.interface';

/** Compra registrada: suma `total_puntos` al cliente (receptor) */
export interface Operacion {
	id: string;
	/** Usuario del panel que registró la compra */
	emisor_id: string;
	/** Cliente que recibe los puntos */
	receptor_id: string;
	sucursal_id: string | null;
	/** Configuración de puntos vigente con la que se calcularon los puntos */
	config_punto_id: string;
	referencia: string | null;
	/** Decimal como string (p. ej. "150.00") */
	total_compra: string;
	total_puntos: number;
	created_at: string;
	updated_at: string | null;
}

/** Item del listado: la operación junto a quién la registró, el cliente y la sucursal */
export interface OperacionListItem {
	operacion: Operacion;
	/** Usuario del panel que registró la compra */
	emisor: Administrador;
	/** Cliente que recibió los puntos */
	receptor: Cliente;
	sucursal: Sucursal | null;
}

export interface OperacionListParams extends PaginationParams {
	/** Sin valor = todos los usuarios del panel */
	emisor_id?: string | null;
	/** Sin valor = todos los clientes */
	receptor_id?: string | null;
	/** Sin valor = todas las sucursales visibles */
	sucursal_id?: string | null;
}

export type OperacionListResponse = PaginatedResponse<OperacionListItem>;

/** Operación completa con datos de auditoría (respuesta de registrar) */
export interface OperacionDetail extends Operacion {
	is_deleted: boolean;
	created_by: string | null;
	updated_by: string | null;
}

/** Datos del cliente nuevo: mismos campos que al crear un cliente */
export type OperacionReceptorData = CreateClienteRequest;

interface CreateOperacionBase {
	referencia: string | null;
	/** Decimal con 2 decimales como string (p. ej. "150.00") */
	total_compra: string;
}

/** Cliente existente: solo su id. Cliente nuevo: sin id y con sus datos para crearlo */
export type OperacionReceptor =
	| { receptor_id: string; receptor_data: null }
	| { receptor_id: null; receptor_data: OperacionReceptorData };

export type CreateOperacionRequest = CreateOperacionBase & OperacionReceptor;
