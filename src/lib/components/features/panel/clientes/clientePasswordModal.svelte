<script lang="ts">
	import { Button, Input, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { clienteService, errorService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { CLIENTE_PASSWORD_MIN, resetClientePasswordSchema } from '#lib/zod/index.ts';

	interface Props {
		/** Cliente al que se restablece la contraseña; null = modal cerrado */
		cliente: Cliente | null;
		onClose: () => void;
	}

	let { cliente, onClose }: Props = $props();

	const FORM_ID = 'cliente-password-form';

	let newPassword = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');

	const isOpen = $derived(!!cliente);
	const fullName = $derived(cliente ? `${cliente.nombre} ${cliente.apellidos ?? ''}`.trim() : '');

	// Formulario limpio cada vez que se abre
	$effect(() => {
		if (isOpen) {
			newPassword = '';
			confirmPassword = '';
			showPassword = false;
			fieldErrors = {};
			formError = '';
		}
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!cliente) return;
		formError = '';

		const result = validateSchema(resetClientePasswordSchema, {
			new_password: newPassword,
			confirm_password: confirmPassword
		});
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		let saved = false;
		try {
			await clienteService.resetPassword(cliente.id, { new_password: result.data.new_password });
			alert('success', `Contraseña de «${fullName}» restablecida correctamente.`);
			saved = true;
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (saved) handleClose();
	}
</script>

<!-- {#snippet toggleVisibility()}
	<button
		type="button"
		onclick={() => (showPassword = !showPassword)}
		aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
		aria-pressed={showPassword}
		disabled={isLoading}
		class="inline-flex size-9 items-center justify-center rounded-lg text-light-three transition-colors hover:text-light-three_d dark:text-dark-three dark:hover:text-dark-three_d"
	>
		{#if showPassword}
			<EyeIcon class="size-5" />
		{:else}
			<EyeOffIcon class="size-5" />
		{/if}
	</button>
{/snippet} -->

<Modal
	{isOpen}
	title="Restablecer contraseña"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[28rem]"
>
	<form id={FORM_ID} onsubmit={handleSubmit} novalidate class="space-y-5">
		<p class="text-sm text-light-two_d dark:text-dark-four">
			Define una nueva contraseña para <span class="font-medium text-light-two dark:text-dark-two"
				>{fullName}</span
			>. Deberá usarla en su próximo inicio de sesión.
		</p>

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
			id="cliente-new-password"
			label="Nueva contraseña"
			type={showPassword ? 'text' : 'password'}
			placeholder="Mínimo {CLIENTE_PASSWORD_MIN} caracteres"
			bind:value={newPassword}
			error={fieldErrors.new_password}
			aria-invalid={!!fieldErrors.new_password}
			disabled={isLoading}
			autocomplete="new-password"
			required
		/>

		<Input
			id="cliente-confirm-password"
			label="Confirmar contraseña"
			type={showPassword ? 'text' : 'password'}
			placeholder="Repite la contraseña"
			bind:value={confirmPassword}
			error={fieldErrors.confirm_password}
			aria-invalid={!!fieldErrors.confirm_password}
			disabled={isLoading}
			autocomplete="new-password"
			required
		/>
	</form>

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button variant="outline" onclick={handleClose} disabled={isLoading} class="w-full sm:w-auto">
				Cancelar
			</Button>
			<Button type="submit" form={FORM_ID} loading={isLoading} class="w-full sm:w-auto">
				Restablecer
			</Button>
		</div>
	{/snippet}
</Modal>
