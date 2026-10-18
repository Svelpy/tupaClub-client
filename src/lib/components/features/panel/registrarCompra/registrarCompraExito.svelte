<script lang="ts">
	import { Button } from '#lib/components/ui/index.ts';
	import { CircleCheckIcon, PlusIcon } from '#lib/icons/outline/index.ts';
	import type { OperacionDetail } from '#lib/interfaces/index.ts';
	import { formatCurrency, formatDateTime, formatNumber, formatValue } from '#lib/utils/index.ts';

	interface Props {
		operacion: OperacionDetail;
		clienteNombre: string;
		/** Saldo antes de la compra; null si el cliente se creó con la compra */
		saldoAnterior: number | null;
		/** El cliente se registró junto con esta compra */
		isNuevoCliente?: boolean;
		onReset: () => void;
	}

	let {
		operacion,
		clienteNombre,
		saldoAnterior,
		isNuevoCliente = false,
		onReset
	}: Props = $props();

	const saldoNuevo = $derived((saldoAnterior ?? 0) + operacion.total_puntos);
</script>

<section
	role="status"
	class="mx-auto mt-6 max-w-xl rounded-2xl border border-light-one_d bg-light-one p-6 text-center sm:p-8 dark:border-dark-one_d dark:bg-dark-one"
>
	<span
		class="mx-auto flex size-16 items-center justify-center rounded-full bg-light-success/10 text-light-success dark:bg-dark-success/10 dark:text-dark-success"
	>
		<CircleCheckIcon class="size-9" />
	</span>
	<h2 class="mt-4 text-xl font-semibold text-light-two dark:text-dark-two">Compra registrada</h2>
	<p class="mt-1 text-sm text-light-two_d dark:text-dark-two_d">
		{clienteNombre} recibió
		<span class="font-semibold text-light-three dark:text-dark-three">
			{formatNumber(operacion.total_puntos)} puntos
		</span>
		{isNuevoCliente ? 'y quedó registrado como cliente.' : 'por esta compra.'}
	</p>

	<dl
		class="mt-6 divide-y divide-light-one_d rounded-xl border border-light-one_d text-left text-sm dark:divide-dark-one_d dark:border-dark-one_d"
	>
		<div class="flex justify-between gap-3 px-4 py-2.5">
			<dt class="text-light-two_d dark:text-dark-two_d">Monto de la compra</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatCurrency(operacion.total_compra)}
			</dd>
		</div>
		<div class="flex justify-between gap-3 px-4 py-2.5">
			<dt class="text-light-two_d dark:text-dark-two_d">Puntos asignados</dt>
			<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
				+{formatNumber(operacion.total_puntos)} pts
			</dd>
		</div>
		<div class="flex justify-between gap-3 px-4 py-2.5">
			<dt class="text-light-two_d dark:text-dark-two_d">Nuevo saldo del cliente</dt>
			<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
				{formatNumber(saldoNuevo)} pts
			</dd>
		</div>
		<div class="flex justify-between gap-3 px-4 py-2.5">
			<dt class="text-light-two_d dark:text-dark-two_d">Referencia</dt>
			<dd class="text-right break-words text-light-two dark:text-dark-two">
				{formatValue(operacion.referencia)}
			</dd>
		</div>
		<div class="flex justify-between gap-3 px-4 py-2.5">
			<dt class="text-light-two_d dark:text-dark-two_d">Fecha</dt>
			<dd class="text-right text-light-two dark:text-dark-two">
				{formatDateTime(operacion.created_at)}
			</dd>
		</div>
	</dl>

	<Button onclick={onReset} class="mt-6 w-full sm:w-auto">
		{#snippet leftIcon()}<PlusIcon class="size-5" />{/snippet}
		Registrar otra compra
	</Button>
</section>
