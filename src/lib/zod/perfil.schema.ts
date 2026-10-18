import { z } from 'zod';
import { CLIENTE_PASSWORD_MAX, CLIENTE_PASSWORD_MIN, createClienteSchema } from './cliente.schema';

export const PERFIL_PASSWORD_MIN = CLIENTE_PASSWORD_MIN;
export const PERFIL_PASSWORD_MAX = CLIENTE_PASSWORD_MAX;

// Mismos campos y límites que al registrar un usuario (es el mismo recurso `/users/`), sin la cédula
export const updatePerfilSchema = createClienteSchema.omit({ ci: true });

export type UpdatePerfilInput = z.input<typeof updatePerfilSchema>;

export const changePerfilPasswordSchema = z
	.object({
		current_password: z.string().nonempty({ message: 'Ingresa tu contraseña actual' }),
		new_password: z
			.string()
			.nonempty({ message: 'La nueva contraseña es requerida' })
			.min(PERFIL_PASSWORD_MIN, {
				message: `La contraseña debe tener al menos ${PERFIL_PASSWORD_MIN} caracteres.`
			})
			.max(PERFIL_PASSWORD_MAX, {
				message: `La contraseña no puede exceder los ${PERFIL_PASSWORD_MAX} caracteres.`
			}),
		confirm_password: z.string().nonempty({ message: 'Confirma la nueva contraseña' })
	})
	.refine((value) => value.new_password !== value.current_password, {
		message: 'La nueva contraseña debe ser distinta de la actual.',
		path: ['new_password']
	})
	.refine((value) => value.new_password === value.confirm_password, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirm_password']
	});

export type ChangePerfilPasswordInput = z.input<typeof changePerfilPasswordSchema>;

export const PERFIL_AVATAR_MAX_MB = 5;
export const PERFIL_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const perfilAvatarSchema = z.object({
	file: z
		.instanceof(File, { message: 'Selecciona una imagen' })
		.refine((file) => PERFIL_AVATAR_TYPES.includes(file.type), {
			message: 'Formato no permitido. Usa JPG, PNG o WEBP.'
		})
		.refine((file) => file.size <= PERFIL_AVATAR_MAX_MB * 1024 * 1024, {
			message: `La imagen no puede superar los ${PERFIL_AVATAR_MAX_MB} MB.`
		})
});
