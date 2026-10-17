<script lang="ts">
	import { Button, Input, Modal, Select } from '#lib/components/ui/index.ts';
	import { USER_GENERO_LABEL } from '#lib/constants/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente, ClienteDetail, UpdateClienteRequest } from '#lib/interfaces/index.ts';
	import { clienteService, errorService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { createClienteSchema, updateClienteSchema } from '#lib/zod/index.ts';

	interface Props {
		isOpen: boolean;
		/** Si se pasa, el formulario edita ese cliente; si no, crea uno nuevo */
		cliente?: Cliente | null;
		onClose: () => void;
		onSaved: (cliente: ClienteDetail) => void;
	}

	let { isOpen, cliente = null, onClose, onSaved }: Props = $props();

	const FORM_ID = 'cliente-form';
	const GENEROS = Object.entries(USER_GENERO_LABEL);
	const today = new Date().toLocaleDateString('en-CA');

	let nombre = $state('');
	let apellidos = $state('');
	let ci = $state('');
	let telefono = $state('');
	let genero = $state('');
	let email = $state('');
	let birthDate = $state('');
	let direccion = $state('');
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const isEdit = $derived(!!cliente);

	// Solo los campos que difieren del cliente original (body del PATCH)
	const changes = $derived.by((): UpdateClienteRequest => {
		if (!cliente) return {};
		const diff: UpdateClienteRequest = {};
		const nextApellidos = apellidos.trim() || null;
		const nextEmail = email.trim() || null;
		const nextBirthDate = birthDate || null;
		const nextDireccion = direccion.trim() || null;
		if (nombre.trim() !== cliente.nombre) diff.nombre = nombre.trim();
		if (nextApellidos !== (cliente.apellidos ?? null)) diff.apellidos = nextApellidos;
		if (ci.trim() !== cliente.ci) diff.ci = ci.trim();
		if (telefono.trim() !== (cliente.telefono ?? '')) diff.telefono = telefono.trim();
		if (genero !== (cliente.genero ?? '')) diff.genero = genero;
		if (nextEmail !== (cliente.email ?? null)) diff.email = nextEmail;
		if (nextBirthDate !== (cliente.birth_date ?? null)) diff.birth_date = nextBirthDate;
		if (nextDireccion !== (cliente.direccion ?? null)) diff.direccion = nextDireccion;
		return diff;
	});
	const hasChanges = $derived(Object.keys(changes).length > 0);

	function fillForm(source: Cliente | null) {
		nombre = source?.nombre ?? '';
		apellidos = source?.apellidos ?? '';
		ci = source?.ci ?? '';
		telefono = source?.telefono ?? '';
		genero = source?.genero ?? '';
		email = source?.email ?? '';
		birthDate = source?.birth_date ?? '';
		direccion = source?.direccion ?? '';
		fieldErrors = {};
		formError = '';
	}

	// Cargar los datos cada vez que se abre (vacío al crear, el cliente al editar)
	$effect(() => {
		if (isOpen) fillForm(cliente);
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function save(): Promise<ClienteDetail | null> {
		const values = {
			nombre,
			apellidos,
			ci,
			telefono,
			genero,
			email,
			birth_date: birthDate,
			direccion
		};

		if (cliente) {
			const result = validateSchema(updateClienteSchema, values);
			if (!result.success) {
				fieldErrors = result.errors;
				return null;
			}
			fieldErrors = {};
			return clienteService.update(cliente.id, changes);
		}

		const result = validateSchema(createClienteSchema, values);
		if (!result.success) {
			fieldErrors = result.errors;
			return null;
		}
		fieldErrors = {};
		return clienteService.create(result.data);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (isEdit && !hasChanges) return;

		isLoading = true;
		let saved: ClienteDetail | null = null;
		try {
			saved = await save();
			if (saved) {
				alert(
					'success',
					isEdit
						? `Cliente «${saved.nombre}» actualizado correctamente.`
						: `Cliente «${saved.nombre}» creado correctamente.`
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
	title={isEdit ? 'Editar cliente' : 'Nuevo cliente'}
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[40rem]"
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

		<div class="grid gap-5 sm:grid-cols-2">
			<Input
				id="cliente-nombre"
				label="Nombre"
				placeholder="Ej. Ana"
				bind:value={nombre}
				error={fieldErrors.nombre}
				aria-invalid={!!fieldErrors.nombre}
				disabled={isLoading}
				autocomplete="off"
				required
			/>

			<Input
				id="cliente-apellidos"
				label="Apellidos (opcional)"
				placeholder="Ej. Pérez López"
				bind:value={apellidos}
				error={fieldErrors.apellidos}
				aria-invalid={!!fieldErrors.apellidos}
				disabled={isLoading}
				autocomplete="off"
			/>

			<Input
				id="cliente-ci"
				label="Cédula de identidad"
				placeholder="Ej. 12345678"
				bind:value={ci}
				error={fieldErrors.ci}
				aria-invalid={!!fieldErrors.ci}
				disabled={isLoading}
				autocomplete="off"
				required
			/>

			<Input
				id="cliente-telefono"
				label="Teléfono"
				type="tel"
				inputmode="tel"
				placeholder="Ej. 71234567"
				bind:value={telefono}
				error={fieldErrors.telefono}
				aria-invalid={!!fieldErrors.telefono}
				disabled={isLoading}
				autocomplete="off"
				required
			/>

			<Select
				id="cliente-genero"
				label="Género"
				bind:value={genero}
				error={fieldErrors.genero}
				aria-invalid={!!fieldErrors.genero}
				disabled={isLoading}
				required
			>
				<option value="" disabled>Selecciona el género</option>
				{#each GENEROS as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</Select>

			<Input
				id="cliente-birth-date"
				label="Fecha de nacimiento (opcional)"
				type="date"
				max={today}
				bind:value={birthDate}
				error={fieldErrors.birth_date}
				aria-invalid={!!fieldErrors.birth_date}
				disabled={isLoading}
			/>

			<Input
				id="cliente-email"
				label="Correo electrónico (opcional)"
				type="email"
				inputmode="email"
				placeholder="Ej. ana@example.com"
				bind:value={email}
				error={fieldErrors.email}
				aria-invalid={!!fieldErrors.email}
				disabled={isLoading}
				autocomplete="off"
			/>

			<Input
				id="cliente-direccion"
				label="Dirección (opcional)"
				placeholder="Ej. Avenida Principal 123"
				bind:value={direccion}
				error={fieldErrors.direccion}
				aria-invalid={!!fieldErrors.direccion}
				disabled={isLoading}
				autocomplete="off"
			/>
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
				{isEdit ? 'Guardar cambios' : 'Crear cliente'}
			</Button>
		</div>
	{/snippet}
</Modal>
