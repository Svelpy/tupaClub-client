import type { Sucursal } from '#lib/interfaces/index.ts';

/** Ubicación de la sucursal en Google Maps; sin enlace cargado, se busca por su dirección */
export function getSucursalMapsUrl(
	sucursal: Pick<Sucursal, 'nombre' | 'direccion' | 'url_ubicacion'>
) {
	if (sucursal.url_ubicacion) return sucursal.url_ubicacion;
	const query = encodeURIComponent(`${sucursal.nombre}, ${sucursal.direccion}`);
	return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
