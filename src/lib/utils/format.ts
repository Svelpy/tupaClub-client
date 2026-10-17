import { NO_DATA_LABEL } from '#lib/constants/index.ts';

type BaseOptions = {
	fallback?: string;
};

const isNullish = (value: unknown): value is null | undefined =>
	value === null || value === undefined;

const isEmptyString = (value: unknown): boolean => typeof value === 'string' && value.trim() === '';

/**
 * Valor genérico (string, number, etc.)
 */
export function formatValue<T>(
	value: T,
	options?: BaseOptions & { treatEmptyStringAsNull?: boolean }
): T | string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(value)) return fallback;

	if (options?.treatEmptyStringAsNull !== false && isEmptyString(value)) {
		return fallback;
	}

	return value;
}

/**
 * Números
 */
export function formatNumber(
	value: number | null | undefined,
	options?: BaseOptions & Intl.NumberFormatOptions
): string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(value)) return fallback;

	return new Intl.NumberFormat(undefined, options).format(value);
}

/**
 * Decimales que la API envía como string (p. ej. "0.250000" → "0,25").
 * Quita los ceros sobrantes y conserva hasta 6 decimales por defecto.
 */
export function formatDecimal(
	value: number | string | null | undefined,
	options?: BaseOptions & Intl.NumberFormatOptions
): string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(value) || isEmptyString(value)) return fallback;

	const number = Number(value);
	if (Number.isNaN(number)) return fallback;

	return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 6, ...options }).format(number);
}

/**
 * Moneda
 */
export function formatCurrency(
	value: number | string | null | undefined,
	currency = 'BOB',
	options?: BaseOptions
): string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(value)) return fallback;

	return new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency
	}).format(Number(value));
}

/**
 * Fechas
 */
// export function formatDate(
// 	value: string | Date | null | undefined,
// 	options?: BaseOptions & Intl.DateTimeFormatOptions
// ): string {
// 	const fallback = options?.fallback ?? NO_DATA_LABEL;

// 	if (isNullish(value)) return fallback;

// 	const date = new Date(value);

// 	if (isNaN(date.getTime())) return fallback;

// 	return new Intl.DateTimeFormat(undefined, options).format(date);
// }

export function formatDate(dateString?: string): string {
	if (isNullish(dateString)) return NO_DATA_LABEL;
	const [year, month, day] = dateString.split('T')[0].split('-');

	return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('es-ES', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
}

export function formatDateTime(dateString?: string): string {
	if (isNullish(dateString)) return NO_DATA_LABEL;

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return NO_DATA_LABEL;

	return date.toLocaleString('es-ES', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
}
const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 365 * 24 * 60 * 60 * 1000],
	['month', 30 * 24 * 60 * 60 * 1000],
	['day', 24 * 60 * 60 * 1000],
	['hour', 60 * 60 * 1000],
	['minute', 60 * 1000]
];

/**
 * Distancia de una fecha ISO respecto a ahora (p. ej. "dentro de 5 días", "mañana", "hace 2 horas")
 */
export function formatRelativeTime(
	dateString?: string | null,
	options?: BaseOptions & { now?: number }
): string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(dateString)) return fallback;

	const time = new Date(dateString).getTime();
	if (Number.isNaN(time)) return fallback;

	const diff = time - (options?.now ?? Date.now());
	const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

	for (const [unit, ms] of RELATIVE_UNITS) {
		if (Math.abs(diff) >= ms) return formatter.format(Math.round(diff / ms), unit);
	}
	return formatter.format(0, 'minute');
}

/**
 * Edad en años a partir de una fecha YYYY-MM-DD (p. ej. "1995-04-18" → "31 años")
 */
export function formatAge(dateString?: string | null, options?: BaseOptions): string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(dateString) || isEmptyString(dateString)) return fallback;

	const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
	if ([year, month, day].some(Number.isNaN)) return fallback;

	const today = new Date();
	const hadBirthday =
		today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
	const age = today.getFullYear() - year - (hadBirthday ? 0 : 1);
	if (age < 0) return fallback;

	return `${age} ${age === 1 ? 'año' : 'años'}`;
}

/**
 * Booleanos
 */
export function formatBoolean(
	value: boolean | null | undefined,
	options?: BaseOptions & { trueLabel?: string; falseLabel?: string }
): string {
	const fallback = options?.fallback ?? NO_DATA_LABEL;

	if (isNullish(value)) return fallback;

	return value ? (options?.trueLabel ?? 'Sí') : (options?.falseLabel ?? 'No');
}
