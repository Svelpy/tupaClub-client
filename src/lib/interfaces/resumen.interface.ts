/** Niveles del cliente según sus puntos: BRONCE 0–500, PLATA 501–1000, ORO 1001–5000, DIAMANTE 5001+ */
export type NivelCliente = 'BRONCE' | 'PLATA' | 'ORO' | 'DIAMANTE';

export interface NivelClienteResumen {
	actual: NivelCliente;
	puntos_min: number;
	/** null en el nivel máximo */
	puntos_max: number | null;
	/** null en el nivel máximo */
	siguiente: NivelCliente | null;
	/** Puntos que faltan para el siguiente nivel; null en el nivel máximo */
	puntos_para_siguiente: number | null;
	/** Avance de 0 a 100 hacia el siguiente nivel; 100 en el nivel máximo */
	progreso: number;
}

/** Resumen de inicio del cliente en sesión */
export interface ResumenCliente {
	nombre: string;
	puntos: number;
	nivel: NivelClienteResumen;
}

/** Compras registradas en un periodo */
export interface ResumenOperaciones {
	cantidad: number;
	/** Monto total vendido en Bs, decimal como string (p. ej. "1450.50") */
	total_compra: string;
	puntos_otorgados: number;
}

export interface ResumenClientes {
	total: number;
	nuevos_mes: number;
	/** Suma de los saldos de todos los clientes */
	puntos_en_circulacion: number;
}

/** Canjes solicitados en un periodo y los puntos que costaron */
export interface ResumenCanjesPeriodo {
	cantidad: number;
	puntos: number;
}

export interface ResumenCanjes {
	/** Canjes que esperan que el cliente presente su código */
	pendientes: number;
	hoy: ResumenCanjesPeriodo;
	mes: ResumenCanjesPeriodo;
}

/** Vale más canjeado del mes */
export interface ResumenTopVale {
	vale_id: string;
	nombre: string;
	/** Nombre del negocio */
	negocio: string;
	canjes: number;
}

/** Resumen de inicio del panel para OWNER y ADMIN */
export interface ResumenAdmin {
	/** Día del resumen, formato YYYY-MM-DD */
	fecha: string;
	clientes: ResumenClientes;
	operaciones: { hoy: ResumenOperaciones; mes: ResumenOperaciones };
	canjes: ResumenCanjes;
	top_vales_mes: ResumenTopVale[];
}

/** Resumen de inicio del cajero en sesión: solo las compras que registró él */
export interface ResumenCajero {
	/** Día del resumen, formato YYYY-MM-DD */
	fecha: string;
	operaciones_hoy: ResumenOperaciones;
}
