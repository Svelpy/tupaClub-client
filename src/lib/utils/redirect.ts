import { goto } from '$app/navigation';
import type { ResolvedPathname } from '$app/types';

/** Recibe una ruta ya resuelta: redirect(resolve('/app')) */
export const redirect = (url: ResolvedPathname, replaceState: boolean = false): void => {
	goto(url, { replaceState });
};
