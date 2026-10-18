import { describe, expect, it } from 'vitest';
import { calcularPuntosCompra } from './puntos';

describe('calcularPuntosCompra', () => {
	it('es proporcional y redondea hacia abajo, como el backend', () => {
		expect(calcularPuntosCompra(150, 100, 10)).toBe(15);
		expect(calcularPuntosCompra(155, 100, 10)).toBe(15);
		expect(calcularPuntosCompra(159.99, 100, 10)).toBe(15);
		expect(calcularPuntosCompra(100, 100, 10)).toBe(10);
	});

	it('no se desvía por coma flotante', () => {
		// 1.15 × 100 = 114.99999999999999 en coma flotante
		expect(calcularPuntosCompra(1.15, 1, 100)).toBe(115);
	});

	it('devuelve 0 con montos o configuración no válidos', () => {
		expect(calcularPuntosCompra(0, 100, 10)).toBe(0);
		expect(calcularPuntosCompra(-50, 100, 10)).toBe(0);
		expect(calcularPuntosCompra(150, 0, 10)).toBe(0);
		expect(calcularPuntosCompra(Number.NaN, 100, 10)).toBe(0);
	});
});
