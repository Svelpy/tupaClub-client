import { z } from 'zod';

export const CLIENTE_NOMBRE_MAX = 60;
export const CLIENTE_APELLIDOS_MAX = 120;
export const CLIENTE_CI_MAX = 20;
export const CLIENTE_TELEFONO_MAX = 20;
export const CLIENTE_EMAIL_MAX = 320;
export const CLIENTE_DIRECCION_MAX = 120;
export const CLIENTE_PASSWORD_MIN = 6;
export const CLIENTE_PASSWORD_MAX = 128;

// Campo opcional: un texto vacío se envía como null
const optionalText = (max: number, label: string) =>
	z
		.string()
		.trim()
		.max(max, { message: `${label} no puede exceder los ${max} caracteres.` })
		.transform((value) => value || null);

const todayISO = () => new Date().toLocaleDateString('en-CA');

export const createClienteSchema = z.object({
	nombre: z
		.string()
		.trim()
		.nonempty({ message: 'El nombre es requerido' })
		.max(CLIENTE_NOMBRE_MAX, {
			message: `El nombre no puede exceder los ${CLIENTE_NOMBRE_MAX} caracteres.`
		}),
	apellidos: optionalText(CLIENTE_APELLIDOS_MAX, 'Los apellidos'),
	ci: z
		.string()
		.trim()
		.nonempty({ message: 'La cédula de identidad es requerida' })
		.max(CLIENTE_CI_MAX, {
			message: `La cédula no puede exceder los ${CLIENTE_CI_MAX} caracteres.`
		})
		.regex(/^[0-9A-Za-z-]+$/, { message: 'Solo se permiten números, letras y guiones.' }),
	telefono: z
		.string()
		.trim()
		.nonempty({ message: 'El teléfono es requerido' })
		.max(CLIENTE_TELEFONO_MAX, {
			message: `El teléfono no puede exceder los ${CLIENTE_TELEFONO_MAX} caracteres.`
		})
		.regex(/^\+?[0-9\s-]+$/, { message: 'Ingresa un número de teléfono válido.' }),
	genero: z.enum(['M', 'F', 'O'], { message: 'Selecciona el género' }),
	email: z
		.string()
		.trim()
		.max(CLIENTE_EMAIL_MAX, {
			message: `El correo no puede exceder los ${CLIENTE_EMAIL_MAX} caracteres.`
		})
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
		.transform((value) => value || null),
	direccion: optionalText(CLIENTE_DIRECCION_MAX, 'La dirección')
});

export type CreateClienteInput = z.input<typeof createClienteSchema>;

// Mismas reglas al editar; el formulario envía solo los campos que cambiaron
export const updateClienteSchema = createClienteSchema;

export const resetClientePasswordSchema = z
	.object({
		new_password: z
			.string()
			.nonempty({ message: 'La contraseña es requerida' })
			.min(CLIENTE_PASSWORD_MIN, {
				message: `La contraseña debe tener al menos ${CLIENTE_PASSWORD_MIN} caracteres.`
			})
			.max(CLIENTE_PASSWORD_MAX, {
				message: `La contraseña no puede exceder los ${CLIENTE_PASSWORD_MAX} caracteres.`
			}),
		confirm_password: z.string().nonempty({ message: 'Confirma la contraseña' })
	})
	.refine((value) => value.new_password === value.confirm_password, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirm_password']
	});

export type ResetClientePasswordInput = z.input<typeof resetClientePasswordSchema>;
