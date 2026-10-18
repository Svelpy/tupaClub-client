<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Button, Input } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, SearchIcon } from '#lib/icons/outline/index.ts';
	import type { CanjeConsulta } from '#lib/interfaces/index.ts';
	import { canjeService, errorService } from '#lib/services/index.ts';
	import { validateSchema } from '#lib/utils/index.ts';
	import { CANJE_CODIGO_LENGTH, codigoCanjeSchema } from '#lib/zod/index.ts';

	interface Props {
		/** Prefijo de los ids: cada modal que lo usa tiene los suyos */
		id: string;
		/** Para qué se pide el código (p. ej. confirmar o cancelar) */
		description: string;
		/** Código con el que se abre (p. ej. al volver de "Buscar otro código") */
		initialCodigo?: string;
		onFound: (consulta: CanjeConsulta) => void;
	}

	let { id, description, initialCodigo = '', onFound }: Props = $props();

	const inputId = $derived(`${id}-codigo`);
	const countId = $derived(`${id}-codigo-count`);

	// svelte-ignore state_referenced_locally
	let codigo = $state(initialCodigo);
	let isSearching = $state(false);
	let fieldError = $state('');
	let searchError = $state('');

	// Solo dígitos y hasta la longitud del código (también al pegar "0012 3456")
	function setCodigo(value: string | number | null | undefined) {
		codigo = String(value ?? '')
			.replace(/\D/g, '')
			.slice(0, CANJE_CODIGO_LENGTH);
		searchError = '';
	}

	async function focusCodigo() {
		await tick();
		const input = document.getElementById(inputId) as HTMLInputElement | null;
		input?.focus();
		input?.select();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (isSearching) return;
		searchError = '';

		const result = validateSchema(codigoCanjeSchema, { codigo_canje: codigo });
		if (!result.success) {
			fieldError = result.errors.codigo_canje;
			focusCodigo();
			return;
		}
		fieldError = '';

		isSearching = true;
		let found = false;
		try {
			onFound(await canjeService.getByCodigo(result.data.codigo_canje));
			found = true;
		} catch (error) {
			searchError =
				errorService.fromUnknown(error).status === 404
					? `No existe ningún canje con el código ${result.data.codigo_canje}. Revisa que esté bien escrito.`
					: errorService.getMessage(error);
		} finally {
			isSearching = false;
		}

		if (!found) focusCodigo();
	}

	onMount(() => {
		focusCodigo();
	});
</script>

<form onsubmit={handleSubmit} novalidate class="space-y-5">
	<p class="text-sm text-light-two_d dark:text-dark-two_d">{description}</p>

	<div>
		<Input
			id={inputId}
			label="Código de canje"
			placeholder={'0'.repeat(CANJE_CODIGO_LENGTH)}
			size="xl"
			inputmode="numeric"
			autocomplete="off"
			spellcheck={false}
			bind:value={() => codigo, setCodigo}
			error={fieldError}
			aria-invalid={!!fieldError || !!searchError}
			aria-describedby={countId}
			disabled={isSearching}
			required
			class="[&_input]:text-center [&_input]:font-mono [&_input]:tracking-[0.4em] [&_input]:tabular-nums"
		/>
		<p
			id={countId}
			class="mt-1 text-right text-xs text-light-two_d tabular-nums dark:text-dark-two_d"
		>
			{codigo.length}/{CANJE_CODIGO_LENGTH} dígitos
		</p>
	</div>

	{#if searchError}
		<div
			role="alert"
			class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
		>
			<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
			<span>{searchError}</span>
		</div>
	{/if}

	<Button type="submit" loading={isSearching} fullWidth>
		{#snippet leftIcon()}<SearchIcon class="size-5" />{/snippet}
		Buscar canje
	</Button>
</form>
