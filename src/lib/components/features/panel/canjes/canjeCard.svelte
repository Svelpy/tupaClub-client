<script lang="ts">
	import { ValeImage } from '#lib/components/features/panel/vales/index.ts';
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

	const status = $derived(getCanjeStatus(item.canje, now));
	// Solo un pendiente que aún no venció se puede cancelar
	const cancelHandler = $derived(status === 'PENDIENTE' ? onCancel : undefined);
</script>

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<ValeImage vale={item.vale} />
		<div class="min-w-0 flex-1">
			<h3 class="font-semibold text-light-two dark:text-dark-two">{item.vale.nombre}</h3>
			<p class="mt-0.5 line-clamp-2 text-sm text-light-two_d dark:text-dark-two_d">
				{formatValue(item.canje.referencia)}
			</p>
		</div>
		{#if cancelHandler}
			<div class="-mt-1.5 -mr-2 shrink-0 self-start">
				<CanjeActions {item} onCancel={cancelHandler} />
			</div>
		{/if}
	</div>

	<div class="flex items-end justify-between gap-3">
		<div class="flex min-w-0 flex-col items-start gap-1">
			<CanjeStatusBadge {status} />
			<CanjeEstadoDetalle canje={item.canje} {now} />
		</div>
		<CanjeCodigo canje={item.canje} class="text-sm" />
	</div>

	<dl
		class="mt-auto grid grid-cols-2 gap-3 border-t border-light-one_d pt-3 dark:border-dark-one_d"
	>
		<div>
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Puntos</dt>
			<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
				{formatNumber(item.canje.total_puntos)} pts
			</dd>
		</div>
		<div class="text-right">
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Valor</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatCurrency(item.canje.total_costo)}
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Solicitado</dt>
			<dd class="text-right text-light-two dark:text-dark-two">
				{formatDateTime(item.canje.created_at)}
			</dd>
		</div>
	</dl>
</article>
