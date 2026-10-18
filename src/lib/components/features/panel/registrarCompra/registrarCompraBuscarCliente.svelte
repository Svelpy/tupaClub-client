<script lang="ts">
	import { Button, Input } from '#lib/components/ui/index.ts';
	import { Role } from '#lib/config/index.ts';
	import { SearchIcon, UserIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { clienteService, errorService } from '#lib/services/index.ts';
	import { formatRole, validateSchema } from '#lib/utils/index.ts';
	import { buscarClienteSchema } from '#lib/zod/index.ts';

	interface Props {
		/** CI con la que se abre (p. ej. al volver de "Cambiar cliente") */
		initialCi?: string;
		/** Error externo (p. ej. se intentó registrar sin buscar al cliente) */
		error?: string;
		onFound: (cliente: Cliente) => void;
		/** Pasa a registrar la CI no encontrada como cliente nuevo; sin handler no se ofrece */
		onCreateNew?: (ci: string) => void;
	}

	let { initialCi = '', error = '', onFound, onCreateNew }: Props = $props();

	const INPUT_ID = 'registrar-compra-ci';
	const HINT_ID = 'registrar-compra-ci-hint';

	// svelte-ignore state_referenced_locally
	let ci = $state(initialCi);
	let isSearching = $state(false);
	let searchError = $state('');
	// Última CI buscada que no existe: se ofrece registrarla como cliente nuevo
	let notFoundCi = $state<string | null>(null);

	const visibleError = $derived(searchError || error);

	// Solo dígitos: la API busca por cédula numérica. Al editarla se descarta el resultado anterior
	function setCi(value: string | number | null | undefined) {
		ci = String(value ?? '').replace(/\D/g, '');
		notFoundCi = null;
	}

	async function search() {
		if (isSearching) return;
		notFoundCi = null;
		const result = validateSchema(buscarClienteSchema, { ci });
		if (!result.success) {
			searchError = result.errors.ci;
			return;
		}

		searchError = '';
		isSearching = true;
		try {
			const user = await clienteService.getByCi(result.data.ci);
			// Solo los clientes acumulan puntos; la cédula puede ser de un usuario del panel
			if (user.role !== Role.CLIENTE) {
				searchError = `Esta cédula pertenece a un usuario del panel (${formatRole(user.role)}). Solo los clientes acumulan puntos.`;
				return;
			}
			onFound(user);
		} catch (error) {
			if (errorService.fromUnknown(error).status === 404) notFoundCi = result.data.ci;
			else searchError = errorService.getMessage(error);
		} finally {
			isSearching = false;
		}
	}

	// Enter busca al cliente en vez de enviar el formulario de la compra
	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		search();
	}
</script>

<!-- Label y mensajes propios: el botón va al lado del input y los mensajes debajo de ambos -->
<div class="space-y-2">
	<label
		for={INPUT_ID}
		class="block text-sm font-medium text-light-two sm:text-base dark:text-dark-two"
	>
		Cédula de identidad del cliente
	</label>
	<div class="flex gap-2">
		<Input
			id={INPUT_ID}
			placeholder="Ej. 12345678"
			inputmode="numeric"
			autocomplete="off"
			bind:value={() => ci, setCi}
			onkeydown={handleKeydown}
			aria-invalid={!!visibleError}
			aria-describedby={HINT_ID}
			disabled={isSearching}
			class="min-w-0 flex-1 [&_label]:hidden"
		/>
		<Button onclick={search} loading={isSearching} class="shrink-0">
			{#snippet leftIcon()}<SearchIcon class="size-5" />{/snippet}
			Buscar
		</Button>
	</div>

	{#if notFoundCi}
		<div
			id={HINT_ID}
			role="status"
			class="flex flex-col gap-3 rounded-xl border border-light-warning/30 bg-light-warning/15 p-4 text-sm sm:flex-row sm:items-center dark:border-dark-warning/30 dark:bg-dark-warning/15"
		>
			<p class="flex-1 text-light-two dark:text-dark-two">
				No hay ningún cliente con la CI <strong>{notFoundCi}</strong>.
				{onCreateNew ? '¿Es su primera compra?' : 'Pide a un administrador que lo registre.'}
			</p>
			{#if onCreateNew}
				<Button size="sm" onclick={() => onCreateNew(notFoundCi!)} class="shrink-0">
					{#snippet leftIcon()}<UserIcon class="size-4" />{/snippet}
					Registrar como cliente nuevo
				</Button>
			{/if}
		</div>
	{:else}
		<p
			id={HINT_ID}
			role={visibleError ? 'alert' : undefined}
			class={[
				'text-sm',
				visibleError
					? 'text-light-error dark:text-dark-error'
					: 'text-light-two_d dark:text-dark-two_d'
			]}
		>
			{visibleError || 'Escribe la cédula y pulsa Buscar (o Enter).'}
		</p>
	{/if}
</div>
