import { z } from 'zod';

export const SUCURSAL_NOMBRE_MAX = 100;
export const SUCURSAL_DIRECCION_MAX = 255;
export const SUCURSAL_TELEFONO_MAX = 20;
export const SUCURSAL_URL_MAX = 500;

const isHttpUrl = (value: string): boolean => {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
};

export const createSucursalSchema = z.object({
	negocio_id: z.uuid({ message: 'Negocio inválido' }),
	nombre: z
		.string()
		.trim()
		.nonempty({ message: 'El nombre es requerido' })
		.max(SUCURSAL_NOMBRE_MAX, {
			message: `El nombre no puede exceder los ${SUCURSAL_NOMBRE_MAX} caracteres.`
		}),
	direccion: z
		.string()
		.trim()
		.nonempty({ message: 'La dirección es requerida' })
		.max(SUCURSAL_DIRECCION_MAX, {
			message: `La dirección no puede exceder los ${SUCURSAL_DIRECCION_MAX} caracteres.`
		}),
	// Opcional: un texto vacío se envía como null
	telefono: z
		.string()
		.trim()
		.max(SUCURSAL_TELEFONO_MAX, {
			message: `El teléfono no puede exceder los ${SUCURSAL_TELEFONO_MAX} caracteres.`
		})
		.refine((value) => value === '' || /^\+?[0-9\s-]+$/.test(value), {
			message: 'Ingresa un número de teléfono válido.'
		})
		.transform((value) => value || null),
	url_ubicacion: z
		.string()
		.trim()
		.max(SUCURSAL_URL_MAX, {
			message: `El enlace no puede exceder los ${SUCURSAL_URL_MAX} caracteres.`
		})
		.refine((value) => value === '' || isHttpUrl(value), {
			message: 'Ingresa un enlace válido (debe empezar con https://).'
		})
		.transform((value) => value || null)
});

export const updateSucursalSchema = createSucursalSchema;
