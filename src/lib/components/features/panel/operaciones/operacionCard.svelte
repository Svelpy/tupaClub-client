<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
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
		operacion: OperacionListItem;
		onFilterReceptor?: (operacion: OperacionListItem) => void;
		onFilterEmisor?: (operacion: OperacionListItem) => void;
	}

	let { operacion, onFilterReceptor, onFilterEmisor }: Props = $props();

	const hasActions = $derived(!!onFilterReceptor || !!onFilterEmisor);
</script>

<article
	class="flex flex-col gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex gap-3">
		<!-- El listado no trae la foto del cliente: se muestran sus iniciales -->
		<ClienteAvatar cliente={{ ...operacion.receptor, avatar_url: null }} />
		<div class="min-w-0 flex-1">
			<h3 class="truncate font-semibold text-light-two dark:text-dark-two">
				{formatFullName(operacion.receptor)}
			</h3>
			<p class="mt-0.5 line-clamp-2 text-sm text-light-two_d dark:text-dark-two_d">
				{formatValue(operacion.referencia)}
			</p>
		</div>
		{#if hasActions}
			<div class="-mt-1.5 -mr-2 shrink-0 self-start">
				<OperacionActions {operacion} {onFilterReceptor} {onFilterEmisor} />
			</div>
		{/if}
	</div>

	<dl
		class="mt-auto grid grid-cols-2 gap-3 border-t border-light-one_d pt-3 dark:border-dark-one_d"
	>
		<div>
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Puntos</dt>
			<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
				+{formatNumber(operacion.total_puntos)} pts
			</dd>
		</div>
		<div class="text-right">
			<dt class="text-xs text-light-two_d dark:text-dark-two_d">Compra</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatCurrency(operacion.total_compra)}
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Sucursal</dt>
			<dd class="truncate text-right text-light-two dark:text-dark-two">
				{formatValue(operacion.sucursal?.nombre)}
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Registrado por</dt>
			<dd class="truncate text-right text-light-two dark:text-dark-two">
				{formatFullName(operacion.emisor)}
				<span class="text-light-two_d dark:text-dark-two_d">
					· {formatRole(operacion.emisor.role)}
				</span>
			</dd>
		</div>
		<div class="col-span-2 flex justify-between gap-2 text-xs">
			<dt class="text-light-two_d dark:text-dark-two_d">Fecha</dt>
			<dd class="text-right text-light-two dark:text-dark-two">
				{formatDateTime(operacion.created_at)}
			</dd>
		</div>
	</dl>
</article>
