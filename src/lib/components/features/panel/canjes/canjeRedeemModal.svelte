<script lang="ts">
	import { tick } from 'svelte';
	import { Button, Input, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, CircleCheckIcon } from '#lib/icons/outline/index.ts';
	import type { CanjeDetail } from '#lib/interfaces/index.ts';
	import { canjeService, errorService } from '#lib/services/index.ts';
	import { formatCurrency, formatNumber, formatValue, validateSchema } from '#lib/utils/index.ts';
	import { CANJE_CODIGO_LENGTH, redeemCanjeSchema } from '#lib/zod/index.ts';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onRedeemed: (canje: CanjeDetail) => void;
	}

	let { isOpen, onClose, onRedeemed }: Props = $props();

	const FORM_ID = 'canje-redeem-form';
	const INPUT_ID = 'canje-codigo';

	let codigo = $state('');
	let isLoading = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let formError = $state('');
	// Con valor, el modal muestra el resumen del canje recién confirmado
	let redeemed = $state<CanjeDetail | null>(null);

	// Solo dígitos y hasta la longitud del código (también al pegar "0012 3456")
	function setCodigo(value: string | number | null | undefined) {
		codigo = String(value ?? '')
			.replace(/\D/g, '')
			.slice(0, CANJE_CODIGO_LENGTH);
	}

	async function focusCodigo() {
		await tick();
		document.getElementById(INPUT_ID)?.focus();
	}

	function resetForm() {
		codigo = '';
		fieldErrors = {};
		formError = '';
		redeemed = null;
	}

	// Formulario vacío y con el foco en el código cada vez que se abre
	$effect(() => {
		if (!isOpen) return;
		resetForm();
		focusCodigo();
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	function redeemAnother() {
		resetForm();
		focusCodigo();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (isLoading) return;
		formError = '';

		const result = validateSchema(redeemCanjeSchema, { codigo_canje: codigo });
		if (!result.success) {
			fieldErrors = result.errors;
			return;
		}
		fieldErrors = {};

		isLoading = true;
		try {
			redeemed = await canjeService.redeem(result.data);
			onRedeemed(redeemed);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (!redeemed) focusCodigo();
	}
</script>

<Modal
	{isOpen}
	title="Confirmar canje"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[28rem]"
>
	{#if redeemed}
		<div role="status" class="flex flex-col items-center gap-4 text-center">
			<span
				class="flex size-16 items-center justify-center rounded-full bg-light-success/10 text-light-success dark:bg-dark-success/10 dark:text-dark-success"
			>
				<CircleCheckIcon class="size-9" />
			</span>
			<div>
				<p class="text-lg font-semibold text-light-two dark:text-dark-two">Canje confirmado</p>
				<p class="text-sm text-light-two_d dark:text-dark-two_d">
					Ya puedes entregar el vale al cliente.
				</p>
			</div>

			<dl
				class="w-full divide-y divide-light-one_d rounded-xl border border-light-one_d text-left text-sm dark:divide-dark-one_d dark:border-dark-one_d"
			>
				<div class="flex justify-between gap-3 px-4 py-2.5">
					<dt class="text-light-two_d dark:text-dark-two_d">Código</dt>
					<dd class="font-mono tracking-wider text-light-two tabular-nums dark:text-dark-two">
						{redeemed.codigo_canje}
					</dd>
				</div>
				<div class="flex justify-between gap-3 px-4 py-2.5">
					<dt class="text-light-two_d dark:text-dark-two_d">Puntos canjeados</dt>
					<dd class="font-semibold text-light-three tabular-nums dark:text-dark-three">
						{formatNumber(redeemed.total_puntos)} pts
					</dd>
				</div>
				<div class="flex justify-between gap-3 px-4 py-2.5">
					<dt class="text-light-two_d dark:text-dark-two_d">Valor del vale</dt>
					<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
						{formatCurrency(redeemed.total_costo)}
					</dd>
				</div>
				<div class="flex justify-between gap-3 px-4 py-2.5">
					<dt class="text-light-two_d dark:text-dark-two_d">Referencia</dt>
					<dd class="text-right text-light-two dark:text-dark-two">
						{formatValue(redeemed.referencia)}
					</dd>
				</div>
			</dl>
		</div>
	{:else}
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

			<p class="text-sm text-light-two_d dark:text-dark-two_d">
				Pide al cliente el código de {CANJE_CODIGO_LENGTH} dígitos que aparece en su app. Al confirmarlo
				el canje queda como canjeado y no se puede deshacer.
			</p>

			<div>
				<Input
					id={INPUT_ID}
					label="Código de canje"
					placeholder={'0'.repeat(CANJE_CODIGO_LENGTH)}
					size="xl"
					inputmode="numeric"
					autocomplete="off"
					spellcheck={false}
					bind:value={() => codigo, setCodigo}
					error={fieldErrors.codigo_canje}
					aria-invalid={!!fieldErrors.codigo_canje}
					aria-describedby="canje-codigo-count"
					disabled={isLoading}
					required
					class="[&_input]:text-center [&_input]:font-mono [&_input]:tracking-[0.4em] [&_input]:tabular-nums"
				/>
				<p
					id="canje-codigo-count"
					class="mt-1 text-right text-xs text-light-two_d tabular-nums dark:text-dark-two_d"
				>
					{codigo.length}/{CANJE_CODIGO_LENGTH} dígitos
				</p>
			</div>
		</form>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			{#if redeemed}
				<Button variant="outline" onclick={redeemAnother} class="w-full sm:w-auto">
					Confirmar otro canje
				</Button>
				<Button onclick={handleClose} class="w-full sm:w-auto">Listo</Button>
			{:else}
				<Button
					variant="outline"
					onclick={handleClose}
					disabled={isLoading}
					class="w-full sm:w-auto"
				>
					Cancelar
				</Button>
				<Button type="submit" form={FORM_ID} loading={isLoading} class="w-full sm:w-auto">
					Confirmar canje
				</Button>
			{/if}
		</div>
	{/snippet}
</Modal>
