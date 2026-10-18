import { apiFidelityTupa } from '#lib/config/index.ts';
import type { ResumenAdmin, ResumenCajero, ResumenCliente } from '#lib/interfaces/index.ts';

class ResumenService {
	/** Solo para el rol CLIENTE: resumen del usuario en sesión */
	async getCliente(): Promise<ResumenCliente> {
		return apiFidelityTupa.get<ResumenCliente>('/resumen/cliente', { requireAuth: true });
	}

	/** Solo para OWNER y ADMIN (ver `RESUMEN_ADMIN_ROLES`): actividad de hoy y del mes */
	async getAdmin(): Promise<ResumenAdmin> {
		return apiFidelityTupa.get<ResumenAdmin>('/resumen/admin', { requireAuth: true });
	}

	/** Solo para CAJERO (ver `RESUMEN_CAJERO_ROLES`): sus compras registradas hoy */
	async getCajero(): Promise<ResumenCajero> {
		return apiFidelityTupa.get<ResumenCajero>('/resumen/cajero', { requireAuth: true });
	}
}

export const resumenService = new ResumenService();
