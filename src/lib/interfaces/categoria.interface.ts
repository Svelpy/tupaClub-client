import type { PaginatedResponse, PaginationParams } from './pagination.interface';

export interface Categoria {
	id: string;
	nombre: string;
	slug: string;
	/** Referencia al emoji en `#lib/data/categoriesEmojis.json` */
	icon_number: number;
	descripcion: string | null;
}

export interface CategoriaEmoji {
	icon_number: number;
	name: string;
	icon: string;
}

export type CategoriaListParams = PaginationParams;

export type CategoriaListResponse = PaginatedResponse<Categoria>;

export interface CreateCategoriaRequest {
	nombre: string;
	/** 0 = sin icono */
	icon_number: number;
	descripcion: string | null;
}

/** Categoría completa con datos de auditoría (respuesta de crear) */
export interface CategoriaDetail extends Categoria {
	is_deleted: boolean;
	created_at: string;
	created_by: string | null;
	updated_at: string | null;
	updated_by: string | null;
}

/** PATCH: solo se envían los campos modificados */
export type UpdateCategoriaRequest = Partial<CreateCategoriaRequest>;
