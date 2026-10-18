import { describe, it, expect } from 'vitest';
import { getMovimientoDelta } from './movimiento';

describe('getMovimientoDelta', () => {
	it('una acumulación siempre suma', () => {
		expect(getMovimientoDelta({ tipo_movimiento: 'ACUMULA', puntos: 150 })).toBe(150);
		expect(getMovimientoDelta({ tipo_movimiento: 'ACUMULA', puntos: -150 })).toBe(150);
	});

	it('un canje siempre resta, venga con el signo que venga', () => {
		expect(getMovimientoDelta({ tipo_movimiento: 'CANJE', puntos: 500 })).toBe(-500);
		expect(getMovimientoDelta({ tipo_movimiento: 'CANJE', puntos: -500 })).toBe(-500);
	});

	it('un ajuste respeta el signo recibido', () => {
		expect(getMovimientoDelta({ tipo_movimiento: 'AJUSTE', puntos: 500 })).toBe(500);
		expect(getMovimientoDelta({ tipo_movimiento: 'AJUSTE', puntos: -20 })).toBe(-20);
	});
});
