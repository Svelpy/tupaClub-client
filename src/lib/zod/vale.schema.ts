import { z } from 'zod';

export const VALE_NOMBRE_MAX = 60;
export const VALE_DESCRIPCION_MAX = 255;
/** Numeric(14, 2) en la API: hasta 12 dígitos enteros */
export const VALE_COSTO_MAX = 999_999_999_999.99;
export const VALE_IMAGE_MAX_MB = 5;
export const VALE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const hasTwoDecimalsAtMost = (value: number) =>
	Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

/** Valor en Bs del vale; la API lo recibe como string con 2 decimales */
export const valeCostoSchema = z
	.number({ message: 'Ingresa el valor del vale' })
	.positive({ message: 'El valor debe ser mayor a 0' })
	.max(VALE_COSTO_MAX, { message: 'El valor es demasiado alto.' })
	.refine(hasTwoDecimalsAtMost, { message: 'Usa como máximo 2 decimales.' })
	.transform((value) => value.toFixed(2));

export const createValeSchema = z.object({
	nombre: z
		.string()
		.trim()
		.nonempty({ message: 'El nombre es requerido' })
		.max(VALE_NOMBRE_MAX, {
			message: `El nombre no puede exceder los ${VALE_NOMBRE_MAX} caracteres.`
		}),
	// Campo opcional: un texto vacío se envía como null
	descripcion: z
		.string()
		.trim()
		.max(VALE_DESCRIPCION_MAX, {
			message: `La descripción no puede exceder los ${VALE_DESCRIPCION_MAX} caracteres.`
		})
		.transform((value) => value || null),
	total_costo: valeCostoSchema,
	total_puntos: z
		.number({ message: 'Ingresa los puntos que cuesta el vale' })
		.int({ message: 'Los puntos deben ser un número entero' })
		.positive({ message: 'Los puntos deben ser mayores a 0' }),
	categoria_id: z.string().nonempty({ message: 'Selecciona la categoría' }),
	negocio_id: z.string().nonempty({ message: 'Selecciona el negocio' }),
	image: z
		.instanceof(File)
		.refine((file) => VALE_IMAGE_TYPES.includes(file.type), {
			message: 'Formato no permitido. Usa JPG, PNG o WEBP.'
		})
		.refine((file) => file.size <= VALE_IMAGE_MAX_MB * 1024 * 1024, {
			message: `La imagen no puede superar los ${VALE_IMAGE_MAX_MB} MB.`
		})
		.nullable()
});

export type CreateValeInput = z.input<typeof createValeSchema>;

// Mismas reglas al editar; el formulario envía solo los campos que cambiaron
export const updateValeSchema = createValeSchema;
