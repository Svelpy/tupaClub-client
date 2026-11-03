<script lang="ts">
	import { Button, Heading } from '#lib/components/ui/index.ts';
	import { LegalLinks } from '#lib/components/features/legal/index.ts';
	import {
		AlertTriangleIcon,
		CheckCircleIcon,
		EyeIcon,
		EyeOffIcon,
		LockIcon
	} from '#lib/icons/outline/index.ts';
	import { authService, errorService } from '#lib/services/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { validateSchema } from '#lib/utils/index.ts';
	import { resetPasswordSchema } from '#lib/zod/auth.schema.ts';

	// Token de un solo uso que llega en el enlace enviado por correo (?token=...)
	const token = $derived(page.url.searchParams.get('token')?.trim() ?? '');

	let newPassword = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let isDone = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const result = validateSchema(resetPasswordSchema, {
			new_password: newPassword,
			confirm_password: confirmPassword
		});
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		try {
			await authService.resetPassword(token, result.data.new_password);
			isDone = true;
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}

	const togglePassword = (): void => {
		showPassword = !showPassword;
	};

	const inputClass = (hasError: boolean) => [
		'w-full border-t-0 border-r-0 border-b border-l-0 bg-transparent py-3 pr-12 pl-8 text-light-two placeholder-light-four transition-colors duration-200 outline-none focus:ring-0 focus:outline-0 dark:text-dark-two dark:placeholder-dark-four',
		hasError ? 'border-light-error dark:border-dark-error' : 'border-light-four focus:border-b-light-four_d'
	];
</script>

<MainLayout
	title="Restablecer contraseña"
	class="container mx-auto flex min-h-dvh items-center justify-center bg-light-one dark:bg-dark-one"
>
	<section class="flex w-full justify-center px-4">
		<form
			onsubmit={handleSubmit}
			novalidate
			class="relative w-full max-w-md self-start rounded-3xl bg-light-one p-6 md:self-auto md:p-8 md:shadow-2xl md:ring-1 md:ring-light-four dark:bg-dark-one md:dark:ring-dark-four"
		>
			<img
				src={asset('images/logo_app.webp')}
				alt="Logo de la aplicación"
				width="96"
				height="96"
				class="mx-auto mb-4 size-20 rounded-2xl object-cover shadow-lg ring-1 ring-light-four md:mb-6 md:size-24 dark:ring-dark-four"
			/>
			<Heading level="h4" class="text-center text-light-two dark:text-dark-two"
				>Restablecer contraseña</Heading
			>

			{#if isDone}
				<div
					role="status"
					class="mt-6 flex items-start gap-2.5 rounded-xl border border-light-three bg-light-three/10 p-3 text-sm text-light-two dark:border-dark-three dark:bg-dark-three/10 dark:text-dark-two"
				>
					<CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-light-three dark:text-dark-three" />
					<span>
						Tu contraseña fue restablecida. Por seguridad se cerraron todas tus sesiones; inicia
						sesión con tu nueva contraseña.
					</span>
				</div>
				<Button href={resolve('/auth/sign-in')} variant="primary" size="lg" fullWidth class="mt-8">
					Ir a iniciar sesión
				</Button>
			{:else if !token}
				<div
					role="alert"
					class="mt-6 flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
					<span>El enlace no es válido o está incompleto. Solicita uno nuevo.</span>
				</div>
				<Button
					href={resolve('/auth/forgot-password')}
					variant="primary"
					size="lg"
					fullWidth
					class="mt-8"
				>
					Solicitar nuevo enlace
				</Button>
			{:else}
				{#if formError}
					<div
						role="alert"
						class="mt-6 flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
					>
						<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
						<span>{formError}</span>
					</div>
					<p class="mt-3 text-center text-sm text-light-four_d dark:text-dark-four">
						¿El enlace venció o ya fue usado?
						<a
							href={resolve('/auth/forgot-password')}
							class="font-medium text-light-three transition-colors hover:text-light-three_d dark:text-dark-three dark:hover:text-dark-three_d"
						>
							Solicita uno nuevo
						</a>
					</p>
				{/if}

				<div class="mt-6 space-y-5">
					<div class="space-y-1">
						<label for="new_password" class="text-sm font-medium text-light-two dark:text-dark-two"
							>Nueva contraseña</label
						>
						<div class="relative">
							<span class="absolute top-3 left-0 text-light-four dark:text-dark-four"
								><LockIcon /></span
							>
							<input
								id="new_password"
								type={showPassword ? 'text' : 'password'}
								bind:value={newPassword}
								placeholder="Ingresa tu nueva contraseña"
								autocomplete="new-password"
								aria-invalid={!!fieldErrors.new_password}
								aria-describedby={fieldErrors.new_password ? 'new_password-error' : undefined}
								class={inputClass(!!fieldErrors.new_password)}
								disabled={isLoading}
								required
							/>
							<button
								type="button"
								onclick={togglePassword}
								class="absolute top-3 right-0 text-light-three transition-colors hover:text-light-three_d dark:text-dark-three dark:hover:text-dark-three_d"
								disabled={isLoading}
							>
								{#if showPassword}
									<EyeIcon />
								{:else}
									<EyeOffIcon />
								{/if}
							</button>
						</div>
						{#if fieldErrors.new_password}
							<p id="new_password-error" class="text-xs text-light-error dark:text-dark-error">
								{fieldErrors.new_password}
							</p>
						{/if}
					</div>

					<div class="space-y-1">
						<label
							for="confirm_password"
							class="text-sm font-medium text-light-two dark:text-dark-two"
							>Confirmar contraseña</label
						>
						<div class="relative">
							<span class="absolute top-3 left-0 text-light-four dark:text-dark-four"
								><LockIcon /></span
							>
							<input
								id="confirm_password"
								type={showPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								placeholder="Repite tu nueva contraseña"
								autocomplete="new-password"
								aria-invalid={!!fieldErrors.confirm_password}
								aria-describedby={fieldErrors.confirm_password ? 'confirm_password-error' : undefined}
								class={inputClass(!!fieldErrors.confirm_password)}
								disabled={isLoading}
								required
							/>
						</div>
						{#if fieldErrors.confirm_password}
							<p id="confirm_password-error" class="text-xs text-light-error dark:text-dark-error">
								{fieldErrors.confirm_password}
							</p>
						{/if}
					</div>
				</div>

				<Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} class="mt-8">
					Restablecer contraseña
				</Button>
			{/if}

			<LegalLinks class="mt-6" />
		</form>
	</section>
</MainLayout>
