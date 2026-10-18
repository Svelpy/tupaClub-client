export interface Sucursal {
	id: string;
	negocio_id: string;
	nombre: string;
	direccion: string;
	telefono: string | null;
	/** Enlace a Google Maps u otro servicio de mapas */
	url_ubicacion: string | null;
	created_at: string;
	updated_at: string | null;
}

export interface CreateSucursalRequest {
	negocio_id: string;
	nombre: string;
	direccion: string;
	telefono: string | null;
	url_ubicacion: string | null;
}

export type UpdateSucursalRequest = Partial<CreateSucursalRequest>;

/** Sucursal completa con datos de auditoría (respuesta de crear/actualizar) */
export interface SucursalDetail extends Sucursal {
	is_deleted: boolean;
	created_at: string;
	created_by: string | null;
	updated_at: string | null;
	updated_by: string | null;
}
