<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import type { MovimientoListItem } from '#lib/interfaces/index.ts';
	import {
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

	const hasActions = $derived(!!onFilterCliente);
	const delta = $derived(getMovimientoDelta(item.movimiento));
</script>

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<!-- Se muestran las iniciales del cliente, no su foto -->
		<ClienteAvatar cliente={{ ...item.cliente, avatar_url: null }} />
		<div class="min-w-0 flex-1">
			<h3 class="truncate font-semibold text-light-two dark:text-dark-two">
				{formatFullName(item.cliente)}
			</h3>
			<p class="mt-0.5 truncate text-sm text-light-two_d dark:text-dark-two_d">
				CI {item.cliente.ci}
			</p>
		</div>
		{#if hasActions}
			<div class="-mt-1.5 -mr-2 shrink-0 self-start">
				<MovimientoActions {item} {onFilterCliente} />
			</div>
		{/if}
	</div>

	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1 text-sm">
			<MovimientoTipoBadge tipo={item.movimiento.tipo_movimiento} size="sm" class="mb-1" />
			<MovimientoDetalle {item} />
		</div>
		<p
			class={[
				'shrink-0 font-semibold tabular-nums',
				delta >= 0 ? 'text-light-three dark:text-dark-three' : 'text-light-two dark:text-dark-two'
			]}
		>
			{formatMovimientoPuntos(item.movimiento)}
		</p>
	</div>

	<dl class="mt-auto space-y-2 border-t border-light-one_d pt-3 text-xs dark:border-dark-one_d">
		<div class="flex justify-between gap-2">
			<dt class="text-light-two_d dark:text-dark-two_d">Registrado por</dt>
			<dd class="truncate text-right text-light-two dark:text-dark-two">
				{#if item.emisor}
					{formatFullName(item.emisor)}
					<span class="text-light-two_d dark:text-dark-two_d">
						· {formatRole(item.emisor.role)}
					</span>
				{:else}
					{formatValue(null)}
				{/if}
			</dd>
		</div>
		<div class="flex justify-between gap-2">
			<dt class="text-light-two_d dark:text-dark-two_d">Fecha</dt>
			<dd class="text-right text-light-two dark:text-dark-two">
				{formatDateTime(item.movimiento.created_at)}
			</dd>
		</div>
	</dl>
</article>
