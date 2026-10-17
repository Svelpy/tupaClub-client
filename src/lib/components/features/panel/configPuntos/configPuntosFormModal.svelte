<script lang="ts">
	import { Button, Input, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, ShoppingCartIcon, TicketIcon } from '#lib/icons/outline/index.ts';
	import type { ConfigPuntosDetail } from '#lib/interfaces/index.ts';
	import { configPuntosService, errorService } from '#lib/services/index.ts';
	import { alert, formatDecimal, validateSchema } from '#lib/utils/index.ts';
	import { createConfigPuntosSchema } from '#lib/zod/index.ts';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onSaved: (config: ConfigPuntosDetail) => void;
	}

	let { isOpen, onClose, onSaved }: Props = $props();

	const FORM_ID = 'config-puntos-form';

	// Los inputs numéricos quedan en null cuando están vacíos
	let asignacionBs = $state<number | null>(null);
	let asignacionPuntos = $state<number | null>(null);
	let costoValeBs = $state<number | null>(null);
	let costoValePuntos = $state<number | null>(null);
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	/** Puntos por cada Bs 1 (mismo cálculo que hace la API); null si aún no es calculable */
	function factor(bs: number | null, puntos: number | null): string | null {
		if (!bs || !puntos || bs <= 0 || puntos <= 0) return null;
		return formatDecimal(puntos / bs);
	}

	const factorAsignacion = $derived(factor(asignacionBs, asignacionPuntos));
	const factorCostoVale = $derived(factor(costoValeBs, costoValePuntos));

	function resetForm() {
		asignacionBs = null;
		asignacionPuntos = null;
		costoValeBs = null;
		costoValePuntos = null;
		fieldErrors = {};
		formError = '';
	}

	// Formulario vacío cada vez que se abre
	$effect(() => {
		if (isOpen) resetForm();
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const result = validateSchema(createConfigPuntosSchema, {
			asignacion_bs: asignacionBs,
			asignacion_puntos: asignacionPuntos,
			costo_vale_bs: costoValeBs,
			costo_vale_puntos: costoValePuntos
		});
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		let saved: ConfigPuntosDetail | null = null;
		try {
			saved = await configPuntosService.create(result.data);
			alert('success', 'Configuración de puntos actualizada correctamente.');
			onSaved(saved);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (saved) handleClose();
	}
</script>

<Modal
	{isOpen}
	title="Nueva configuración de puntos"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[36rem]"
>
	<form id={FORM_ID} onsubmit={handleSubmit} novalidate class="space-y-5">
		{#if formError}
			<div
				role="alert"
				class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span>{formError}</span>
			</div>
		{/if}

		<p
			class="rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
		>
			Esta configuración reemplazará a la activa. La actual se cerrará y quedará en el historial.
		</p>

		<fieldset class="space-y-3" disabled={isLoading}>
			<legend class="flex items-center gap-2 font-semibold text-light-two dark:text-dark-two">
				<ShoppingCartIcon class="size-5" />
				Asignación de puntos
			</legend>
			<p class="text-sm text-light-two_d dark:text-dark-four">
				Puntos que gana el cliente según el monto de su compra.
			</p>
			<div class="grid grid-cols-2 gap-3">
				<Input
					id="config-asignacion-bs"
					type="number"
					label="Monto (Bs)"
					placeholder="Ej. 20"
					min="0"
					step="any"
					inputmode="decimal"
					bind:value={asignacionBs}
					error={fieldErrors.asignacion_bs}
					aria-invalid={!!fieldErrors.asignacion_bs}
					required
				/>
				<Input
					id="config-asignacion-puntos"
					type="number"
					label="Puntos"
					placeholder="Ej. 5"
					min="0"
					step="any"
					inputmode="decimal"
					bind:value={asignacionPuntos}
					error={fieldErrors.asignacion_puntos}
					aria-invalid={!!fieldErrors.asignacion_puntos}
					required
				/>
			</div>
			<p class="text-xs text-light-two_d dark:text-dark-four" aria-live="polite">
				{#if factorAsignacion}
					Por cada Bs {formatDecimal(asignacionBs)} de compra se otorgan {formatDecimal(
						asignacionPuntos
					)} puntos ({factorAsignacion} pts por Bs 1).
				{:else}
					Completa ambos campos para ver la equivalencia.
				{/if}
			</p>
		</fieldset>

		<hr class="border-light-one_d dark:border-dark-one_d" />

		<fieldset class="space-y-3" disabled={isLoading}>
			<legend class="flex items-center gap-2 font-semibold text-light-two dark:text-dark-two">
				<TicketIcon class="size-5" />
				Costo de vale
			</legend>
			<p class="text-sm text-light-two_d dark:text-dark-four">
				Puntos que cuesta canjear un vale según su monto.
			</p>
			<div class="grid grid-cols-2 gap-3">
				<Input
					id="config-costo-vale-bs"
					type="number"
					label="Monto del vale (Bs)"
					placeholder="Ej. 30"
					min="0"
					step="any"
					inputmode="decimal"
					bind:value={costoValeBs}
					error={fieldErrors.costo_vale_bs}
					aria-invalid={!!fieldErrors.costo_vale_bs}
					required
				/>
				<Input
					id="config-costo-vale-puntos"
					type="number"
					label="Puntos"
					placeholder="Ej. 5"
					min="0"
					step="any"
					inputmode="decimal"
					bind:value={costoValePuntos}
					error={fieldErrors.costo_vale_puntos}
					aria-invalid={!!fieldErrors.costo_vale_puntos}
					required
				/>
			</div>
			<p class="text-xs text-light-two_d dark:text-dark-four" aria-live="polite">
				{#if factorCostoVale}
					Un vale de Bs {formatDecimal(costoValeBs)} cuesta {formatDecimal(costoValePuntos)} puntos
					({factorCostoVale} pts por Bs 1).
				{:else}
					Completa ambos campos para ver la equivalencia.
				{/if}
			</p>
		</fieldset>
	</form>

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			<Button variant="outline" onclick={handleClose} disabled={isLoading} class="w-full sm:w-auto">
				Cancelar
			</Button>
			<Button type="submit" form={FORM_ID} loading={isLoading} class="w-full sm:w-auto">
				Guardar configuración
			</Button>
		</div>
	{/snippet}
</Modal>
