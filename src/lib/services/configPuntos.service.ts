import { apiFidelityTupa } from '#lib/config/index.ts';
import type {
	ConfigPuntosDetail,
	ConfigPuntosListParams,
	ConfigPuntosListResponse,
	CreateConfigPuntosRequest
} from '#lib/interfaces/index.ts';
import { buildPaginationQuery } from '#lib/utils/pagination.ts';

class ConfigPuntosService {
	/** Historial de configuraciones; la vigente viene con status ACTIVE */
	async list(params: ConfigPuntosListParams = {}): Promise<ConfigPuntosListResponse> {
		const query = buildPaginationQuery(params);
		return apiFidelityTupa.get<ConfigPuntosListResponse>(`/config-puntos/?${query}`, {
			requireAuth: true
		});
	}

	/** Sustituye la configuración activa: la anterior queda INACTIVE */
	async create(data: CreateConfigPuntosRequest): Promise<ConfigPuntosDetail> {
		return apiFidelityTupa.post<ConfigPuntosDetail>('/config-puntos/', data, {
			requireAuth: true
		});
	}
}

export const configPuntosService = new ConfigPuntosService();
