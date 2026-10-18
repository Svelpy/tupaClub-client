<script lang="ts">
	import { SucursalSelect } from '#lib/components/features/panel/sucursales/index.ts';
	import { Button, Input, Modal, Select } from '#lib/components/ui/index.ts';
	import type { AssignableUserRole } from '#lib/config/index.ts';
	import { ROLE_LABEL, USER_GENERO_LABEL } from '#lib/constants/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type {
		Administrador,
		AdministradorDetail,
		NegocioListItem,
		UpdateAdministradorRequest
	} from '#lib/interfaces/index.ts';
	import { administradorService, errorService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { createAdministradorSchema, updateAdministradorSchema } from '#lib/zod/index.ts';

	interface Props {
		isOpen: boolean;
		/** Si se pasa, el formulario edita ese usuario; si no, crea uno nuevo */
		administrador?: Administrador | null;
		/** Roles que el usuario actual puede asignar (solo inferiores al suyo) */
		assignableRoles: readonly AssignableUserRole[];
		/** Rol preseleccionado al crear (p. ej. el de la pestaña activa) */
		defaultRole?: AssignableUserRole | null;
		/** Negocios con sus sucursales, opciones del campo sucursal */
		negocios: NegocioListItem[];
		isLoadingNegocios?: boolean;
		onClose: () => void;
		onSaved: (administrador: AdministradorDetail) => void;
	}

	let {
		isOpen,
		administrador = null,
		assignableRoles,
		defaultRole = null,
		negocios,
		isLoadingNegocios = false,
		onClose,
		onSaved
	}: Props = $props();

	const FORM_ID = 'administrador-form';
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
	let role = $state('');
	let sucursalId = $state<string | null>(null);
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const isEdit = $derived(!!administrador);

	// Solo los campos que difieren del usuario original (body del PATCH)
	const changes = $derived.by((): UpdateAdministradorRequest => {
		if (!administrador) return {};
		const diff: UpdateAdministradorRequest = {};
		const nextApellidos = apellidos.trim() || null;
		const nextEmail = email.trim() || null;
		const nextBirthDate = birthDate || null;
		const nextDireccion = direccion.trim() || null;
		if (nombre.trim() !== administrador.nombre) diff.nombre = nombre.trim();
		if (nextApellidos !== (administrador.apellidos ?? null)) diff.apellidos = nextApellidos;
		if (ci.trim() !== administrador.ci) diff.ci = ci.trim();
		if (telefono.trim() !== (administrador.telefono ?? '')) diff.telefono = telefono.trim();
		if (genero !== (administrador.genero ?? '')) diff.genero = genero;
		if (nextEmail !== (administrador.email ?? null)) diff.email = nextEmail;
		if (nextBirthDate !== (administrador.birth_date ?? null)) diff.birth_date = nextBirthDate;
		if (nextDireccion !== (administrador.direccion ?? null)) diff.direccion = nextDireccion;
		if (role !== administrador.role) diff.role = role as AssignableUserRole;
		if (sucursalId && sucursalId !== administrador.sucursal_id) diff.sucursal_id = sucursalId;
		return diff;
	});
	const hasChanges = $derived(Object.keys(changes).length > 0);

	function fillForm(source: Administrador | null) {
		nombre = source?.nombre ?? '';
		apellidos = source?.apellidos ?? '';
		ci = source?.ci ?? '';
		telefono = source?.telefono ?? '';
		genero = source?.genero ?? '';
		email = source?.email ?? '';
		birthDate = source?.birth_date ?? '';
		direccion = source?.direccion ?? '';
		role = source?.role ?? defaultRole ?? '';
		sucursalId = source?.sucursal_id ?? null;
		fieldErrors = {};
		formError = '';
	}

	// Cargar los datos cada vez que se abre (vacío al crear, el usuario al editar)
	$effect(() => {
		if (isOpen) fillForm(administrador);
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function save(): Promise<AdministradorDetail | null> {
		const values = {
			nombre,
			apellidos,
			ci,
			telefono,
			genero,
			email,
			birth_date: birthDate,
			direccion,
			role,
			sucursal_id: sucursalId ?? ''
		};

		if (administrador) {
			const result = validateSchema(updateAdministradorSchema, values);
			if (!result.success) {
				fieldErrors = result.errors;
				return null;
			}
			fieldErrors = {};
			return administradorService.update(administrador.id, changes);
		}

		const result = validateSchema(createAdministradorSchema, values);
		if (!result.success) {
			fieldErrors = result.errors;
			return null;
		}
		fieldErrors = {};
		return administradorService.create(result.data);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (isEdit && !hasChanges) return;

		isLoading = true;
		let saved: AdministradorDetail | null = null;
		try {
			saved = await save();
			if (saved) {
				alert(
					'success',
					isEdit
						? `Usuario «${saved.nombre}» actualizado correctamente.`
						: `Usuario «${saved.nombre}» creado correctamente.`
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
	title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[40rem]"
>
	<form id={FORM_ID} onsubmit={handleSubmit} novalidate class="space-y-6">
		{#if formError}
			<div
				role="alert"
				class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span>{formError}</span>
			</div>
		{/if}

		<fieldset class="space-y-3" disabled={isLoading}>
			<legend class="font-semibold text-light-two dark:text-dark-two">Acceso</legend>
			<p class="text-sm text-light-two_d dark:text-dark-two_d">
				El rol define qué puede hacer en el panel; la sucursal, dónde trabaja.
			</p>
			<div class="grid gap-5 sm:grid-cols-2">
				<Select
					id="administrador-role"
					label="Rol"
					bind:value={role}
					error={fieldErrors.role}
					aria-invalid={!!fieldErrors.role}
					required
				>
					<option value="" disabled>Selecciona el rol</option>
					{#each assignableRoles as value (value)}
						<option {value}>{ROLE_LABEL[value]}</option>
					{/each}
				</Select>

				<SucursalSelect
					id="administrador-sucursal"
					label="Sucursal"
					{negocios}
					value={sucursalId}
					placeholder="Selecciona la sucursal"
					isLoading={isLoadingNegocios}
					error={fieldErrors.sucursal_id}
					required
					onChange={(value) => (sucursalId = value)}
				/>
			</div>
		</fieldset>

		<hr class="border-light-one_d dark:border-dark-one_d" />

		<fieldset class="space-y-3" disabled={isLoading}>
			<legend class="font-semibold text-light-two dark:text-dark-two">Datos personales</legend>
			<div class="grid gap-5 sm:grid-cols-2">
				<Input
					id="administrador-nombre"
					label="Nombre"
					placeholder="Ej. Ana"
					bind:value={nombre}
					error={fieldErrors.nombre}
					aria-invalid={!!fieldErrors.nombre}
					autocomplete="off"
					required
				/>

				<Input
					id="administrador-apellidos"
					label="Apellidos (opcional)"
					placeholder="Ej. Pérez López"
					bind:value={apellidos}
					error={fieldErrors.apellidos}
					aria-invalid={!!fieldErrors.apellidos}
					autocomplete="off"
				/>

				<Input
					id="administrador-ci"
					label="Cédula de identidad"
					placeholder="Ej. 12345678"
					bind:value={ci}
					error={fieldErrors.ci}
					aria-invalid={!!fieldErrors.ci}
					autocomplete="off"
					required
				/>

				<Input
					id="administrador-telefono"
					label="Teléfono"
					type="tel"
					inputmode="tel"
					placeholder="Ej. 71234567"
					bind:value={telefono}
					error={fieldErrors.telefono}
					aria-invalid={!!fieldErrors.telefono}
					autocomplete="off"
					required
				/>

				<Select
					id="administrador-genero"
					label="Género"
					bind:value={genero}
					error={fieldErrors.genero}
					aria-invalid={!!fieldErrors.genero}
					required
				>
					<option value="" disabled>Selecciona el género</option>
					{#each GENEROS as [value, label] (value)}
						<option {value}>{label}</option>
					{/each}
				</Select>

				<Input
					id="administrador-birth-date"
					label="Fecha de nacimiento (opcional)"
					type="date"
					max={today}
					bind:value={birthDate}
					error={fieldErrors.birth_date}
					aria-invalid={!!fieldErrors.birth_date}
				/>

				<Input
					id="administrador-email"
					label="Correo electrónico (opcional)"
					type="email"
					inputmode="email"
					placeholder="Ej. ana@example.com"
					bind:value={email}
					error={fieldErrors.email}
					aria-invalid={!!fieldErrors.email}
					autocomplete="off"
				/>

				<Input
					id="administrador-direccion"
					label="Dirección (opcional)"
					placeholder="Ej. Avenida Principal 123"
					bind:value={direccion}
					error={fieldErrors.direccion}
					aria-invalid={!!fieldErrors.direccion}
					autocomplete="off"
				/>
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
				{isEdit ? 'Guardar cambios' : 'Crear usuario'}
			</Button>
		</div>
	{/snippet}
</Modal>
