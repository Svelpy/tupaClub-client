import { z } from 'zod';

export const NEGOCIO_NOMBRE_MAX = 100;
export const NEGOCIO_DESCRIPCION_MAX = 255;
export const NEGOCIO_TELEFONO_MAX = 20;

export const createNegocioSchema = z.object({
	nombre: z
		.string()
		.trim()
		.nonempty({ message: 'El nombre es requerido' })
		.max(NEGOCIO_NOMBRE_MAX, {
			message: `El nombre no puede exceder los ${NEGOCIO_NOMBRE_MAX} caracteres.`
		}),
	tipo: z.enum(['MAIN', 'SOCIO'], { message: 'Selecciona el tipo de negocio' }),
	// Opcional: un texto vacío se envía como null
	telefono: z
		.string()
		.trim()
		.max(NEGOCIO_TELEFONO_MAX, {
			message: `El teléfono no puede exceder los ${NEGOCIO_TELEFONO_MAX} caracteres.`
		})
		.refine((value) => value === '' || /^\+?[0-9\s-]+$/.test(value), {
			message: 'Ingresa un número de teléfono válido.'
		})
		.transform((value) => value || null),
	descripcion: z
		.string()
		.trim()
		.max(NEGOCIO_DESCRIPCION_MAX, {
			message: `La descripción no puede exceder los ${NEGOCIO_DESCRIPCION_MAX} caracteres.`
		})
		.transform((value) => value || null)
});

// Mismas reglas al editar; el formulario envía solo los campos que cambiaron
export const updateNegocioSchema = createNegocioSchema;

export const NEGOCIO_IMAGE_MAX_MB = 5;
export const NEGOCIO_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const negocioImageSchema = z.object({
	file: z
		.instanceof(File, { message: 'Selecciona una imagen' })
		.refine((file) => NEGOCIO_IMAGE_TYPES.includes(file.type), {
			message: 'Formato no permitido. Usa JPG, PNG o WEBP.'
		})
		.refine((file) => file.size <= NEGOCIO_IMAGE_MAX_MB * 1024 * 1024, {
			message: `La imagen no puede superar los ${NEGOCIO_IMAGE_MAX_MB} MB.`
		})
});
