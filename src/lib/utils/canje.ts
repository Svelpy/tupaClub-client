import type { Canje, CanjeStatus } from '#lib/interfaces/index.ts';

type CanjeVigencia = Pick<Canje, 'status' | 'expires_at'>;

/** Pendiente cuyo expires_at ya pasó: la API lo sigue listando como PENDIENTE hasta ejecutar /expire */
export function isCanjeVencido(canje: CanjeVigencia, now = Date.now()): boolean {
	return canje.status === 'PENDIENTE' && new Date(canje.expires_at).getTime() <= now;
}

/** Estado que se muestra en la UI: un pendiente vencido se muestra como EXPIRADO */
export function getCanjeStatus(canje: CanjeVigencia, now = Date.now()): CanjeStatus {
	return isCanjeVencido(canje, now) ? 'EXPIRADO' : canje.status;
}

/** Oculta el código dejando visibles los últimos dígitos (p. ej. "00123456" → "••••••56") */
export function maskCodigoCanje(codigo: string, visible = 2): string {
	return '•'.repeat(Math.max(0, codigo.length - visible)) + codigo.slice(-visible);
}
