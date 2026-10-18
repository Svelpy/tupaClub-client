<script lang="ts">
	import type { Component } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button, Heading } from '#lib/components/ui/index.ts';
	import {
		AlertTriangleIcon,
		CalendarIcon,
		ChevronDownIcon,
		CreditCardIcon,
		MailIcon,
		MapPinIcon,
		PhoneIcon,
		UserIcon,
		UsersIcon
	} from '#lib/icons/outline/index.ts';
	import { authService, errorService } from '#lib/services/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { signUpSchema } from '#lib/zod/auth.schema.ts';
	import { asset, resolve } from '$app/paths';

	type FieldName =
		'nombre' | 'apellidos' | 'ci' | 'telefono' | 'genero' | 'email' | 'birth_date' | 'direccion';

	let form = $state<Record<FieldName, string>>({
		nombre: '',
		apellidos: '',
		ci: '',
		telefono: '',
		genero: '',
		email: '',
		birth_date: '',
		direccion: ''
	});
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const today = new Date().toLocaleDateString('en-CA');

	const generoOptions = [
		{ value: 'M', label: 'Masculino' },
		{ value: 'F', label: 'Femenino' },
		{ value: 'O', label: 'Otro' }
	];

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const result = validateSchema(signUpSchema, form);
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		try {
			await authService.register(result.data);
			alert('success', '¡Cuenta creada! Inicia sesión con tus credenciales.', { duration: 4000 });
			await goto(resolve('/auth/sign-in'), { replaceState: true });
		} catch (error) {
			formError = errorService.getMessage(error);
			isLoading = false;
		}
	}

	function clearFieldError(field: FieldName) {
		if (fieldErrors[field]) delete fieldErrors[field];
	}

	const inputBase =
		'w-full border-t-0 border-r-0 border-b border-l-0 bg-transparent py-3 pl-8 text-light-two placeholder-light-four transition-colors duration-200 outline-none focus:ring-0 focus:outline-0 disabled:opacity-60 dark:text-dark-two dark:placeholder-dark-four dark:[color-scheme:dark]';
	const inputValid =
		'border-light-four_d focus:border-b-light-three dark:focus:border-b-dark-three';
	const inputInvalid = 'border-light-error dark:border-dark-error';
</script>

{#snippet label(id: string, text: string, required: boolean)}
	<label for={id} class="text-sm font-medium text-light-two dark:text-dark-two">
		{text}
		{#if required}
			<span class="text-light-error dark:text-dark-error" aria-hidden="true">*</span>
		{/if}
	</label>
{/snippet}

{#snippet fieldError(name: FieldName)}
	{#if fieldErrors[name]}
		<p id="{name}-error" class="text-xs text-light-error dark:text-dark-error">
			{fieldErrors[name]}
		</p>
	{/if}
{/snippet}

{#snippet textField(
	name: FieldName,
	text: string,
	Icon: Component<{ class?: string }>,
	placeholder: string,
	options: {
		type?: string;
		required?: boolean;
		autocomplete?: HTMLInputElement['autocomplete'];
		inputmode?: 'text' | 'numeric' | 'tel' | 'email';
		class?: string;
		hint?: string;
	} = {}
)}
	<div class={['space-y-1', options.class]}>
		{@render label(name, text, !!options.required)}
		<div class="relative">
			<span class="pointer-events-none absolute top-3 left-0 text-light-four dark:text-dark-four">
				<Icon />
			</span>
			<input
				id={name}
				type={options.type ?? 'text'}
				bind:value={form[name]}
				oninput={() => clearFieldError(name)}
				{placeholder}
				autocomplete={options.autocomplete}
				inputmode={options.inputmode}
				max={options.type === 'date' ? today : undefined}
				aria-required={options.required}
				aria-invalid={!!fieldErrors[name]}
				aria-describedby={[fieldErrors[name] && `${name}-error`, options.hint && `${name}-hint`]
					.filter(Boolean)
					.join(' ') || undefined}
				class={[inputBase, fieldErrors[name] ? inputInvalid : inputValid]}
				disabled={isLoading}
			/>
		</div>
		{@render fieldError(name)}
		{#if options.hint}
			<p
				id="{name}-hint"
				class="flex items-start gap-1.5 rounded-lg bg-light-three/10 px-2.5 py-2 text-xs text-light-three dark:bg-dark-three/10 dark:text-dark-three"
			>
				<AlertTriangleIcon class="mt-px size-4 shrink-0" />
				<span>{options.hint}</span>
			</p>
		{/if}
	</div>
{/snippet}

<MainLayout
	title="Crear cuenta"
	class="container mx-auto flex min-h-dvh items-center justify-center bg-light-one py-8 dark:bg-dark-one"
>
	<section class="flex w-full justify-center px-4">
		<div
			class="relative w-full max-w-2xl self-start rounded-3xl bg-light-one p-6 md:self-auto md:p-8 md:shadow-2xl md:ring-1 md:ring-light-four dark:bg-dark-one md:dark:ring-dark-four"
		>
			<img
				src={asset('images/logo_app.webp')}
				alt="Logo de la aplicación"
				width="96"
				height="96"
				class="mx-auto mb-4 size-20 rounded-2xl object-cover shadow-lg ring-1 ring-light-four md:mb-6 md:size-24 dark:ring-dark-four"
			/>

			<form onsubmit={handleSubmit} novalidate>
				<Heading level="h4" class="text-center text-light-two dark:text-dark-two">
					Crear cuenta
				</Heading>
				{#if formError}
					<div
						role="alert"
						class="mt-6 flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
					>
						<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
						<span>{formError}</span>
					</div>
				{/if}

				<div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
					{@render textField('nombre', 'Nombre', UserIcon, 'Ej. Ana', {
						required: true,
						autocomplete: 'given-name'
					})}
					{@render textField('apellidos', 'Apellidos', UserIcon, 'Ej. Pérez López', {
						autocomplete: 'family-name'
					})}
					{@render textField('ci', 'Cédula de identidad', CreditCardIcon, 'Ej. 12345678', {
						required: true,
						autocomplete: 'off'
					})}
					{@render textField('telefono', 'Teléfono', PhoneIcon, 'Ej. 71234567', {
						type: 'tel',
						required: true,
						autocomplete: 'tel',
						inputmode: 'tel',
						hint: 'Tu número de teléfono será tu contraseña para iniciar sesión.'
					})}

					<div class="space-y-1">
						{@render label('genero', 'Género', true)}
						<div class="relative">
							<span
								class="pointer-events-none absolute top-3 left-0 text-light-four dark:text-dark-four"
							>
								<UsersIcon />
							</span>
							<select
								id="genero"
								bind:value={form.genero}
								onchange={() => clearFieldError('genero')}
								aria-required="true"
								aria-invalid={!!fieldErrors.genero}
								aria-describedby={fieldErrors.genero ? 'genero-error' : undefined}
								class={[
									inputBase,
									'cursor-pointer appearance-none pr-8 dark:bg-dark-one',
									form.genero === '' && 'text-light-four dark:text-dark-four',
									fieldErrors.genero ? inputInvalid : inputValid
								]}
								disabled={isLoading}
							>
								<option value="" disabled>Selecciona tu género</option>
								{#each generoOptions as option (option.value)}
									<option value={option.value} class="text-light-two dark:text-dark-two">
										{option.label}
									</option>
								{/each}
							</select>
							<span
								class="pointer-events-none absolute top-3 right-0 text-light-four dark:text-dark-four"
							>
								<ChevronDownIcon />
							</span>
						</div>
						{@render fieldError('genero')}
					</div>

					{@render textField('birth_date', 'Fecha de nacimiento', CalendarIcon, '', {
						type: 'date'
					})}
					{@render textField('email', 'Correo electrónico', MailIcon, 'Ej. ana@example.com', {
						type: 'email',
						autocomplete: 'email',
						inputmode: 'email'
					})}
					{@render textField('direccion', 'Dirección', MapPinIcon, 'Ej. Avenida Principal 123', {
						autocomplete: 'street-address'
					})}
				</div>

				<Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} class="mt-8">
					Crear cuenta
				</Button>

				<p class="mt-6 text-center text-sm text-light-four_d dark:text-dark-four">
					¿Ya tienes una cuenta?
					<a
						href={resolve('/auth/sign-in')}
						class="font-medium text-light-three transition-colors hover:text-light-three_d dark:text-dark-three dark:hover:text-dark-three_d"
					>
						Inicia sesión
					</a>
				</p>
			</form>
		</div>
	</section>
</MainLayout>
