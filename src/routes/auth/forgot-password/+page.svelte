<script lang="ts">
	import { Button, Heading } from '#lib/components/ui/index.ts';
	import { LegalLinks } from '#lib/components/features/legal/index.ts';
	import {
		AlertTriangleIcon,
		ArrowLeftIcon,
		CheckCircleIcon,
		UserIcon
	} from '#lib/icons/outline/index.ts';
	import { authService, errorService } from '#lib/services/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { asset, resolve } from '$app/paths';
	import { validateSchema } from '#lib/utils/index.ts';
	import { forgotPasswordSchema } from '#lib/zod/auth.schema.ts';

	let ci = $state('');
	let isLoading = $state(false);
	let isSent = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const result = validateSchema(forgotPasswordSchema, { ci });
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		try {
			await authService.forgotPassword(result.data.ci);
			isSent = true;
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<MainLayout
	title="Recuperar contraseña"
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
				>Recuperar contraseña</Heading
			>

			{#if isSent}
				<div
					role="status"
					class="mt-6 flex items-start gap-2.5 rounded-xl border border-light-three bg-light-three/10 p-3 text-sm text-light-two dark:border-dark-three dark:bg-dark-three/10 dark:text-dark-two"
				>
					<CheckCircleIcon class="mt-0.5 size-5 shrink-0 text-light-three dark:text-dark-three" />
					<span>
						Si la cédula corresponde a una cuenta con correo registrado, te enviamos un enlace para
						restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
					</span>
				</div>
			{:else}
				<p class="mt-4 text-center text-sm text-light-four_d dark:text-dark-four">
					Ingresa tu cédula de identidad. Te enviaremos el enlace para restablecer tu contraseña al
					correo electrónico que registraste en Tupa Club.
				</p>

				{#if formError}
					<div
						role="alert"
						class="mt-6 flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
					>
						<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
						<span>{formError}</span>
					</div>
				{/if}

				<div class="mt-6 space-y-1">
					<label for="ci" class="text-sm font-medium text-light-two dark:text-dark-two"
						>Cédula de identidad</label
					>
					<div class="relative">
						<span class="absolute top-3 left-0 text-light-four dark:text-dark-four"
							><UserIcon /></span
						>
						<input
							id="ci"
							type="text"
							bind:value={ci}
							placeholder="Ingresa tu cédula"
							autocomplete="username"
							aria-invalid={!!fieldErrors.ci}
							aria-describedby={fieldErrors.ci ? 'ci-error' : undefined}
							class={[
								'w-full border-t-0 border-r-0 border-b border-l-0 bg-transparent py-3 pl-8 text-light-two placeholder-light-four outline-0 transition-colors duration-200 outline-none focus:ring-0 focus:outline-0 dark:text-dark-two dark:placeholder-dark-four',
								fieldErrors.ci
									? 'border-light-error dark:border-dark-error'
									: 'border-light-four_d focus:border-b-light-three dark:focus:border-b-dark-three'
							]}
							disabled={isLoading}
							required
						/>
					</div>
					{#if fieldErrors.ci}
						<p id="ci-error" class="text-xs text-light-error dark:text-dark-error">
							{fieldErrors.ci}
						</p>
					{/if}
				</div>

				<Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} class="mt-8">
					Enviar enlace
				</Button>
			{/if}

			<p class="mt-6 text-center text-sm text-light-four_d dark:text-dark-four">
				<a
					href={resolve('/auth/sign-in')}
					class="inline-flex items-center gap-1 font-medium text-light-three transition-colors hover:text-light-three_d dark:text-dark-three dark:hover:text-dark-three_d"
				>
					<ArrowLeftIcon class="size-4" />
					Volver a iniciar sesión
				</a>
			</p>

			<LegalLinks class="mt-6" />
		</form>
	</section>
</MainLayout>
