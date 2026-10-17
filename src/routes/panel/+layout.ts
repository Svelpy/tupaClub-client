import { guardRoute } from '#lib/utils/routeGuard.ts';
import type { LayoutLoad } from './$types';

// La sesión vive en localStorage: solo existe en el navegador, así que el área se renderiza ahí
export const ssr = false;

export const load: LayoutLoad = async (event) => {
	await guardRoute(event);
};
