import { z } from 'zod';
import { todayISO } from '#lib/utils/date.ts';

/** Fechas YYYY-MM-DD: se comparan como texto porque ese formato ordena igual que las fechas */
export const reportePuntosSchema = z
	.object({
		tipo: z.enum(['ASIGNADOS', 'CANJEADOS'], { message: 'Elige el tipo de reporte' }),
		fecha_inicio: z.string().nonempty({ message: 'Elige la fecha de inicio' }),
		fecha_fin: z.string().nonempty({ message: 'Elige la fecha de fin' })
	})
	.refine((data) => data.fecha_inicio <= data.fecha_fin, {
		message: 'La fecha de fin no puede ser anterior a la de inicio',
		path: ['fecha_fin']
	})
	.refine((data) => data.fecha_fin <= todayISO(), {
		message: 'La fecha de fin no puede ser posterior a hoy',
		path: ['fecha_fin']
	});

export type ReportePuntosInput = z.input<typeof reportePuntosSchema>;
