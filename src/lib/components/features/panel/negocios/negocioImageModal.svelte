<script lang="ts">
	import { Button, ImageUploader, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, TrashIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, NegocioDetail } from '#lib/interfaces/index.ts';
	import { errorService, negocioService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { NEGOCIO_IMAGE_MAX_MB, NEGOCIO_IMAGE_TYPES, negocioImageSchema } from '#lib/zod/index.ts';

	interface Props {
		/** Negocio cuya imagen se gestiona; null = modal cerrado */
		negocio: Negocio | null;
		onClose: () => void;
		onUpdated: (negocio: NegocioDetail) => void;
	}

	let { negocio, onClose, onUpdated }: Props = $props();

	let file = $state<File | null>(null);
	let fileError = $state('');
	let formError = $state('');
	let isUploading = $state(false);
	let isRemoving = $state(false);
	let confirmRemove = $state(false);

	const isBusy = $derived(isUploading || isRemoving);

	// Estado limpio al abrir el modal para otro negocio
	$effect(() => {
		if (negocio) {
			file = null;
			fileError = '';
			formError = '';
			confirmRemove = false;
		}
	});

	function handleClose() {
		if (isBusy) return;
		onClose();
	}

	function handleFileChange(selected: File | null) {
		formError = '';
		confirmRemove = false;
		if (!selected) {
			fileError = '';
			return;
		}
		const result = validateSchema(negocioImageSchema, { file: selected });
		fileError = result.success ? '' : (result.errors.file ?? '');
	}

	async function handleUpload() {
		if (!negocio) return;
		formError = '';

		const result = validateSchema(negocioImageSchema, { file });
		if (!result.success) {
			fileError = result.errors.file ?? '';
			return;
		}

		isUploading = true;
		let updated: NegocioDetail | null = null;
		try {
			updated = await negocioService.uploadImage(negocio.id, result.data.file);
			alert('success', 'Imagen guardada correctamente.');
			onUpdated(updated);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isUploading = false;
		}

		if (updated) handleClose();
	}

	async function handleRemove() {
		if (!negocio) return;
		formError = '';

		isRemoving = true;
		let updated: NegocioDetail | null = null;
		try {
			updated = await negocioService.deleteImage(negocio.id);
			alert('success', 'Imagen eliminada correctamente.');
			onUpdated(updated);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isRemoving = false;
			confirmRemove = false;
		}

		if (updated) handleClose();
	}
</script>

<Modal
	isOpen={!!negocio}
	title="Imagen del negocio"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[34rem]"
>
	{#if negocio}
		<div class="space-y-4">
			<p class="text-sm text-light-two_d dark:text-dark-four">
				Logo o imagen que identifica a <strong class="text-light-two dark:text-dark-two"
					>{negocio.nombre}</strong
				>.
			</p>

			{#if formError}
				<div
					role="alert"
					class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
					<span>{formError}</span>
				</div>
			{/if}

			<ImageUploader
				id="negocio-imagen"
				bind:value={file}
				currentUrl={negocio.image_url}
				accept={NEGOCIO_IMAGE_TYPES.join(',')}
				hint="JPG, PNG o WEBP · máximo {NEGOCIO_IMAGE_MAX_MB} MB"
				error={fileError}
				disabled={isBusy}
				onFileChange={handleFileChange}
			/>

			{#if negocio.image_url && !file}
				{#if confirmRemove}
					<div
						class="flex flex-col gap-3 rounded-xl border border-light-error/40 bg-light-error/5 p-3 sm:flex-row sm:items-center"
					>
						<p class="flex-1 text-sm text-light-two dark:text-dark-two">
							¿Eliminar la imagen actual? El negocio se mostrará con sus iniciales.
						</p>
						<div class="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onclick={() => (confirmRemove = false)}
								disabled={isRemoving}
								class="flex-1 sm:flex-none"
							>
								No
							</Button>
							<Button
								variant="danger"
								size="sm"
								onclick={handleRemove}
								loading={isRemoving}
								class="flex-1 sm:flex-none"
							>
								Sí, eliminar
							</Button>
						</div>
					</div>
				{:else}
					<button
						type="button"
						onclick={() => (confirmRemove = true)}
						disabled={isBusy}
						class="inline-flex items-center gap-1.5 text-sm font-medium text-light-error hover:underline disabled:opacity-50"
					>
						<TrashIcon class="size-4" />
						Eliminar imagen actual
					</button>
				{/if}
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button variant="outline" onclick={handleClose} disabled={isBusy} class="w-full sm:w-auto">
				Cancelar
			</Button>
			<Button
				onclick={handleUpload}
				loading={isUploading}
				disabled={!file || !!fileError || isRemoving}
				class="w-full sm:w-auto"
			>
				Guardar imagen
			</Button>
		</div>
	{/snippet}
</Modal>
