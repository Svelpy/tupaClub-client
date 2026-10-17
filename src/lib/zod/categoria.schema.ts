import { z } from 'zod';
import categoriesEmojis from '#lib/data/categoriesEmojis.json';

export const CATEGORIA_NOMBRE_MAX = 60;
export const CATEGORIA_DESCRIPCION_MAX = 255;

const ICON_NUMBERS = new Set(categoriesEmojis.map((emoji) => emoji.icon_number));

export const createCategoriaSchema = z.object({
	nombre: z
		.string()
		.trim()
		.nonempty({ message: 'El nombre es requerido' })
		.max(CATEGORIA_NOMBRE_MAX, {
			message: `El nombre no puede exceder los ${CATEGORIA_NOMBRE_MAX} caracteres.`
		}),
	// 0 = sin icono (valor por defecto de la API)
	icon_number: z
		.number({ message: 'Selecciona un icono' })
		.int({ message: 'Selecciona un icono válido' })
		.min(0, { message: 'Selecciona un icono válido' })
		.refine((value) => value === 0 || ICON_NUMBERS.has(value), {
			message: 'Selecciona un icono de la lista'
		}),
	// Campo opcional: un texto vacío se envía como null (la API exige min_length=1 si viene)
	descripcion: z
		.string()
		.trim()
		.max(CATEGORIA_DESCRIPCION_MAX, {
			message: `La descripción no puede exceder los ${CATEGORIA_DESCRIPCION_MAX} caracteres.`
		})
		.transform((value) => value || null)
});

export type CreateCategoriaInput = z.input<typeof createCategoriaSchema>;

// Mismas reglas al editar; el formulario envía solo los campos que cambiaron
export const updateCategoriaSchema = createCategoriaSchema;
