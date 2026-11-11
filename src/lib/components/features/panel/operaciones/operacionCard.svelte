<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { Badge } from '#lib/components/ui/index.ts';
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
		/** Solo OWNER y ADMIN; no se ofrece en operaciones ya anuladas */
		onAnular?: (item: OperacionListItem) => void;
	}

	let { item, onFilterReceptor, onFilterEmisor, onAnular }: Props = $props();

	const hasActions = $derived(!!onFilterReceptor || !!onFilterEmisor || !!onAnular);
	const isAnulada = $derived(!!item.operacion.anulada_at);
</script>

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<!-- Se muestran las iniciales del cliente, no su foto -->
		<ClienteAvatar cliente={{ ...item.receptor, avatar_url: null }} />
		<div class="min-w-0 flex-1">
			<div class="flex min-w-0 items-center gap-2">
				<h3 class="truncate font-semibold text-light-two dark:text-dark-two">
					{formatFullName(item.receptor)}
				</h3>
				{#if isAnulada}
					<Badge variant="error" size="sm">Anulada</Badge>
				{/if}
			</div>
			<p class="mt-0.5 line-clamp-2 text-sm text-light-two_d dark:text-dark-two_d">
				{formatValue(item.operacion.referencia)}
			</p>
		</div>
		{#if hasActions}
			<div class="-mt-1.5 -mr-2 shrink-0 self-start">
				<OperacionActions {item} {onFilterReceptor} {onFilterEmisor} {onAnular} />
			</div>
		{/if}
	</div>

	<dl
		class="mt-auto grid grid-cols-2 gap-3 border-t border-light-one_d pt-3 dark:border-dark-one_d"
	>
		<div>
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Puntos</dt>
			<dd
				class={[
					'font-semibold tabular-nums',
					isAnulada
						? 'text-light-two_d line-through dark:text-dark-two_d'
						: 'text-light-three dark:text-dark-three'
				]}
			>
				+{formatNumber(item.operacion.total_puntos)} pts
			</dd>
		</div>
		<div class="text-right">
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Compra</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatCurrency(item.operacion.total_compra)}
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Sucursal</dt>
			<dd class="truncate text-right text-light-two dark:text-dark-two">
				{formatValue(item.sucursal?.nombre)}
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Registrado por</dt>
			<dd class="truncate text-right text-light-two dark:text-dark-two">
				{formatFullName(item.emisor)}
				<span class="text-light-two_d dark:text-dark-two_d">
					· {formatRole(item.emisor.role)}
				</span>
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Fecha</dt>
			<dd class="text-right text-light-two dark:text-dark-two">
				{formatDateTime(item.operacion.created_at)}
			</dd>
		</div>
		{#if isAnulada}
			<div
				class="col-span-2 rounded-lg bg-light-error/10 p-2.5 text-xs text-light-two dark:bg-dark-error/10 dark:text-dark-two"
			>
				<p class="font-medium">
					Anulada el {formatDateTime(item.operacion.anulada_at ?? undefined)}
				</p>
				{#if item.operacion.motivo_anulacion}
					<p class="mt-0.5 text-light-two_d dark:text-dark-two_d">
						{item.operacion.motivo_anulacion}
					</p>
				{/if}
			</div>
		{/if}
	</dl>
</article>
