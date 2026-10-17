import { z } from 'zod';

const montoBs = z
	.number({ message: 'Ingresa un monto válido' })
	.positive({ message: 'El monto debe ser mayor a 0' });

const cantPuntos = z
	.number({ message: 'Ingresa una cantidad de puntos válida' })
	.positive({ message: 'Los puntos deben ser mayores a 0' });

// Campos planos para que cada error se asocie a su input (validateSchema usa path[0]);
// luego se transforman al body anidado que espera la API
export const createConfigPuntosSchema = z
	.object({
		asignacion_bs: montoBs,
		asignacion_puntos: cantPuntos,
		costo_vale_bs: montoBs,
		costo_vale_puntos: cantPuntos
	})
	.transform((values) => ({
		asignacion: { bolivianos: values.asignacion_bs, puntos: values.asignacion_puntos },
		costo_vale: { bolivianos: values.costo_vale_bs, puntos: values.costo_vale_puntos }
	}));

export type CreateConfigPuntosInput = z.input<typeof createConfigPuntosSchema>;
