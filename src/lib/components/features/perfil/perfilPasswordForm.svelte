<script lang="ts">
	import { Button, Input } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import { errorService, perfilService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { PERFIL_PASSWORD_MIN, changePerfilPasswordSchema } from '#lib/zod/index.ts';

	const FORM_ID = 'perfil-password-form';

	type PasswordField = 'current' | 'new' | 'confirm';

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let visible = $state<Record<PasswordField, boolean>>({
		current: false,
		new: false,
		confirm: false
	});
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const isEmpty = $derived(!currentPassword && !newPassword && !confirmPassword);

	function resetForm() {
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		visible = { current: false, new: false, confirm: false };
		fieldErrors = {};
		formError = '';
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const result = validateSchema(changePerfilPasswordSchema, {
			current_password: currentPassword,
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
			await perfilService.changePassword({
				current_password: result.data.current_password,
				new_password: result.data.new_password
			});
			alert('success', 'Contraseña actualizada correctamente.');
			resetForm();
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- {#snippet visibilityToggle(field: PasswordField)}
	<button
		type="button"
		onclick={() => (visible[field] = !visible[field])}
		aria-label={visible[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
		aria-pressed={visible[field]}
		disabled={isLoading}
		class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:text-light-two disabled:opacity-50 dark:text-dark-two_d dark:hover:text-dark-two"
	>
		{#if visible[field]}
			<EyeIcon class="size-5" />
		{:else}
			<EyeOffIcon class="size-5" />
		{/if}
	</button>
{/snippet} -->

<section
	aria-labelledby="perfil-password"
	class="rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<h2 id="perfil-password" class="font-semibold text-light-two dark:text-dark-two">
		Cambiar contraseña
	</h2>
	<p class="mt-1 text-sm text-light-two_d dark:text-dark-two_d">
		Por seguridad, confirma tu contraseña actual antes de definir una nueva.
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

		<Input
			id="perfil-current-password"
			label="Contraseña actual"
			type={visible.current ? 'text' : 'password'}
			bind:value={currentPassword}
			error={fieldErrors.current_password}
			aria-invalid={!!fieldErrors.current_password}
			disabled={isLoading}
			autocomplete="current-password"
			required
			class="sm:max-w-[calc(50%-0.625rem)]"
		></Input>

		<div class="grid gap-5 sm:grid-cols-2">
			<Input
				id="perfil-new-password"
				label="Nueva contraseña"
				type={visible.new ? 'text' : 'password'}
				placeholder="Mínimo {PERFIL_PASSWORD_MIN} caracteres"
				bind:value={newPassword}
				error={fieldErrors.new_password}
				aria-invalid={!!fieldErrors.new_password}
				disabled={isLoading}
				autocomplete="new-password"
				required
			></Input>

			<Input
				id="perfil-confirm-password"
				label="Confirmar nueva contraseña"
				type={visible.confirm ? 'text' : 'password'}
				placeholder="Repite la nueva contraseña"
				bind:value={confirmPassword}
				error={fieldErrors.confirm_password}
				aria-invalid={!!fieldErrors.confirm_password}
				disabled={isLoading}
				autocomplete="new-password"
				required
			></Input>
		</div>

		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			{#if !isEmpty}
				<Button variant="outline" onclick={resetForm} disabled={isLoading} class="w-full sm:w-auto">
					Cancelar
				</Button>
			{/if}
			<Button
				type="submit"
				form={FORM_ID}
				loading={isLoading}
				disabled={isEmpty}
				class="w-full sm:w-auto"
			>
				Actualizar contraseña
			</Button>
		</div>
	</form>
</section>
