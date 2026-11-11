<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { Button, Modal, TextArea } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type { Operacion, OperacionListItem } from '#lib/interfaces/index.ts';
	import { errorService, operacionService } from '#lib/services/index.ts';
	import {
		alert,
		formatCurrency,
		formatDateTime,
		formatFullName,
		formatNumber,
		validateSchema
	} from '#lib/utils/index.ts';
	import { anularOperacionSchema, OPERACION_MOTIVO_MAX } from '#lib/zod/index.ts';

	interface Props {
		/** Operación a anular; null = modal cerrado */
		item: OperacionListItem | null;
		onClose: () => void;
		onAnulada: (operacion: Operacion) => void;
	}

	let { item, onClose, onAnulada }: Props = $props();

	let motivo = $state('');
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');
	let isLoading = $state(false);

	// Formulario limpio cada vez que se abre con otra operación
	$effect(() => {
		if (item) {
			motivo = '';
			fieldErrors = {};
			formError = '';
		}
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!item || isLoading) return;
		const target = item;
		formError = '';

		const result = validateSchema(anularOperacionSchema, { motivo });
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		let anulada = false;
		try {
			const operacion = await operacionService.anular(target.operacion.id, result.data);
			alert('success', `Compra de ${formatFullName(target.receptor)} anulada correctamente.`);
			onAnulada(operacion);
			anulada = true;
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (anulada) onClose();
	}
</script>

<Modal
	isOpen={!!item}
	title="Anular operación"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[32rem]"
>
	{#if item}
		<form id="anular-operacion-form" onsubmit={handleSubmit} novalidate class="space-y-4">
			{#if formError}
				<div
					role="alert"
					class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
					<span>{formError}</span>
				</div>
			{/if}

			<p class="text-sm text-light-two dark:text-dark-two">
				Se anulará esta compra y al cliente se le restarán
				<strong>{formatNumber(item.operacion.total_puntos)} pts</strong>. Esta acción no se puede
				deshacer.
			</p>

			<div
				class="flex items-center gap-3 rounded-xl border border-light-one_d p-3 dark:border-dark-one_d"
			>
				<ClienteAvatar cliente={{ ...item.receptor, avatar_url: null }} />
				<div class="min-w-0 flex-1">
					<p class="truncate font-medium text-light-two dark:text-dark-two">
						{formatFullName(item.receptor)}
					</p>
					<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
						{formatDateTime(item.operacion.created_at)}
						{#if item.operacion.referencia}· {item.operacion.referencia}{/if}
					</p>
				</div>
				<div class="shrink-0 text-right">
					<p class="font-semibold text-light-three tabular-nums dark:text-dark-three">
						{formatNumber(item.operacion.total_puntos)} pts
					</p>
					<p class="text-xs text-light-two_d tabular-nums dark:text-dark-two_d">
						{formatCurrency(item.operacion.total_compra)}
					</p>
				</div>
			</div>

			<TextArea
				id="anular-operacion-motivo"
				label="Motivo"
				rows={3}
				maxlength={OPERACION_MOTIVO_MAX}
				placeholder="Ej. Monto mal digitado: 1000 en lugar de 100"
				bind:value={motivo}
				error={fieldErrors.motivo}
				aria-invalid={!!fieldErrors.motivo}
				disabled={isLoading}
				required
			/>
		</form>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			<Button variant="outline" onclick={handleClose} disabled={isLoading} class="w-full sm:w-auto">
				Volver
			</Button>
			<!-- El footer queda fuera del <form>: se asocia con el atributo form -->
			<Button
				type="submit"
				form="anular-operacion-form"
				variant="destructive"
				loading={isLoading}
				class="w-full sm:w-auto"
			>
				Anular operación
			</Button>
		</div>
	{/snippet}
</Modal>
