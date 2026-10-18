<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { OperacionListItem } from '#lib/interfaces/index.ts';
	import {
		formatCurrency,
		formatDateTime,
		formatFullName,
		formatNumber,
		formatRole,
		formatValue
	} from '#lib/utils/index.ts';
	import OperacionActions from './operacionActions.svelte';

	interface Props {
		item: OperacionListItem;
		onFilterReceptor?: (item: OperacionListItem) => void;
		onFilterEmisor?: (item: OperacionListItem) => void;
	}

	let { item, onFilterReceptor, onFilterEmisor }: Props = $props();

	// Sin ninguna acción disponible no se muestra la celda
	const hasActions = $derived(!!onFilterReceptor || !!onFilterEmisor);
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<!-- Se muestran las iniciales del cliente, no su foto -->
			<ClienteAvatar cliente={{ ...item.receptor, avatar_url: null }} />
			<div class="min-w-0">
				<p class="truncate font-medium text-light-two dark:text-dark-two">
					{formatFullName(item.receptor)}
				</p>
				<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
					{formatValue(item.operacion.referencia)}
				</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3 text-right whitespace-nowrap">
		<p class="font-semibold text-light-three tabular-nums dark:text-dark-three">
			+{formatNumber(item.operacion.total_puntos)} pts
		</p>
		<p class="text-xs text-light-two_d tabular-nums dark:text-dark-two_d">
			{formatCurrency(item.operacion.total_compra)}
		</p>
	</TableCell>
	<TableCell class="hidden px-4 py-3 text-sm lg:table-cell">
		<p class="truncate text-light-two dark:text-dark-two">
			{formatValue(item.sucursal?.nombre)}
		</p>
	</TableCell>
	<TableCell class="hidden px-4 py-3 text-sm xl:table-cell">
		<p class="truncate text-light-two dark:text-dark-two">{formatFullName(item.emisor)}</p>
		<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
			{formatRole(item.emisor.role)}
		</p>
	</TableCell>
	<TableCell class="px-4 py-3 text-sm text-light-two_d dark:text-dark-two_d">
		{formatDateTime(item.operacion.created_at)}
	</TableCell>
	{#if hasActions}
		<TableCell class="px-2 py-3 text-right">
			<OperacionActions {item} {onFilterReceptor} {onFilterEmisor} />
		</TableCell>
	{/if}
</TableRow>
