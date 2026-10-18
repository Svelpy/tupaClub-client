<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { MovimientoListItem } from '#lib/interfaces/index.ts';
	import {
		formatDate,
		formatDateTime,
		formatFullName,
		formatMovimientoPuntos,
		formatRole,
		formatValue,
		getMovimientoDelta
	} from '#lib/utils/index.ts';
	import MovimientoActions from './movimientoActions.svelte';
	import MovimientoDetalle from './movimientoDetalle.svelte';
	import MovimientoTipoBadge from './movimientoTipoBadge.svelte';

	interface Props {
		item: MovimientoListItem;
		onFilterCliente?: (item: MovimientoListItem) => void;
	}

	let { item, onFilterCliente }: Props = $props();

	// Sin ninguna acción disponible no se muestra la celda
	const hasActions = $derived(!!onFilterCliente);
	const delta = $derived(getMovimientoDelta(item.movimiento));
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<!-- Se muestran las iniciales del cliente, no su foto -->
			<ClienteAvatar cliente={{ ...item.cliente, avatar_url: null }} />
			<div class="min-w-0">
				<p class="truncate font-medium text-light-two dark:text-dark-two">
					{formatFullName(item.cliente)}
				</p>
				<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">CI {item.cliente.ci}</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3 text-sm">
		<MovimientoTipoBadge tipo={item.movimiento.tipo_movimiento} size="sm" class="mb-1" />
		<MovimientoDetalle {item} />
	</TableCell>
	<TableCell class="px-4 py-3 text-right whitespace-nowrap">
		<p
			class={[
				'font-semibold tabular-nums',
				delta >= 0 ? 'text-light-three dark:text-dark-three' : 'text-light-two dark:text-dark-two'
			]}
		>
			{formatMovimientoPuntos(item.movimiento)}
		</p>
		<!-- Sin la columna de fecha (menos de lg) se muestra aquí -->
		<p class="text-xs text-light-two_d lg:hidden dark:text-dark-two_d">
			{formatDate(item.movimiento.created_at)}
		</p>
	</TableCell>
	<TableCell class="hidden px-4 py-3 text-sm xl:table-cell">
		{#if item.emisor}
			<p class="truncate text-light-two dark:text-dark-two">{formatFullName(item.emisor)}</p>
			<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
				{formatRole(item.emisor.role)}
			</p>
		{:else}
			<p class="text-light-two_d dark:text-dark-two_d">{formatValue(null)}</p>
		{/if}
	</TableCell>
	<TableCell class="hidden px-4 py-3 text-sm text-light-two_d lg:table-cell dark:text-dark-two_d">
		{formatDateTime(item.movimiento.created_at)}
	</TableCell>
	{#if hasActions}
		<TableCell class="px-2 py-3 text-right">
			<MovimientoActions {item} {onFilterCliente} />
		</TableCell>
	{/if}
</TableRow>
