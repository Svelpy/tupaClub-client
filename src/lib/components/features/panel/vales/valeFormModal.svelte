<script lang="ts">
	import {
		Button,
		ImageUploader,
		Input,
		Modal,
		Select,
		TextArea
	} from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, SparklesIcon } from '#lib/icons/outline/index.ts';
	import type {
		Categoria,
		Negocio,
		UpdateValeRequest,
		ValeDetail,
		ValeListItem
	} from '#lib/interfaces/index.ts';
	import { errorService, valeService } from '#lib/services/index.ts';
	import { alert, formatNumber, validateSchema } from '#lib/utils/index.ts';
	import {
		createValeSchema,
		updateValeSchema,
		VALE_DESCRIPCION_MAX,
		VALE_IMAGE_MAX_MB,
		valeCostoSchema
	} from '#lib/zod/index.ts';

	interface Props {
		isOpen: boolean;
		/** Si se pasa, el formulario edita ese vale; si no, crea uno nuevo */
		item?: ValeListItem | null;
		categorias: Categoria[];
		negocios: Negocio[];
		isLoadingOptions?: boolean;
		onClose: () => void;
		onSaved: (vale: ValeDetail) => void;
	}

	let {
		isOpen,
		item = null,
		categorias,
		negocios,
		isLoadingOptions = false,
		onClose,
		onSaved
	}: Props = $props();

	const FORM_ID = 'vale-form';
	// Espera tras dejar de escribir el valor antes de pedir la sugerencia de puntos
	const SUGERENCIA_DELAY_MS = 400;

	let nombre = $state('');
	let descripcion = $state('');
	let totalCosto = $state<number | null>(null);
	let totalPuntos = $state<number | null>(null);
	let categoriaId = $state('');
	let negocioId = $state('');
	let imageFile = $state<File | null>(null);
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	// Puntos sugeridos por la API para el valor ingresado (configuración de puntos activa)
	let sugerencia = $state<number | null>(null);
	let isSugiriendo = $state(false);
	let sugerenciaError = $state('');
	// Al crear, la sugerencia se aplica sola hasta que el usuario escribe sus propios puntos
	let puntosEditados = $state(false);
	let sugerenciaRequestId = 0;

	const isEdit = $derived(!!item);

	const byNombre = (a: { nombre: string }, b: { nombre: string }) =>
		a.nombre.localeCompare(b.nombre, 'es');
	const sortedCategorias = $derived([...categorias].sort(byNombre));
	const sortedNegocios = $derived([...negocios].sort(byNombre));

	// Solo los campos que difieren del vale original (body del PATCH)
	const changes = $derived.by((): UpdateValeRequest => {
		if (!item) return {};
		const { vale } = item;
		const diff: UpdateValeRequest = {};
		const nextDescripcion = descripcion.trim() || null;
		if (nombre.trim() !== vale.nombre) diff.nombre = nombre.trim();
		if (nextDescripcion !== (vale.descripcion ?? null)) diff.descripcion = nextDescripcion;
		if (totalCosto !== null && totalCosto !== Number(vale.total_costo)) {
			diff.total_costo = totalCosto.toFixed(2);
		}
		if (totalPuntos !== null && totalPuntos !== vale.total_puntos) diff.total_puntos = totalPuntos;
		if (categoriaId !== vale.categoria_id) diff.categoria_id = categoriaId;
		if (negocioId !== vale.negocio_id) diff.negocio_id = negocioId;
		if (imageFile) diff.image = imageFile;
		return diff;
	});
	const hasChanges = $derived(Object.keys(changes).length > 0);

	function fillForm(source: ValeListItem | null) {
		nombre = source?.vale.nombre ?? '';
		descripcion = source?.vale.descripcion ?? '';
		totalCosto = source ? Number(source.vale.total_costo) : null;
		totalPuntos = source?.vale.total_puntos ?? null;
		categoriaId = source?.vale.categoria_id ?? '';
		negocioId = source?.vale.negocio_id ?? '';
		imageFile = null;
		puntosEditados = false;
		sugerencia = null;
		sugerenciaError = '';
		fieldErrors = {};
		formError = '';
	}

	// Cargar los datos cada vez que se abre (vacío al crear, el vale al editar)
	$effect(() => {
		if (isOpen) fillForm(item);
	});

	// Pide los puntos sugeridos cada vez que cambia el valor (con espera y descartando respuestas viejas)
	$effect(() => {
		const costo = valeCostoSchema.safeParse(totalCosto);
		if (!isOpen || !costo.success) {
			sugerenciaRequestId++;
			sugerencia = null;
			isSugiriendo = false;
			return;
		}

		const requestId = ++sugerenciaRequestId;
		isSugiriendo = true;
		sugerenciaError = '';
		const timer = setTimeout(async () => {
			try {
				const { puntos_sugeridos } = await valeService.sugerirPuntos({
					total_costo: costo.data
				});
				if (requestId !== sugerenciaRequestId) return;
				sugerencia = puntos_sugeridos;
				if (!isEdit && !puntosEditados) totalPuntos = puntos_sugeridos;
			} catch (error) {
				if (requestId !== sugerenciaRequestId) return;
				sugerencia = null;
				sugerenciaError = errorService.getMessage(error);
			} finally {
				if (requestId === sugerenciaRequestId) isSugiriendo = false;
			}
		}, SUGERENCIA_DELAY_MS);

		return () => clearTimeout(timer);
	});

	function useSugerencia() {
		if (sugerencia === null) return;
		totalPuntos = sugerencia;
		puntosEditados = false;
	}

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function save(): Promise<ValeDetail | null> {
		const values = {
			nombre,
			descripcion,
			total_costo: totalCosto,
			total_puntos: totalPuntos,
			categoria_id: categoriaId,
			negocio_id: negocioId,
			image: imageFile
		};

		if (item) {
			const result = validateSchema(updateValeSchema, values);
			if (!result.success) {
				fieldErrors = result.errors;
				return null;
			}
			fieldErrors = {};
			return valeService.update(item.vale.id, changes);
		}

		const result = validateSchema(createValeSchema, values);
		if (!result.success) {
			fieldErrors = result.errors;
			return null;
		}
		fieldErrors = {};
		return valeService.create(result.data);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (isEdit && !hasChanges) return;

		isLoading = true;
		let saved: ValeDetail | null = null;
		try {
			saved = await save();
			if (saved) {
				alert(
					'success',
					isEdit
						? `Vale «${saved.nombre}» actualizado correctamente.`
						: `Vale «${saved.nombre}» creado correctamente.`
				);
				onSaved(saved);
			}
		} catch (error) {
			formError = errorService.getMessage(error);
			fieldErrors = { ...fieldErrors, ...errorService.getFieldErrors(error) };
		} finally {
			isLoading = false;
		}

		if (saved) handleClose();
	}
</script>

<Modal
	{isOpen}
	title={isEdit ? 'Editar vale' : 'Nuevo vale'}
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[40rem]"
>
	<form id={FORM_ID} onsubmit={handleSubmit} novalidate class="space-y-5">
		{#if formError}
			<div
				role="alert"
				class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span>{formError}</span>
			</div>
		{/if}

		<ImageUploader
			id="vale-image"
			label="Imagen (opcional)"
			hint="JPG, PNG o WEBP de hasta {VALE_IMAGE_MAX_MB} MB."
			bind:value={imageFile}
			currentUrl={item?.vale.image_url ?? null}
			error={fieldErrors.image}
			disabled={isLoading}
		/>

		<Input
			id="vale-nombre"
			label="Nombre"
			placeholder="Ej. Vale de consumo Bs 50"
			bind:value={nombre}
			error={fieldErrors.nombre}
			aria-invalid={!!fieldErrors.nombre}
			disabled={isLoading}
			autocomplete="off"
			required
		/>

		<div>
			<TextArea
				id="vale-descripcion"
				label="Descripción (opcional)"
				placeholder="Ej. Canjeable por productos seleccionados."
				rows={3}
				bind:value={descripcion}
				error={fieldErrors.descripcion}
				aria-invalid={!!fieldErrors.descripcion}
				disabled={isLoading}
			/>
			<p
				class={[
					'mt-1 text-right text-xs',
					descripcion.trim().length > VALE_DESCRIPCION_MAX
						? 'text-light-error dark:text-dark-error'
						: 'text-light-two_d dark:text-dark-two_d'
				]}
			>
				{descripcion.trim().length}/{VALE_DESCRIPCION_MAX}
			</p>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			<Select
				id="vale-negocio"
				label="Negocio"
				bind:value={negocioId}
				error={fieldErrors.negocio_id}
				aria-invalid={!!fieldErrors.negocio_id}
				disabled={isLoading || isLoadingOptions}
				required
			>
				<option value="" disabled>{isLoadingOptions ? 'Cargando…' : 'Selecciona el negocio'}</option
				>
				{#each sortedNegocios as negocio (negocio.id)}
					<option value={negocio.id}>{negocio.nombre}</option>
				{/each}
			</Select>

			<Select
				id="vale-categoria"
				label="Categoría"
				bind:value={categoriaId}
				error={fieldErrors.categoria_id}
				aria-invalid={!!fieldErrors.categoria_id}
				disabled={isLoading || isLoadingOptions}
				required
			>
				<option value="" disabled>
					{isLoadingOptions ? 'Cargando…' : 'Selecciona la categoría'}
				</option>
				{#each sortedCategorias as categoria (categoria.id)}
					<option value={categoria.id}>{categoria.nombre}</option>
				{/each}
			</Select>
		</div>

		<fieldset class="space-y-3 rounded-xl border border-light-one_d p-4 dark:border-dark-one_d">
			<legend class="px-1 font-semibold text-light-two dark:text-dark-two">Precio del vale</legend>
			<div class="grid gap-5 sm:grid-cols-2">
				<Input
					id="vale-total-costo"
					type="number"
					label="Valor (Bs)"
					placeholder="Ej. 50.00"
					min="0"
					step="0.01"
					inputmode="decimal"
					bind:value={totalCosto}
					error={fieldErrors.total_costo}
					aria-invalid={!!fieldErrors.total_costo}
					disabled={isLoading}
					required
				/>

				<Input
					id="vale-total-puntos"
					type="number"
					label="Cuesta (puntos)"
					placeholder="Ej. 500"
					min="1"
					step="1"
					inputmode="numeric"
					bind:value={totalPuntos}
					oninput={() => (puntosEditados = true)}
					error={fieldErrors.total_puntos}
					aria-invalid={!!fieldErrors.total_puntos}
					aria-describedby="vale-sugerencia"
					disabled={isLoading}
					required
				/>
			</div>

			<!-- Sugerencia de la API según la configuración de puntos activa -->
			<div
				id="vale-sugerencia"
				aria-live="polite"
				class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-light-two_d dark:text-dark-two_d"
			>
				{#if isSugiriendo}
					<span>Calculando puntos sugeridos…</span>
				{:else if sugerencia !== null}
					<span class="inline-flex items-center gap-1.5">
						<SparklesIcon class="size-4 text-light-three dark:text-dark-three" />
						Sugerido según la configuración de puntos:
						<strong class="text-light-two tabular-nums dark:text-dark-two">
							{formatNumber(sugerencia)} pts
						</strong>
					</span>
					{#if totalPuntos !== sugerencia}
						<button
							type="button"
							onclick={useSugerencia}
							disabled={isLoading}
							class="font-medium text-light-three underline underline-offset-2 hover:no-underline disabled:opacity-50 dark:text-dark-three"
						>
							Usar sugerido
						</button>
					{/if}
				{:else if sugerenciaError}
					<span>No se pudo calcular la sugerencia: {sugerenciaError}</span>
				{:else}
					<span>Ingresa el valor para ver cuántos puntos se sugieren.</span>
				{/if}
			</div>
		</fieldset>
	</form>

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			{#if isEdit && !hasChanges}
				<p
					class="text-center text-xs text-light-two_d sm:mr-auto sm:text-left dark:text-dark-two_d"
				>
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
				{isEdit ? 'Guardar cambios' : 'Crear vale'}
			</Button>
		</div>
	{/snippet}
</Modal>
