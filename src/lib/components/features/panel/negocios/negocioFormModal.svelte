<script lang="ts">
	import {
		Button,
		ImageUploader,
		Input,
		Modal,
		Select,
		TextArea
	} from '#lib/components/ui/index.ts';
	import { NEGOCIO_TIPO_LABEL } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, PhoneIcon, TrashIcon } from '#lib/icons/outline/index.ts';
	import type {
		Negocio,
		NegocioDetail,
		NegocioTipo,
		UpdateNegocioRequest
	} from '#lib/interfaces/index.ts';
	import { errorService, negocioService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import {
		NEGOCIO_DESCRIPCION_MAX,
		NEGOCIO_IMAGE_MAX_MB,
		NEGOCIO_IMAGE_TYPES,
		createNegocioSchema,
		negocioImageSchema,
		updateNegocioSchema
	} from '#lib/zod/index.ts';
	import NegocioAvatar from './negocioAvatar.svelte';
	import NegocioTipoBadge from './negocioTipoBadge.svelte';

	interface Props {
		isOpen: boolean;
		/** Si se pasa, el formulario edita ese negocio; si no, crea uno nuevo */
		negocio?: Negocio | null;
		onClose: () => void;
		onSaved: (negocio: NegocioDetail) => void;
	}

	let { isOpen, negocio = null, onClose, onSaved }: Props = $props();

	const FORM_ID = 'negocio-form';
	const DEFAULT_TIPO: NegocioTipo = 'SOCIO';
	const TIPOS = Object.entries(NEGOCIO_TIPO_LABEL) as [NegocioTipo, string][];

	let nombre = $state('');
	let tipo = $state<NegocioTipo>(DEFAULT_TIPO);
	let telefono = $state('');
	let descripcion = $state('');
	/** Imagen nueva: sube o reemplaza la actual al guardar */
	let imageFile = $state<File | null>(null);
	/** Eliminar la imagen actual al guardar (solo al editar) */
	let removeImage = $state(false);
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const isEdit = $derived(!!negocio);
	const currentImageUrl = $derived(removeImage ? null : (negocio?.image_url ?? null));

	// Solo los campos que difieren del negocio original (body del PATCH)
	const changes = $derived.by((): UpdateNegocioRequest => {
		if (!negocio) return {};
		const diff: UpdateNegocioRequest = {};
		const nextTelefono = telefono.trim() || null;
		const nextDescripcion = descripcion.trim() || null;
		if (nombre.trim() !== negocio.nombre) diff.nombre = nombre.trim();
		if (tipo !== negocio.tipo) diff.tipo = tipo;
		if (nextTelefono !== (negocio.telefono ?? null)) diff.telefono = nextTelefono;
		if (nextDescripcion !== (negocio.descripcion ?? null)) diff.descripcion = nextDescripcion;
		return diff;
	});
	const hasDataChanges = $derived(Object.keys(changes).length > 0);
	const hasChanges = $derived(hasDataChanges || !!imageFile || removeImage);

	function fillForm(source: Negocio | null) {
		nombre = source?.nombre ?? '';
		tipo = source?.tipo ?? DEFAULT_TIPO;
		telefono = source?.telefono ?? '';
		descripcion = source?.descripcion ?? '';
		imageFile = null;
		removeImage = false;
		fieldErrors = {};
		formError = '';
	}

	// Cargar los datos cada vez que se abre (vacío al crear, el negocio al editar)
	$effect(() => {
		if (isOpen) fillForm(negocio);
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	function handleTipoChange(event: Event & { currentTarget: HTMLSelectElement }) {
		tipo = event.currentTarget.value as NegocioTipo;
	}

	function validateImage(file: File | null): string {
		if (!file) return '';
		const result = validateSchema(negocioImageSchema, { file });
		return result.success ? '' : (result.errors.file ?? '');
	}

	function handleImageChange(file: File | null) {
		// Elegir una imagen nueva reemplaza a la actual: ya no hace falta eliminarla
		if (file) removeImage = false;
		const rest = { ...fieldErrors };
		delete rest.image;
		const error = validateImage(file);
		fieldErrors = error ? { ...rest, image: error } : rest;
	}

	/** Sube la imagen nueva o elimina la actual. Si falla, el resto ya quedó guardado. */
	async function applyImageChange(target: NegocioDetail): Promise<NegocioDetail> {
		try {
			if (imageFile) return await negocioService.uploadImage(target.id, imageFile);
			if (removeImage) return await negocioService.deleteImage(target.id);
		} catch (error) {
			alert(
				'warning',
				`Los datos se guardaron, pero no se pudo actualizar la imagen: ${errorService.getMessage(error)}`,
				{ duration: 6000 }
			);
		}
		return target;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (isEdit && !hasChanges) return;

		const values = { nombre, tipo, telefono, descripcion };
		const result = validateSchema(isEdit ? updateNegocioSchema : createNegocioSchema, values);
		const imageError = validateImage(imageFile);
		if (!result.success || imageError) {
			fieldErrors = {
				...(result.success ? {} : result.errors),
				...(imageError ? { image: imageError } : {})
			};
			return;
		}
		fieldErrors = {};

		isLoading = true;
		let saved: NegocioDetail | null = null;
		try {
			if (!negocio) {
				saved = await negocioService.create(result.data);
			} else if (hasDataChanges) {
				saved = await negocioService.update(negocio.id, changes);
			}
		} catch (error) {
			formError = errorService.getMessage(error);
			isLoading = false;
			return;
		}

		// La imagen va en otro endpoint; al crear necesita el id del negocio recién creado
		if (saved) {
			saved = await applyImageChange(saved);
		} else if (negocio) {
			// Edición donde solo cambió la imagen
			try {
				saved = imageFile
					? await negocioService.uploadImage(negocio.id, imageFile)
					: await negocioService.deleteImage(negocio.id);
			} catch (error) {
				formError = errorService.getMessage(error);
			}
		}
		isLoading = false;

		if (saved) {
			alert(
				'success',
				isEdit
					? `Negocio «${saved.nombre}» actualizado correctamente.`
					: `Negocio «${saved.nombre}» creado correctamente.`
			);
			onSaved(saved);
			handleClose();
		}
	}
</script>

<Modal
	{isOpen}
	title={isEdit ? 'Editar negocio' : 'Nuevo negocio'}
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

		<!-- Vista previa de cómo se verá en el listado -->
		<div
			class="flex items-center gap-4 rounded-2xl border border-dashed border-light-four bg-light-one_d/50 p-4 dark:border-dark-one_d dark:bg-dark-one_d/40"
			aria-live="polite"
		>
			<NegocioAvatar
				negocio={{ nombre: nombre.trim() || '?', image_url: currentImageUrl }}
				size="lg"
				class="bg-light-one shadow-sm dark:bg-dark-one"
			/>
			<div class="min-w-0 space-y-1">
				<div class="flex flex-wrap items-center gap-2">
					<p class="truncate font-semibold text-light-two dark:text-dark-two">
						{nombre.trim() || 'Nombre del negocio'}
					</p>
					<NegocioTipoBadge {tipo} />
				</div>
				<p class="flex items-center gap-1.5 text-xs text-light-two_d dark:text-dark-four">
					<PhoneIcon class="size-3.5" />
					{telefono.trim() || 'Sin teléfono'}
				</p>
			</div>
		</div>

		<Input
			id="negocio-nombre"
			label="Nombre"
			placeholder="Ej. Café Central"
			bind:value={nombre}
			error={fieldErrors.nombre}
			aria-invalid={!!fieldErrors.nombre}
			disabled={isLoading}
			autocomplete="organization"
			required
		/>

		<div class="grid gap-5 sm:grid-cols-2">
			<Select
				id="negocio-tipo"
				label="Tipo"
				value={tipo}
				onchange={handleTipoChange}
				error={fieldErrors.tipo}
				aria-invalid={!!fieldErrors.tipo}
				disabled={isLoading}
				required
			>
				{#each TIPOS as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</Select>

			<Input
				id="negocio-telefono"
				label="Teléfono (opcional)"
				type="tel"
				inputmode="tel"
				placeholder="Ej. 71234567"
				bind:value={telefono}
				error={fieldErrors.telefono}
				aria-invalid={!!fieldErrors.telefono}
				disabled={isLoading}
				autocomplete="tel"
			/>
		</div>

		<div class="space-y-2">
			<ImageUploader
				id="negocio-imagen"
				label="Imagen (opcional)"
				bind:value={imageFile}
				currentUrl={currentImageUrl}
				accept={NEGOCIO_IMAGE_TYPES.join(',')}
				hint="JPG, PNG o WEBP · máximo {NEGOCIO_IMAGE_MAX_MB} MB"
				error={fieldErrors.image}
				disabled={isLoading}
				onFileChange={handleImageChange}
			/>

			{#if negocio?.image_url && !imageFile}
				{#if removeImage}
					<p
						class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-light-error/10 px-3 py-2 text-sm text-light-error"
					>
						La imagen actual se eliminará al guardar.
						<button
							type="button"
							onclick={() => (removeImage = false)}
							disabled={isLoading}
							class="font-medium underline underline-offset-2"
						>
							Deshacer
						</button>
					</p>
				{:else}
					<button
						type="button"
						onclick={() => (removeImage = true)}
						disabled={isLoading}
						class="inline-flex items-center gap-1.5 text-sm font-medium text-light-error hover:underline disabled:opacity-50"
					>
						<TrashIcon class="size-4" />
						Eliminar imagen actual
					</button>
				{/if}
			{/if}
		</div>

		<div>
			<TextArea
				id="negocio-descripcion"
				label="Descripción (opcional)"
				placeholder="Ej. Cafetería y pastelería artesanal."
				rows={3}
				bind:value={descripcion}
				error={fieldErrors.descripcion}
				aria-invalid={!!fieldErrors.descripcion}
				disabled={isLoading}
			/>
			<p
				class={[
					'mt-1 text-right text-xs',
					descripcion.trim().length > NEGOCIO_DESCRIPCION_MAX
						? 'text-light-error'
						: 'text-light-two_d dark:text-dark-four'
				]}
			>
				{descripcion.trim().length}/{NEGOCIO_DESCRIPCION_MAX}
			</p>
		</div>
	</form>

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			{#if isEdit && !hasChanges}
				<p class="text-center text-xs text-light-two_d sm:mr-auto sm:text-left">
					Modifica algún campo para guardar.
				</p>
			{/if}
			<Button variant="outline" onclick={handleClose} disabled={isLoading} class="w-full sm:w-auto">
				Cancelar
			</Button>
			<Button
				type="submit"
				form={FORM_ID}
				loading={isLoading}
				disabled={isEdit && !hasChanges}
				class="w-full sm:w-auto"
			>
				{isEdit ? 'Guardar cambios' : 'Crear negocio'}
			</Button>
		</div>
	{/snippet}
</Modal>
