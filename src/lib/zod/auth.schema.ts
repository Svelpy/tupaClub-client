import { z } from 'zod';
import { EDAD_MINIMA_REGISTRO } from '#lib/constants/data.ts';
import { latestBirthDateForAge, todayISO } from '#lib/utils/date.ts';

export const signInSchema = z.object({
	ci: z
		.string()
		.nonempty({ message: 'Usuario es requerido' })
		.min(6, { message: 'El usuario debe tener al menos 6 caracteres.' })
		.max(20, { message: 'El usuario no puede exceder los 20 caracteres.' }),
	password: z
		.string()
		.nonempty({ message: 'Password es requerido' })
		.min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
});

// Campo opcional: un texto vacío se envía como null
const optionalText = (max: number, label: string) =>
	z
		.string()
		.trim()
		.max(max, { message: `${label} no puede exceder los ${max} caracteres.` })
		.transform((value) => value || null);

export const signUpSchema = z.object({
	nombre: z
		.string()
		.trim()
		.nonempty({ message: 'El nombre es requerido' })
		.max(60, { message: 'El nombre no puede exceder los 60 caracteres.' }),
	apellidos: optionalText(120, 'Los apellidos'),
	ci: z
		.string()
		.trim()
		.nonempty({ message: 'La cédula de identidad es requerida' })
		.max(20, { message: 'La cédula no puede exceder los 20 caracteres.' })
		.regex(/^[0-9A-Za-z-]+$/, { message: 'Solo se permiten números, letras y guiones.' }),
	telefono: z
		.string()
		.trim()
		.nonempty({ message: 'El teléfono es requerido' })
		.max(20, { message: 'El teléfono no puede exceder los 20 caracteres.' })
		.regex(/^\+?[0-9\s-]+$/, { message: 'Ingresa un número de teléfono válido.' }),
	genero: z.enum(['M', 'F', 'O'], { message: 'Selecciona tu género' }),
	email: z
		.string()
		.trim()
		.max(320, { message: 'El correo no puede exceder los 320 caracteres.' })
		.refine((value) => value === '' || z.email().safeParse(value).success, {
			message: 'Ingresa un correo electrónico válido.'
		})
		.transform((value) => value || null),
	birth_date: z
		.string()
		.refine((value) => value === '' || !Number.isNaN(Date.parse(value)), {
			message: 'Ingresa una fecha válida.'
		})
		.refine((value) => value === '' || value <= todayISO(), {
			message: 'La fecha de nacimiento no puede ser futura.'
		})
		.refine((value) => value === '' || value <= latestBirthDateForAge(EDAD_MINIMA_REGISTRO), {
			message: `Debes ser mayor de ${EDAD_MINIMA_REGISTRO} años para registrarte.`
		})
		.transform((value) => value || null),
	direccion: optionalText(120, 'La dirección')
});

// Declaraciones del registro: se validan en el cliente y no se envían a la API
export const signUpConsentSchema = z.object({
	mayor_edad: z.literal(true, {
		message: `Debes confirmar que eres mayor de ${EDAD_MINIMA_REGISTRO} años.`
	}),
	acepta_terminos: z.literal(true, {
		message: 'Debes aceptar los Términos y condiciones y la Política de privacidad.'
	})
});
