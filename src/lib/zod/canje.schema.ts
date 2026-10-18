import { z } from 'zod';

/** Dígitos del código que el cliente presenta (p. ej. "00123456") */
export const CANJE_CODIGO_LENGTH = 8;

/** Código con el que se consulta un canje antes de confirmarlo o cancelarlo */
export const codigoCanjeSchema = z.object({
	codigo_canje: z
		.string()
		.trim()
		.nonempty({ message: 'Ingresa el código del canje' })
		.regex(/^\d+$/, { message: 'El código solo tiene números' })
		.length(CANJE_CODIGO_LENGTH, {
			message: `El código tiene ${CANJE_CODIGO_LENGTH} dígitos`
		})
});

export type CodigoCanjeInput = z.input<typeof codigoCanjeSchema>;
