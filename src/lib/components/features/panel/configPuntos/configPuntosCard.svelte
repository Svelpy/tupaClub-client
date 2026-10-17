<script lang="ts">
	import { ShoppingCartIcon, TicketIcon } from '#lib/icons/outline/index.ts';
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

<article
	class={[
		'rounded-xl border bg-light-one p-4 dark:bg-dark-one',
		isActive
			? 'border-light-success/40 dark:border-dark-success/40'
			: 'border-light-one_d dark:border-dark-one_d'
	]}
>
	<ConfigPuntosEstadoBadge {isActive} />

	<dl class="mt-3 space-y-3 text-sm">
		<div>
			<dt class="flex items-center gap-1.5 text-xs text-light-two_d dark:text-dark-two_d">
				<ShoppingCartIcon class="size-4" />
				Asignación de puntos
			</dt>
			<dd class="mt-1">
				<ConfigPuntosRegla
					type="asignacion"
					bolivianos={config.asignacion_bolivianos}
					puntos={config.asignacion_puntos}
				/>
			</dd>
		</div>
		<div>
			<dt class="flex items-center gap-1.5 text-xs text-light-two_d dark:text-dark-two_d">
				<TicketIcon class="size-4" />
				Costo de vale
			</dt>
			<dd class="mt-1">
				<ConfigPuntosRegla
					type="vale"
					bolivianos={config.costo_vale_bolivianos}
					puntos={config.costo_vale_puntos}
				/>
			</dd>
		</div>
	</dl>

	<dl
		class="mt-3 flex justify-between gap-2 border-t border-light-one_d pt-3 text-sm dark:border-dark-one_d"
	>
		<dt class="text-light-two_d dark:text-dark-two_d">Inicio de vigencia</dt>
		<dd class="text-right text-light-two dark:text-dark-two">
			{formatDateTime(config.start_date)}
		</dd>
	</dl>
</article>
