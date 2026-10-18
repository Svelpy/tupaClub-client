import type { Administrador } from './administrador.interface';
import type { Canje } from './canje.interface';
import type { Cliente } from './cliente.interface';
import type { Operacion } from './operacion.interface';
import type { PaginatedResponse, PaginationParams } from './pagination.interface';
import type { Vale } from './vale.interface';

/** ACUMULA = puntos de una compra, CANJE = puntos gastados en un vale, AJUSTE = corrección */
export type MovimientoTipo = 'ACUMULA' | 'CANJE' | 'AJUSTE';

/** Cambio en el saldo de puntos de un cliente */
export interface Movimiento {
	id: string;
	/** Cliente cuyo saldo cambia */
	usuario_id: string;
	tipo_movimiento: MovimientoTipo;
	/** Ver `getMovimientoDelta` para el signo con que se muestra */
	puntos: number;
	/** Compra que originó la acumulación */
	operacion_id: string | null;
	/** Canje que descontó los puntos */
	canje_id: string | null;
	/** Movimiento que corrige un ajuste (p. ej. la devolución de un canje cancelado) */
	movimiento_origen_id: string | null;
	created_at: string;
	updated_at: string | null;
}

/** Item de "Mis movimientos" (rol CLIENTE): el movimiento y lo que lo originó (compra o canje con su vale) */
export interface MiMovimientoListItem {
	movimiento: Movimiento;
	operacion: Operacion | null;
	canje: Canje | null;
	vale: Vale | null;
}

export interface MiMovimientoListParams extends PaginationParams {
	/** Sin valor = todos los tipos */
	tipo?: MovimientoTipo | null;
}

export type MiMovimientoListResponse = PaginatedResponse<MiMovimientoListItem>;

/** Item del listado del panel: además trae el cliente cuyo saldo cambia y quién lo registró */
export interface MovimientoListItem extends MiMovimientoListItem {
	cliente: Cliente;
	/** Usuario del panel que registró el movimiento (p. ej. el cajero de la compra o del canje) */
	emisor: Administrador | null;
}

export interface MovimientoListParams extends PaginationParams {
	/** Sin valor = todos los clientes */
	usuario_id?: string | null;
	/** Sin valor = todos los tipos */
	tipo?: MovimientoTipo | null;
}

export type MovimientoListResponse = PaginatedResponse<MovimientoListItem>;
