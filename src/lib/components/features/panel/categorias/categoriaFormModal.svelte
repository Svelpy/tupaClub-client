<script module lang="ts">
	import categoriesEmojis from '#lib/data/categoriesEmojis.json';

	const EMOJI_NAMES = new Map(categoriesEmojis.map((emoji) => [emoji.icon_number, emoji.name]));
</script>

<script lang="ts">
	import { Button, Input, Modal, TextArea } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, TagIcon } from '#lib/icons/outline/index.ts';
	import type {
		Categoria,
		CategoriaDetail,
		UpdateCategoriaRequest
	} from '#lib/interfaces/index.ts';
	import { categoriaService, errorService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import {
		CATEGORIA_DESCRIPCION_MAX,
		createCategoriaSchema,
		updateCategoriaSchema
	} from '#lib/zod/index.ts';
	import CategoriaIcon from './categoriaIcon.svelte';
	import CategoriaIconPicker from './categoriaIconPicker.svelte';

	interface Props {
		isOpen: boolean;
		/** Si se pasa, el formulario edita esa categoría; si no, crea una nueva */
		categoria?: Categoria | null;
		onClose: () => void;
		onSaved: (categoria: CategoriaDetail) => void;
	}

	let { isOpen, categoria = null, onClose, onSaved }: Props = $props();

	const FORM_ID = 'categoria-form';

	let nombre = $state('');
	let iconNumber = $state(0);
	let descripcion = $state('');
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const isEdit = $derived(!!categoria);
	const selectedIconName = $derived(EMOJI_NAMES.get(iconNumber));

	// Solo los campos que difieren de la categoría original (body del PATCH)
	const changes = $derived.by((): UpdateCategoriaRequest => {
		if (!categoria) return {};
		const diff: UpdateCategoriaRequest = {};
		const nextDescripcion = descripcion.trim() || null;
		if (nombre.trim() !== categoria.nombre) diff.nombre = nombre.trim();
		if (iconNumber !== categoria.icon_number) diff.icon_number = iconNumber;
		if (nextDescripcion !== (categoria.descripcion ?? null)) diff.descripcion = nextDescripcion;
		return diff;
	});
	const hasChanges = $derived(Object.keys(changes).length > 0);

	function fillForm(source: Categoria | null) {
		nombre = source?.nombre ?? '';
		iconNumber = source?.icon_number ?? 0;
		descripcion = source?.descripcion ?? '';
		fieldErrors = {};
		formError = '';
	}

	// Cargar los datos cada vez que se abre (vacío al crear, la categoría al editar)
	$effect(() => {
		if (isOpen) fillForm(categoria);
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function save(): Promise<CategoriaDetail | null> {
		const values = { nombre, icon_number: iconNumber, descripcion };

		if (categoria) {
			const result = validateSchema(updateCategoriaSchema, values);
			if (!result.success) {
				fieldErrors = result.errors;
				return null;
			}
			fieldErrors = {};
			return categoriaService.update(categoria.id, changes);
		}

		const result = validateSchema(createCategoriaSchema, values);
		if (!result.success) {
			fieldErrors = result.errors;
			return null;
		}
		fieldErrors = {};
		return categoriaService.create(result.data);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (isEdit && !hasChanges) return;

		isLoading = true;
		let saved: CategoriaDetail | null = null;
		try {
			saved = await save();
			if (saved) {
				alert(
					'success',
					isEdit
						? `Categoría «${saved.nombre}» actualizada correctamente.`
						: `Categoría «${saved.nombre}» creada correctamente.`
				);
				onSaved(saved);
			}
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
	title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
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

		<!-- Vista previa del icono seleccionado -->
		<div
			class="flex items-center gap-4 rounded-2xl border border-dashed border-light-four bg-light-one_d/50 p-4 dark:border-dark-one_d dark:bg-dark-one_d/40"
			aria-live="polite"
		>
			{#if iconNumber}
				<CategoriaIcon {iconNumber} size="lg" class="bg-light-one shadow-sm dark:bg-dark-one" />
			{:else}
				<span
					class="flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-light-four text-light-four dark:border-dark-four dark:text-dark-four"
				>
					<TagIcon class="size-6" />
				</span>
			{/if}
			<div class="min-w-0">
				<p class="truncate font-semibold text-light-two dark:text-dark-two">
					{nombre.trim() || 'Nombre de la categoría'}
				</p>
				<p class="truncate text-xs text-light-two_d dark:text-dark-four">
					{selectedIconName ? `Icono: ${selectedIconName}` : 'Sin icono seleccionado'}
				</p>
			</div>
		</div>

		<Input
			id="categoria-nombre"
			label="Nombre"
			placeholder="Ej. Gastronomía"
			bind:value={nombre}
			error={fieldErrors.nombre}
			aria-invalid={!!fieldErrors.nombre}
			disabled={isLoading}
			autocomplete="off"
			required
		/>

		<CategoriaIconPicker
			id="categoria-icono"
			bind:value={iconNumber}
			error={fieldErrors.icon_number}
			disabled={isLoading}
		/>

		<div>
			<TextArea
				id="categoria-descripcion"
				label="Descripción (opcional)"
				placeholder="Ej. Vales para restaurantes y cafeterías."
				rows={3}
				bind:value={descripcion}
				error={fieldErrors.descripcion}
				aria-invalid={!!fieldErrors.descripcion}
				disabled={isLoading}
			/>
			<p
				class={[
					'mt-1 text-right text-xs',
					descripcion.trim().length > CATEGORIA_DESCRIPCION_MAX
						? 'text-light-error'
						: 'text-light-two_d dark:text-dark-four'
				]}
			>
				{descripcion.trim().length}/{CATEGORIA_DESCRIPCION_MAX}
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
				{isEdit ? 'Guardar cambios' : 'Crear categoría'}
			</Button>
		</div>
	{/snippet}
</Modal>
