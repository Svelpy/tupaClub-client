import { z } from 'zod';
import { formatDecimal } from '#lib/utils/format.ts';

export const OPERACION_REFERENCIA_MAX = 255;

/** La API solo acepta cédulas numéricas de 6 a 20 dígitos al buscar por CI */
export const buscarClienteSchema = z.object({
	ci: z
		.string()
		.trim()
		.nonempty({ message: 'Ingresa la cédula del cliente' })
		.regex(/^\d{6,20}$/, { message: 'La cédula debe tener entre 6 y 20 dígitos, sin letras.' })
});

/**
 * Datos de la compra. `montoMinimo` es `asignacion_bolivianos` de la configuración activa:
 * por debajo de ese monto no se registra la compra.
 */
export const createCompraSchema = (montoMinimo: number) =>
	z.object({
		total_compra: z
			.number({ message: 'Ingresa el monto de la compra' })
			.positive({ message: 'El monto debe ser mayor a 0' })
			.refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6, {
				message: 'Usa como máximo 2 decimales.'
			})
			.refine((value) => value >= montoMinimo, {
				message: `El monto mínimo para acumular puntos es Bs ${formatDecimal(montoMinimo)}.`
			})
			// La API recibe el decimal como string con 2 decimales
			.transform((value) => value.toFixed(2)),
		// Campo opcional: un texto vacío se envía como null
		referencia: z
			.string()
			.trim()
			.max(OPERACION_REFERENCIA_MAX, {
				message: `La referencia no puede exceder los ${OPERACION_REFERENCIA_MAX} caracteres.`
			})
			.transform((value) => value || null)
	});

export type CreateCompraInput = z.input<ReturnType<typeof createCompraSchema>>;
