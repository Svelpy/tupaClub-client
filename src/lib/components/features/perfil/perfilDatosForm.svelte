<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input, Select } from '#lib/components/ui/index.ts';
	import { USER_GENERO_LABEL } from '#lib/constants/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type { UpdatePerfilRequest, User } from '#lib/interfaces/index.ts';
	import { errorService, perfilService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { updatePerfilSchema } from '#lib/zod/index.ts';

	interface Props {
		user: User;
		onSaved: (user: User) => void;
	}

	let { user, onSaved }: Props = $props();

	const FORM_ID = 'perfil-datos-form';
	const GENEROS = Object.entries(USER_GENERO_LABEL);
	const today = new Date().toLocaleDateString('en-CA');

	let nombre = $state('');
	let apellidos = $state('');
	let telefono = $state('');
	let genero = $state('');
	let email = $state('');
	let birthDate = $state('');
	let direccion = $state('');
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	// Solo los campos que difieren del usuario actual (body del PATCH)
	const changes = $derived.by((): UpdatePerfilRequest => {
		const diff: UpdatePerfilRequest = {};
		const nextApellidos = apellidos.trim() || null;
		const nextEmail = email.trim() || null;
		const nextBirthDate = birthDate || null;
		const nextDireccion = direccion.trim() || null;
		if (nombre.trim() !== user.nombre) diff.nombre = nombre.trim();
		if (nextApellidos !== (user.apellidos ?? null)) diff.apellidos = nextApellidos;
		if (telefono.trim() !== (user.telefono ?? '')) diff.telefono = telefono.trim();
		if (genero !== (user.genero ?? '')) diff.genero = genero;
		if (nextEmail !== (user.email ?? null)) diff.email = nextEmail;
		if (nextBirthDate !== (user.birth_date ?? null)) diff.birth_date = nextBirthDate;
		if (nextDireccion !== (user.direccion ?? null)) diff.direccion = nextDireccion;
		return diff;
	});
	const hasChanges = $derived(Object.keys(changes).length > 0);

	function fillForm(source: User) {
		nombre = source.nombre;
		apellidos = source.apellidos ?? '';
		telefono = source.telefono ?? '';
		genero = source.genero ?? '';
		email = source.email ?? '';
		birthDate = source.birth_date ?? '';
		direccion = source.direccion ?? '';
		fieldErrors = {};
		formError = '';
	}

	onMount(() => fillForm(user));

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (!hasChanges) return;

		const result = validateSchema(updatePerfilSchema, {
			nombre,
			apellidos,
			telefono,
			genero,
			email,
			birth_date: birthDate,
			direccion
		});
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		try {
			const saved = await perfilService.update(changes);
			alert('success', 'Tus datos se actualizaron correctamente.');
			onSaved(saved);
			fillForm(saved);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<section
	aria-labelledby="perfil-datos"
	class="rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<h2 id="perfil-datos" class="font-semibold text-light-two dark:text-dark-two">
		Datos personales
	</h2>
	<p class="mt-1 text-sm text-light-two_d dark:text-dark-two_d">
		Mantén tus datos de contacto al día. La cédula de identidad no se puede modificar.
	</p>

	<form id={FORM_ID} onsubmit={handleSubmit} novalidate class="mt-5 space-y-5">
		{#if formError}
			<div
				role="alert"
				class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span>{formError}</span>
			</div>
		{/if}

		<div class="grid gap-5 sm:grid-cols-2">
			<Input
				id="perfil-nombre-input"
				label="Nombre"
				placeholder="Ej. Ana"
				bind:value={nombre}
				error={fieldErrors.nombre}
				aria-invalid={!!fieldErrors.nombre}
				disabled={isLoading}
				autocomplete="given-name"
				required
			/>

			<Input
				id="perfil-apellidos"
				label="Apellidos (opcional)"
				placeholder="Ej. Pérez López"
				bind:value={apellidos}
				error={fieldErrors.apellidos}
				aria-invalid={!!fieldErrors.apellidos}
				disabled={isLoading}
				autocomplete="family-name"
			/>

			<Input
				id="perfil-telefono"
				label="Teléfono"
				type="tel"
				inputmode="tel"
				placeholder="Ej. 71234567"
				bind:value={telefono}
				error={fieldErrors.telefono}
				aria-invalid={!!fieldErrors.telefono}
				disabled={isLoading}
				autocomplete="tel"
				required
			/>

			<Select
				id="perfil-genero"
				label="Género"
				bind:value={genero}
				error={fieldErrors.genero}
				aria-invalid={!!fieldErrors.genero}
				disabled={isLoading}
				required
			>
				<option value="" disabled>Selecciona tu género</option>
				{#each GENEROS as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</Select>

			<Input
				id="perfil-email"
				label="Correo electrónico (opcional)"
				type="email"
				inputmode="email"
				placeholder="Ej. ana@example.com"
				bind:value={email}
				error={fieldErrors.email}
				aria-invalid={!!fieldErrors.email}
				disabled={isLoading}
				autocomplete="email"
			/>

			<Input
				id="perfil-birth-date"
				label="Fecha de nacimiento (opcional)"
				type="date"
				max={today}
				bind:value={birthDate}
				error={fieldErrors.birth_date}
				aria-invalid={!!fieldErrors.birth_date}
				disabled={isLoading}
				autocomplete="bday"
			/>

			<Input
				id="perfil-direccion"
				label="Dirección (opcional)"
				placeholder="Ej. Avenida Principal 123"
				bind:value={direccion}
				error={fieldErrors.direccion}
				aria-invalid={!!fieldErrors.direccion}
				disabled={isLoading}
				autocomplete="street-address"
				class="sm:col-span-2"
			/>
		</div>

		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			{#if hasChanges}
				<Button
					variant="outline"
					onclick={() => fillForm(user)}
					disabled={isLoading}
					class="w-full sm:w-auto"
				>
					Descartar
				</Button>
			{/if}
			<Button
				type="submit"
				form={FORM_ID}
				loading={isLoading}
				disabled={!hasChanges}
				class="w-full sm:w-auto"
			>
				Guardar cambios
			</Button>
		</div>
	</form>
</section>
