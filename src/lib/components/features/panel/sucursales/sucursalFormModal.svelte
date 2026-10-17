<script lang="ts">
	import { NegocioAvatar } from '#lib/components/features/panel/negocios/index.ts';
	import { Button, Input, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, MapPinIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, SucursalDetail } from '#lib/interfaces/index.ts';
	import { errorService, sucursalService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { createSucursalSchema } from '#lib/zod/index.ts';

	interface Props {
		/** Negocio al que se agrega la sucursal; null = modal cerrado */
		negocio: Negocio | null;
		onClose: () => void;
		onCreated?: (sucursal: SucursalDetail) => void;
	}

	let { negocio, onClose, onCreated }: Props = $props();

	const FORM_ID = 'sucursal-form';

	let nombre = $state('');
	let direccion = $state('');
	let telefono = $state('');
	let urlUbicacion = $state('');
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');
	/** Cuántas sucursales se agregaron en esta sesión del modal */
	let createdCount = $state(0);
	/** Botón que envió el formulario: cerrar o seguir agregando */
	let addAnother = false;

	const mapsUrl = $derived(/^https?:\/\//i.test(urlUbicacion.trim()) ? urlUbicacion.trim() : null);

	function resetForm() {
		nombre = '';
		direccion = '';
		telefono = '';
		urlUbicacion = '';
		fieldErrors = {};
		formError = '';
	}

	// Formulario limpio cada vez que se abre para un negocio
	$effect(() => {
		if (negocio) {
			resetForm();
			createdCount = 0;
		}
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!negocio) return;
		formError = '';

		const result = validateSchema(createSucursalSchema, {
			negocio_id: negocio.id,
			nombre,
			direccion,
			telefono,
			url_ubicacion: urlUbicacion
		});
		if (!result.success) {
			fieldErrors = result.errors;
			formError = result.errors.negocio_id ?? '';
			return;
		}
		fieldErrors = {};

		isLoading = true;
		let created: SucursalDetail | null = null;
		try {
			created = await sucursalService.create(result.data);
			alert('success', `Sucursal «${created.nombre}» agregada a ${negocio.nombre}.`);
			onCreated?.(created);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (!created) return;
		if (addAnother) {
			createdCount += 1;
			resetForm();
			document.getElementById('sucursal-nombre')?.focus();
		} else {
			handleClose();
		}
	}
</script>

<Modal
	isOpen={!!negocio}
	title="Agregar sucursal"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[36rem]"
>
	{#if negocio}
		<form id={FORM_ID} onsubmit={handleSubmit} novalidate class="space-y-5">
			<!-- Contexto: a qué negocio se agrega -->
			<div
				class="flex items-center gap-3 rounded-2xl border border-light-one_d bg-light-one_d/50 p-3 dark:border-dark-one_d dark:bg-dark-one_d/40"
			>
				<NegocioAvatar {negocio} class="bg-light-one dark:bg-dark-one" />
				<div class="min-w-0">
					<p class="text-xs text-light-two_d dark:text-dark-four">Nueva sucursal para</p>
					<p class="truncate font-semibold text-light-two dark:text-dark-two">{negocio.nombre}</p>
				</div>
				{#if createdCount > 0}
					<span
						class="ml-auto shrink-0 rounded-full bg-light-success/10 px-2.5 py-1 text-xs font-medium text-light-success"
					>
						{createdCount}
						{createdCount === 1 ? 'agregada' : 'agregadas'}
					</span>
				{/if}
			</div>

			{#if formError}
				<div
					role="alert"
					class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
					<span>{formError}</span>
				</div>
			{/if}

			<Input
				id="sucursal-nombre"
				label="Nombre de la sucursal"
				placeholder="Ej. Sucursal Equipetrol"
				bind:value={nombre}
				error={fieldErrors.nombre}
				aria-invalid={!!fieldErrors.nombre}
				disabled={isLoading}
				autocomplete="off"
				required
			/>

			<Input
				id="sucursal-direccion"
				label="Dirección"
				placeholder="Ej. Av. San Martín 123"
				bind:value={direccion}
				error={fieldErrors.direccion}
				aria-invalid={!!fieldErrors.direccion}
				disabled={isLoading}
				autocomplete="street-address"
				required
			/>

			<Input
				id="sucursal-telefono"
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

			<div>
				<Input
					id="sucursal-ubicacion"
					label="Ubicación en el mapa (opcional)"
					type="url"
					inputmode="url"
					placeholder="https://maps.google.com/..."
					bind:value={urlUbicacion}
					error={fieldErrors.url_ubicacion}
					aria-invalid={!!fieldErrors.url_ubicacion}
					disabled={isLoading}
				/>
				<div
					class="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-light-two_d dark:text-dark-four"
				>
					<span>En Google Maps: Compartir → Copiar enlace, y pégalo aquí.</span>
					{#if mapsUrl && !fieldErrors.url_ubicacion}
						<a
							href={mapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 font-medium text-light-three hover:underline dark:text-dark-three"
						>
							<MapPinIcon class="size-3.5" />
							Probar enlace
						</a>
					{/if}
				</div>
			</div>
		</form>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button
				type="submit"
				form={FORM_ID}
				variant="secondary"
				disabled={isLoading}
				onclick={() => (addAnother = true)}
				class="w-full sm:w-auto"
			>
				Guardar y agregar otra
			</Button>
			<Button
				type="submit"
				form={FORM_ID}
				loading={isLoading}
				onclick={() => (addAnother = false)}
				class="w-full sm:w-auto"
			>
				Guardar sucursal
			</Button>
		</div>
	{/snippet}
</Modal>
