<script lang="ts">
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { ConfigPuntos } from '#lib/interfaces/index.ts';
	import { formatDateTime } from '#lib/utils/index.ts';
	import ConfigPuntosEstadoBadge from './configPuntosEstadoBadge.svelte';
	import ConfigPuntosRegla from './configPuntosRegla.svelte';

	interface Props {
		config: ConfigPuntos;
	}

	let { config }: Props = $props();

	const isActive = $derived(config.status === 'ACTIVE');
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50 {isActive
		? 'bg-light-success/5 dark:bg-dark-success/5'
		: ''}"
>
	<TableCell class="px-4 py-3">
		<ConfigPuntosEstadoBadge {isActive} />
	</TableCell>
	<TableCell class="px-4 py-3">
		<ConfigPuntosRegla
			type="asignacion"
			bolivianos={config.asignacion_bolivianos}
			puntos={config.asignacion_puntos}
		/>
	</TableCell>
	<TableCell class="px-4 py-3">
		<ConfigPuntosRegla
			type="vale"
			bolivianos={config.costo_vale_bolivianos}
			puntos={config.costo_vale_puntos}
		/>
	</TableCell>
	<TableCell class="px-4 py-3 text-sm text-light-two_d dark:text-dark-two_d">
		{formatDateTime(config.start_date)}
	</TableCell>
</TableRow>
