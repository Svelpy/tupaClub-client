<script lang="ts">
	import { ValeImage } from '#lib/components/features/panel/vales/index.ts';
	import { Button, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type { Canje, CanjeListItem } from '#lib/interfaces/index.ts';
	import { canjeService, errorService } from '#lib/services/index.ts';
	import { alert, formatCurrency, formatDateTime, formatNumber } from '#lib/utils/index.ts';

	interface Props {
		/** Canje a cancelar; null = modal cerrado */
		item: CanjeListItem | null;
		onClose: () => void;
		onCancelled: (canje: Canje) => void;
	}

	let { item, onClose, onCancelled }: Props = $props();

	let isLoading = $state(false);
	let formError = $state('');

	// Sin el error del intento anterior cada vez que se abre
	$effect(() => {
		if (item) formError = '';
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!item || isLoading) return;
		const target = item;

		formError = '';
		isLoading = true;
		let cancelled = false;
		try {
			const canje = await canjeService.cancel(target.canje.id);
			alert('success', `Canje de «${target.vale.nombre}» cancelado correctamente.`);
			onCancelled(canje);
			cancelled = true;
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (cancelled) onClose();
	}
</script>

<!-- Modal propio en vez de ModalConfirm: sus botones "Confirmar"/"Cancelar" se confunden con la acción -->
<Modal
	isOpen={!!item}
	title="Cancelar canje"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[30rem]"
>
	{#if item}
		<div class="space-y-4">
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
				¿Seguro que deseas cancelar este canje? Pasará a <strong>Cancelado</strong> y el cliente ya no
				podrá usar su código. Esta acción no se puede deshacer.
			</p>

			<div
				class="flex items-center gap-3 rounded-xl border border-light-one_d p-3 dark:border-dark-one_d"
			>
				<ValeImage vale={item.vale} />
				<div class="min-w-0 flex-1">
					<p class="truncate font-medium text-light-two dark:text-dark-two">{item.vale.nombre}</p>
					<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
						Solicitado el {formatDateTime(item.canje.created_at)}
					</p>
				</div>
				<div class="shrink-0 text-right">
					<p class="font-semibold text-light-three tabular-nums dark:text-dark-three">
						{formatNumber(item.canje.total_puntos)} pts
					</p>
					<p class="text-xs text-light-two_d tabular-nums dark:text-dark-two_d">
						{formatCurrency(item.canje.total_costo)}
					</p>
				</div>
			</div>
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			<Button variant="outline" onclick={handleClose} disabled={isLoading} class="w-full sm:w-auto">
				Volver
			</Button>
			<Button
				variant="destructive"
				onclick={handleConfirm}
				loading={isLoading}
				class="w-full sm:w-auto"
			>
				Cancelar canje
			</Button>
		</div>
	{/snippet}
</Modal>
