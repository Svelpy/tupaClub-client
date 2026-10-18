<script lang="ts">
	import { ValeImage } from '#lib/components/features/panel/vales/index.ts';
	import { Button, Sheet } from '#lib/components/ui/index.ts';
	import { CANJE_VIGENCIA_DIAS } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, CalendarIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, Vale } from '#lib/interfaces/index.ts';
	import { formatDate, formatNumber } from '#lib/utils/index.ts';

	interface Props {
		open: boolean;
		vale: Vale;
		negocio: Negocio;
		/** Saldo actual del cliente */
		saldo: number;
		loading: boolean;
		/** Error del último intento (p. ej. saldo insuficiente): el sheet sigue abierto */
		error: string;
		onConfirm: () => void;
		onClose: () => void;
	}

	let { open, vale, negocio, saldo, loading, error, onConfirm, onClose }: Props = $props();

	// Fecha local estimada de vencimiento si canjea hoy (el backend fija la exacta)
	function venceEl(): string {
		const now = new Date();
		const vence = new Date(now.getFullYear(), now.getMonth(), now.getDate() + CANJE_VIGENCIA_DIAS);
		const month = String(vence.getMonth() + 1).padStart(2, '0');
		const day = String(vence.getDate()).padStart(2, '0');
		return formatDate(`${vence.getFullYear()}-${month}-${day}`);
	}
</script>

<Sheet
	{open}
	title="Confirmar canje"
	description="Revisa los datos antes de canjear tus puntos."
	dismissible={!loading}
	{onClose}
>
	<div class="flex items-center gap-3 rounded-2xl bg-light-one_d/40 p-3 dark:bg-dark-one_d/40">
		<ValeImage {vale} size="lg" />
		<div class="min-w-0">
			<p class="truncate text-xs font-semibold text-light-three dark:text-dark-three">
				{negocio.nombre}
			</p>
			<p class="line-clamp-2 font-semibold text-light-two dark:text-dark-two">{vale.nombre}</p>
		</div>
	</div>

	<dl class="mt-5 space-y-2.5 text-sm">
		<div class="flex items-center justify-between gap-3">
			<dt class="text-light-two_d dark:text-dark-two_d">Tu saldo actual</dt>
			<dd class="text-light-two tabular-nums dark:text-dark-two">{formatNumber(saldo)} pts</dd>
		</div>
		<div class="flex items-center justify-between gap-3">
			<dt class="text-light-two_d dark:text-dark-two_d">Costo del vale</dt>
			<dd class="font-semibold text-light-accent tabular-nums dark:text-dark-accent">
				−{formatNumber(vale.total_puntos)} pts
			</dd>
		</div>
		<div
			class="flex items-center justify-between gap-3 border-t border-light-one_d pt-2.5 text-base dark:border-dark-one_d"
		>
			<dt class="font-semibold text-light-two dark:text-dark-two">Saldo después del canje</dt>
			<dd class="font-bold text-light-two tabular-nums dark:text-dark-two">
				{formatNumber(Math.max(0, saldo - vale.total_puntos))} pts
			</dd>
		</div>
	</dl>

	<p
		class="mt-5 flex items-start gap-2.5 rounded-xl bg-light-three/5 p-3 text-sm text-light-two dark:bg-dark-three/5 dark:text-dark-two"
	>
		<CalendarIcon class="mt-0.5 size-4 shrink-0 text-light-three dark:text-dark-three" />
		<span>
			Tendrás <strong>{CANJE_VIGENCIA_DIAS} días</strong> para presentar tu código en la sucursal,
			hasta el <strong>{venceEl()}</strong>.
		</span>
	</p>

	{#if error}
		<div
			role="alert"
			class="mt-4 flex items-start gap-2.5 rounded-xl border border-light-error/25 bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error/25 dark:bg-dark-error/10 dark:text-dark-error"
		>
			<AlertTriangleIcon class="mt-0.5 size-4 shrink-0" />
			<span>{error}</span>
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row">
			<Button variant="secondary" fullWidth disabled={loading} onclick={onClose}>Cancelar</Button>
			<Button fullWidth {loading} onclick={onConfirm}>Confirmar canje</Button>
		</div>
		<p class="mt-2 text-center text-xs text-light-two_d dark:text-dark-two_d">
			Los puntos se descuentan al confirmar.
		</p>
	{/snippet}
</Sheet>
