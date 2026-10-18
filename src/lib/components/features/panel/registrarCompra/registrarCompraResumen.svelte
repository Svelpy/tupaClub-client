<script lang="ts">
	import { ConfigPuntosRegla } from '#lib/components/features/panel/configPuntos/index.ts';
	import { RegistrarCompraResumenSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, RefreshIcon, SparklesIcon } from '#lib/icons/outline/index.ts';
	import type { ConfigPuntosDetail } from '#lib/interfaces/index.ts';
	import {
		calcularPuntosCompra,
		formatCurrency,
		formatDecimal,
		formatNumber
	} from '#lib/utils/index.ts';

	interface Props {
		/** Configuración activa; null si no hay ninguna o aún no cargó */
		config: ConfigPuntosDetail | null;
		isLoadingConfig?: boolean;
		configError?: string;
		onRetryConfig?: () => void;
		/** Monto ingresado; null mientras está vacío */
		totalCompra: number | null;
		/** Nombre del cliente elegido; null si aún no se buscó */
		clienteNombre: string | null;
		/** Saldo del cliente existente; null si es un cliente nuevo o no hay cliente */
		saldoActual: number | null;
		/** id del formulario que envía el botón de registrar */
		formId: string;
		isSubmitting?: boolean;
	}

	let {
		config,
		isLoadingConfig = false,
		configError = '',
		onRetryConfig,
		totalCompra,
		clienteNombre,
		saldoActual,
		formId,
		isSubmitting = false
	}: Props = $props();

	const montoValido = $derived(totalCompra !== null && totalCompra > 0);
	const montoMinimo = $derived(config?.asignacion_bolivianos ?? 0);
	const faltaParaMinimo = $derived(
		config && montoValido && totalCompra! < montoMinimo ? montoMinimo - totalCompra! : 0
	);
	const puntos = $derived(
		config && montoValido && !faltaParaMinimo
			? calcularPuntosCompra(totalCompra!, config.asignacion_bolivianos, config.asignacion_puntos)
			: 0
	);
	const saldoNuevo = $derived((saldoActual ?? 0) + puntos);
</script>

<section
	aria-labelledby="registrar-compra-resumen"
	class="overflow-hidden rounded-2xl border border-light-one_d bg-light-one dark:border-dark-one_d dark:bg-dark-one"
>
	<h2
		id="registrar-compra-resumen"
		class="border-b border-light-one_d px-5 py-4 font-semibold text-light-two dark:border-dark-one_d dark:text-dark-two"
	>
		Resumen de puntos
	</h2>

	{#if isLoadingConfig}
		<RegistrarCompraResumenSkeleton />
	{:else if !config}
		<div role="alert" class="flex flex-col items-center gap-3 px-5 py-8 text-center">
			<AlertTriangleIcon class="size-9 text-light-error dark:text-dark-error" />
			<p class="text-sm text-light-two dark:text-dark-two">
				{configError || 'No hay una configuración de puntos activa.'}
			</p>
			<p class="text-xs text-light-two_d dark:text-dark-two_d">
				Sin ella no se pueden asignar puntos. Pide a un administrador que la cree en Configuración
				de puntos.
			</p>
			{#if onRetryConfig}
				<Button variant="outline" size="sm" onclick={onRetryConfig}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			{/if}
		</div>
	{:else}
		<div class="space-y-5 p-5">
			<div>
				<p class="text-xs text-light-two_d dark:text-dark-two_d">Regla vigente</p>
				<div class="mt-1 text-sm">
					<ConfigPuntosRegla
						type="asignacion"
						bolivianos={config.asignacion_bolivianos}
						puntos={config.asignacion_puntos}
					/>
				</div>
			</div>

			<!-- Puntos que recibirá el cliente con el monto ingresado -->
			<div
				aria-live="polite"
				class="rounded-xl bg-light-one_d/60 p-4 text-center dark:bg-dark-one_d/60"
			>
				<p class="text-xs text-light-two_d dark:text-dark-two_d">
					{clienteNombre ? `${clienteNombre} recibirá` : 'El cliente recibirá'}
				</p>
				<p
					class={[
						'mt-1 flex items-center justify-center gap-1.5 text-4xl leading-none font-bold tabular-nums',
						puntos > 0
							? 'text-light-three dark:text-dark-three'
							: 'text-light-four dark:text-dark-four'
					]}
				>
					{#if puntos > 0}<SparklesIcon class="size-7" />{/if}
					+{formatNumber(puntos)}
				</p>
				<p class="mt-1 text-sm text-light-two_d dark:text-dark-two_d">puntos</p>

				<p class="mt-3 text-xs text-light-two_d tabular-nums dark:text-dark-two_d">
					{#if !montoValido}
						Ingresa el monto de la compra para calcularlos.
					{:else if faltaParaMinimo}
						Faltan {formatCurrency(faltaParaMinimo)} para el mínimo de Bs {formatDecimal(
							montoMinimo
						)}.
					{:else}
						{formatCurrency(totalCompra)} × {config.asignacion_puntos} pts ÷ Bs {formatDecimal(
							config.asignacion_bolivianos
						)}, sin decimales
					{/if}
				</p>
			</div>

			{#if saldoActual !== null}
				<dl class="space-y-1.5 text-sm">
					<div class="flex justify-between gap-2">
						<dt class="text-light-two_d dark:text-dark-two_d">Saldo actual</dt>
						<dd class="text-light-two tabular-nums dark:text-dark-two">
							{formatNumber(saldoActual)} pts
						</dd>
					</div>
					<div
						class="flex justify-between gap-2 border-t border-light-one_d pt-1.5 font-semibold dark:border-dark-one_d"
					>
						<dt class="text-light-two dark:text-dark-two">Nuevo saldo</dt>
						<dd class="text-light-three tabular-nums dark:text-dark-three">
							{formatNumber(saldoNuevo)} pts
						</dd>
					</div>
				</dl>
			{/if}

			<Button type="submit" form={formId} loading={isSubmitting} fullWidth size="lg">
				{puntos > 0 ? `Registrar y asignar ${formatNumber(puntos)} pts` : 'Registrar compra'}
			</Button>
		</div>
	{/if}
</section>
