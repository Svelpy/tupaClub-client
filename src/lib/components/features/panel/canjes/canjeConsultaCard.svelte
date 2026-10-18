<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { ValeImage } from '#lib/components/features/panel/vales/index.ts';
	import { AlertTriangleIcon, BuildindStoreIcon } from '#lib/icons/outline/index.ts';
	import type { CanjeConsulta } from '#lib/interfaces/index.ts';
	import {
		formatCodigoCanje,
		formatCurrency,
		formatDateTime,
		formatNumber,
		getCanjeStatus
	} from '#lib/utils/index.ts';
	import CanjeEstadoDetalle from './canjeEstadoDetalle.svelte';
	import CanjeStatusBadge from './canjeStatusBadge.svelte';

	interface Props {
		consulta: CanjeConsulta;
		/** Momento de la consulta (ms), para decidir si un pendiente ya venció */
		now: number;
	}

	let { consulta, now }: Props = $props();

	const canje = $derived(consulta.canje);
	const cliente = $derived(consulta.usuario_cliente);
	const status = $derived(getCanjeStatus(canje, now));
	const clienteNombre = $derived(`${cliente.nombre} ${cliente.apellidos ?? ''}`.trim());

	// Por qué el canje ya no se puede confirmar ni cancelar; null = sigue pendiente y vigente
	const bloqueo = $derived.by(() => {
		switch (status) {
			case 'CANJEADO':
				return {
					title: 'Este canje ya fue usado',
					text: `Se confirmó el ${formatDateTime(canje.updated_at)}. El vale ya se entregó y el código no se puede volver a usar.`
				};
			case 'CANCELADO':
				return {
					title: 'Este canje fue cancelado',
					text: `Se canceló el ${formatDateTime(canje.updated_at)}. El código ya no es válido.`
				};
			case 'EXPIRADO':
				return {
					title: 'Este canje venció',
					text: `Su vigencia terminó el ${formatDateTime(canje.expires_at)}. El código ya no es válido.`
				};
			default:
				return null;
		}
	});
</script>

<div class="space-y-4">
	{#if bloqueo}
		<div
			role="alert"
			class="flex items-start gap-3 rounded-xl border border-light-error/25 bg-light-error/10 p-4 dark:border-dark-error/25 dark:bg-dark-error/10"
		>
			<AlertTriangleIcon class="mt-0.5 size-5 shrink-0 text-light-error dark:text-dark-error" />
			<div class="text-sm">
				<p
					class="font-semibold text-[color-mix(in_oklab,var(--color-light-error)_80%,black)] dark:text-[color-mix(in_oklab,var(--color-dark-error)_80%,black)]"
				>
					{bloqueo.title}
				</p>
				<p class="text-light-two dark:text-dark-two">{bloqueo.text}</p>
			</div>
		</div>
	{/if}

	<div
		class="divide-y divide-light-one_d overflow-hidden rounded-xl border border-light-one_d dark:divide-dark-one_d dark:border-dark-one_d"
	>
		<!-- Vale y estado -->
		<div class="flex items-start gap-3 p-4">
			<ValeImage vale={consulta.vale} size="lg" />
			<div class="min-w-0 flex-1">
				<p class="font-semibold text-light-two dark:text-dark-two">{consulta.vale.nombre}</p>
				<p class="mt-0.5 flex items-center gap-1 text-xs text-light-two_d dark:text-dark-two_d">
					<BuildindStoreIcon class="size-3.5 shrink-0" />
					<span class="truncate">{consulta.negocio.nombre}</span>
				</p>
				<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
					<CanjeStatusBadge {status} />
					<CanjeEstadoDetalle {canje} {now} />
				</div>
			</div>
		</div>

		<!-- Titular: el cajero puede pedir la CI para comprobar que es el mismo cliente -->
		<div class="flex items-center gap-3 p-4">
			<ClienteAvatar {cliente} />
			<div class="min-w-0 flex-1">
				<p class="text-xs text-light-two_d dark:text-dark-two_d">Cliente</p>
				<p class="truncate font-medium text-light-two dark:text-dark-two">{clienteNombre}</p>
			</div>
			<div class="shrink-0 text-right">
				<p class="text-xs text-light-two_d dark:text-dark-two_d">CI</p>
				<p class="font-medium text-light-two tabular-nums dark:text-dark-two">{cliente.ci}</p>
			</div>
		</div>

		<dl class="grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-sm">
			<div>
				<dt class="text-xs text-light-two_d dark:text-dark-two_d">Código</dt>
				<dd class="font-mono tracking-wider text-light-two tabular-nums dark:text-dark-two">
					{formatCodigoCanje(canje.codigo_canje)}
				</dd>
			</div>
			<div>
				<dt class="text-xs text-light-two_d dark:text-dark-two_d">Solicitado</dt>
				<dd class="text-light-two dark:text-dark-two">{formatDateTime(canje.created_at)}</dd>
			</div>
			<div>
				<dt class="text-xs text-light-two_d dark:text-dark-two_d">Puntos canjeados</dt>
				<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
					{formatNumber(canje.total_puntos)} pts
				</dd>
			</div>
			<div>
				<dt class="text-xs text-light-two_d dark:text-dark-two_d">Valor del vale</dt>
				<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
					{formatCurrency(canje.total_costo)}
				</dd>
			</div>
		</dl>
	</div>
</div>
