import { z } from 'zod';
import { ASSIGNABLE_USER_ROLES } from '#lib/config/permissions.config.ts';
import { createClienteSchema, resetClientePasswordSchema } from './cliente.schema';

// Mismos campos y límites que un cliente (es el mismo recurso `/users/`) más el rol y la sucursal
export const createAdministradorSchema = createClienteSchema.extend({
	role: z.enum(ASSIGNABLE_USER_ROLES, { message: 'Selecciona el rol' }),
	sucursal_id: z.string().nonempty({ message: 'Selecciona la sucursal' })
});

export type CreateAdministradorInput = z.input<typeof createAdministradorSchema>;

// Mismas reglas al editar; el formulario envía solo los campos que cambiaron
export const updateAdministradorSchema = createAdministradorSchema;

export const resetAdministradorPasswordSchema = resetClientePasswordSchema;

export type ResetAdministradorPasswordInput = z.input<typeof resetAdministradorPasswordSchema>;
