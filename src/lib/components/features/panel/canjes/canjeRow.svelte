<script lang="ts">
	import { ValeImage } from '#lib/components/features/panel/vales/index.ts';
	import { TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { CanjeListItem } from '#lib/interfaces/index.ts';
	import {
		formatCurrency,
		formatDateTime,
		formatNumber,
		formatValue,
		getCanjeStatus
	} from '#lib/utils/index.ts';
	import CanjeActions from './canjeActions.svelte';
	import CanjeCodigo from './canjeCodigo.svelte';
	import CanjeEstadoDetalle from './canjeEstadoDetalle.svelte';
	import CanjeStatusBadge from './canjeStatusBadge.svelte';

	interface Props {
		item: CanjeListItem;
		now: number;
		onCancel?: (item: CanjeListItem) => void;
	}

	let { item, now, onCancel }: Props = $props();

	// La columna depende del permiso; la opción, de que el canje siga pendiente y vigente
	const hasActions = $derived(!!onCancel);
	const status = $derived(getCanjeStatus(item.canje, now));
	const cancelHandler = $derived(status === 'PENDIENTE' ? onCancel : undefined);
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<ValeImage vale={item.vale} />
			<div class="min-w-0">
				<p class="truncate font-medium text-light-two dark:text-dark-two">{item.vale.nombre}</p>
				<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
					<!-- En tablet el código no tiene columna propia -->
					<span class="lg:hidden">
						<CanjeCodigo canje={item.canje} class="text-light-two_d dark:text-dark-two_d" /> ·
					</span>
					{formatValue(item.canje.referencia)}
				</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="hidden px-4 py-3 lg:table-cell">
		<CanjeCodigo canje={item.canje} />
	</TableCell>
	<TableCell class="px-4 py-3 text-right whitespace-nowrap">
		<p class="font-semibold text-light-three tabular-nums dark:text-dark-three">
			{formatNumber(item.canje.total_puntos)} pts
		</p>
		<p class="text-xs text-light-two_d tabular-nums dark:text-dark-two_d">
			{formatCurrency(item.canje.total_costo)}
		</p>
	</TableCell>
	<TableCell class="px-4 py-3">
		<div class="flex flex-col items-start gap-1">
			<CanjeStatusBadge {status} />
			<CanjeEstadoDetalle canje={item.canje} {now} />
		</div>
	</TableCell>
	<TableCell class="hidden px-4 py-3 text-sm text-light-two_d xl:table-cell dark:text-dark-two_d">
		{formatDateTime(item.canje.created_at)}
	</TableCell>
	{#if hasActions}
		<TableCell class="px-2 py-3 text-right">
			<CanjeActions {item} onCancel={cancelHandler} />
		</TableCell>
	{/if}
</TableRow>
