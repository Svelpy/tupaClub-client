<script lang="ts">
	import type { Component } from 'svelte';
	import { Button, Input } from '#lib/components/ui/index.ts';
	import {
		AlertTriangleIcon,
		DownloadIcon,
		FileDescriptionIcon,
		GiftIcon,
		SparklesIcon
	} from '#lib/icons/outline/index.ts';
	import type { ReporteTipo } from '#lib/interfaces/index.ts';
	import { errorService, reporteService } from '#lib/services/index.ts';
	import { alert, downloadBlob, toISODate, todayISO, validateSchema } from '#lib/utils/index.ts';
	import { reportePuntosSchema } from '#lib/zod/index.ts';

	type IconComponent = Component<{ class?: string }>;

	const TIPOS: { value: ReporteTipo; label: string; description: string; icon: IconComponent }[] = [
		{
			value: 'ASIGNADOS',
			label: 'Asignados',
			description: 'Puntos que ganaron los clientes con sus compras',
			icon: SparklesIcon
		},
		{
			value: 'CANJEADOS',
			label: 'Canjeados',
			description: 'Puntos que los clientes usaron en vales',
			icon: GiftIcon
		}
	];

	interface Rango {
		id: string;
		label: string;
		get: () => { inicio: string; fin: string };
	}

	// Atajos de periodo, calculados al hacer click para que "hoy" esté siempre al día
	const RANGOS: Rango[] = [
		// Periodos de un día: inicio y fin son la misma fecha
		{
			id: 'hoy',
			label: 'Hoy',
			get: () => {
				const hoy = todayISO();
				return { inicio: hoy, fin: hoy };
			}
		},
		{
			id: 'ayer',
			label: 'Ayer',
			get: () => {
				const hoy = new Date();
				const ayer = toISODate(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1));
				return { inicio: ayer, fin: ayer };
			}
		},
		{
			id: 'ultimos-7',
			label: 'Últimos 7 días',
			get: () => {
				const hoy = new Date();
				return {
					inicio: toISODate(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 6)),
					fin: toISODate(hoy)
				};
			}
		},
		{
			id: 'este-mes',
			label: 'Este mes',
			get: () => {
				const hoy = new Date();
				return {
					inicio: toISODate(new Date(hoy.getFullYear(), hoy.getMonth(), 1)),
					fin: toISODate(hoy)
				};
			}
		},
		{
			id: 'mes-pasado',
			label: 'Mes pasado',
			get: () => {
				const hoy = new Date();
				return {
					inicio: toISODate(new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)),
					// Día 0 del mes actual = último día del mes anterior
					fin: toISODate(new Date(hoy.getFullYear(), hoy.getMonth(), 0))
				};
			}
		}
	];

	const HOJAS = [
		{ nombre: 'Por sucursal', detalle: 'Una fila por día con cantidad, puntos y bolivianos.' },
		{ nombre: 'Por usuario', detalle: 'Totales del periodo, de mayor a menor en bolivianos.' }
	];

	// Por defecto, el mes en curso
	const inicial = (RANGOS.find((rango) => rango.id === 'este-mes') ?? RANGOS[0]).get();
	const today = todayISO();

	let tipo = $state<ReporteTipo>('ASIGNADOS');
	let fechaInicio = $state(inicial.inicio);
	let fechaFin = $state(inicial.fin);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');
	let isLoading = $state(false);

	// El atajo activo se deduce de las fechas: si se editan a mano deja de estar marcado
	const rangoActivo = $derived(
		RANGOS.find((rango) => {
			const { inicio, fin } = rango.get();
			return inicio === fechaInicio && fin === fechaFin;
		})?.id ?? null
	);

	function aplicarRango(rango: Rango) {
		const { inicio, fin } = rango.get();
		fechaInicio = inicio;
		fechaFin = fin;
		fieldErrors = {};
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const result = validateSchema(reportePuntosSchema, {
			tipo,
			fecha_inicio: fechaInicio,
			fecha_fin: fechaFin
		});
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		try {
			const blob = await reporteService.descargarPuntos(result.data);
			const { tipo: t, fecha_inicio, fecha_fin } = result.data;
			downloadBlob(blob, `reporte-puntos-${t.toLowerCase()}_${fecha_inicio}_${fecha_fin}.xlsx`);
			alert('success', 'Reporte descargado');
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<form
	onsubmit={handleSubmit}
	novalidate
	aria-labelledby="reporte-puntos-titulo"
	class="max-w-2xl rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex items-start gap-3">
		<span
			class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
			aria-hidden="true"
		>
			<FileDescriptionIcon class="size-5" />
		</span>
		<div class="min-w-0">
			<h2 id="reporte-puntos-titulo" class="font-semibold text-light-two dark:text-dark-two">
				Reporte de puntos
			</h2>
			<p class="mt-0.5 text-sm text-light-two_d dark:text-dark-two_d">
				Descarga en Excel los puntos de todas las sucursales en el periodo que elijas.
			</p>
		</div>
	</div>

	{#if formError}
		<div
			role="alert"
			class="mt-5 flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
		>
			<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
			<span>{formError}</span>
		</div>
	{/if}

	<fieldset class="mt-6" disabled={isLoading}>
		<legend class="text-sm font-medium text-light-two sm:text-base dark:text-dark-two">
			Tipo de puntos
		</legend>
		<div class="mt-2 grid gap-3 sm:grid-cols-2">
			{#each TIPOS as opcion (opcion.value)}
				{@const selected = tipo === opcion.value}
				<label
					class={[
						'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors focus-within:ring-2 focus-within:ring-light-three dark:focus-within:ring-dark-three',
						selected
							? 'border-light-three bg-light-three/5 dark:border-dark-three dark:bg-dark-three/5'
							: 'border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50'
					]}
				>
					<input
						type="radio"
						name="reporte-tipo"
						value={opcion.value}
						bind:group={tipo}
						class="sr-only"
					/>
					<span
						class={[
							'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
							selected
								? 'bg-light-three text-light-one dark:bg-dark-three dark:text-dark-one'
								: 'bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three'
						]}
						aria-hidden="true"
					>
						<opcion.icon class="size-4" />
					</span>
					<span class="min-w-0">
						<span class="block text-sm font-semibold text-light-two dark:text-dark-two">
							{opcion.label}
						</span>
						<span class="block text-xs text-light-two_d dark:text-dark-two_d">
							{opcion.description}
						</span>
					</span>
				</label>
			{/each}
		</div>
	</fieldset>

	<fieldset class="mt-6" disabled={isLoading}>
		<legend class="text-sm font-medium text-light-two sm:text-base dark:text-dark-two">
			Periodo
		</legend>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each RANGOS as rango (rango.id)}
				<button
					type="button"
					onclick={() => aplicarRango(rango)}
					aria-pressed={rangoActivo === rango.id}
					class={[
						'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
						rangoActivo === rango.id
							? 'border-light-three bg-light-three text-light-one dark:border-dark-three dark:bg-dark-three dark:text-dark-one'
							: 'border-light-one_d text-light-two hover:bg-light-one_d dark:border-dark-one_d dark:text-dark-two dark:hover:bg-dark-one_d'
					]}
				>
					{rango.label}
				</button>
			{/each}
		</div>

		<div class="mt-4 grid gap-4 sm:grid-cols-2">
			<Input
				id="reporte-fecha-inicio"
				label="Desde"
				type="date"
				max={fechaFin || today}
				bind:value={fechaInicio}
				error={fieldErrors.fecha_inicio}
				aria-invalid={!!fieldErrors.fecha_inicio}
				required
			/>
			<Input
				id="reporte-fecha-fin"
				label="Hasta"
				type="date"
				min={fechaInicio || undefined}
				max={today}
				bind:value={fechaFin}
				error={fieldErrors.fecha_fin}
				aria-invalid={!!fieldErrors.fecha_fin}
				required
			/>
		</div>
	</fieldset>

	<div class="mt-6 rounded-xl bg-light-one_d/50 p-4 dark:bg-dark-one_d/50">
		<p class="text-xs font-medium text-light-two_d uppercase dark:text-dark-two_d">
			El archivo incluye
		</p>
		<ul class="mt-2 space-y-1.5 text-sm text-light-two dark:text-dark-two">
			{#each HOJAS as hoja (hoja.nombre)}
				<li>
					<span class="font-semibold">Hoja “{hoja.nombre}”:</span>
					{hoja.detalle}
				</li>
			{/each}
		</ul>
	</div>

	<Button type="submit" variant="primary" loading={isLoading} class="mt-6 w-full sm:w-auto">
		{#snippet leftIcon()}<DownloadIcon class="size-5" />{/snippet}
		{isLoading ? 'Generando reporte…' : 'Descargar Excel'}
	</Button>
</form>
