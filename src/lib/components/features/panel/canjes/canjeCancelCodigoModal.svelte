<script lang="ts">
	import { Button, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon } from '#lib/icons/outline/index.ts';
	import type { Canje, CanjeConsulta } from '#lib/interfaces/index.ts';
	import { canjeService, errorService } from '#lib/services/index.ts';
	import { alert, getCanjeStatus } from '#lib/utils/index.ts';
	import CanjeBuscarCodigo from './canjeBuscarCodigo.svelte';
	import CanjeConsultaCard from './canjeConsultaCard.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onCancelled: (canje: Canje) => void;
	}

	let { isOpen, onClose, onCancelled }: Props = $props();

	// 1. Se busca el canje por código  2. Se revisa su estado y titular  3. Se cancela
	let consulta = $state<CanjeConsulta | null>(null);
	let consultadoEn = $state(Date.now());
	let ultimoCodigo = $state('');
	let isLoading = $state(false);
	let formError = $state('');

	const canCancel = $derived(
		!!consulta && getCanjeStatus(consulta.canje, consultadoEn) === 'PENDIENTE'
	);

	// Siempre empieza en el buscador cada vez que se abre
	$effect(() => {
		if (!isOpen) return;
		consulta = null;
		ultimoCodigo = '';
		formError = '';
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	function handleFound(found: CanjeConsulta) {
		consulta = found;
		consultadoEn = Date.now();
		ultimoCodigo = found.canje.codigo_canje;
		formError = '';
	}

	// Vuelve al buscador con el último código para corregirlo
	function searchAgain() {
		consulta = null;
		formError = '';
	}

	async function handleCancel() {
		if (!consulta || !canCancel || isLoading) return;
		const target = consulta;

		formError = '';
		isLoading = true;
		let cancelled = false;
		try {
			const canje = await canjeService.cancel(target.canje.id);
			alert('success', `Canje de «${target.vale.nombre}» cancelado correctamente.`);
			onCancelled(canje);
			cancelled = true;
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}

		if (cancelled) onClose();
	}
</script>

<!-- Botones propios: "Volver"/"Cancelar canje" evitan confundir cerrar el modal con la acción -->
<Modal
	{isOpen}
	title="Cancelar canje"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[30rem]"
>
	{#if consulta}
		<div class="space-y-4">
			{#if formError}
				<div
					role="alert"
					class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
					<span>{formError}</span>
				</div>
			{/if}

			<CanjeConsultaCard {consulta} now={consultadoEn} />

			{#if canCancel}
				<p class="text-sm text-light-two dark:text-dark-two">
					¿Seguro que deseas cancelar este canje? Pasará a <strong>Cancelado</strong> y el cliente ya
					no podrá usar su código. Esta acción no se puede deshacer.
				</p>
			{/if}
		</div>
	{:else}
		<CanjeBuscarCodigo
			id="canje-cancel"
			description="Ingresa el código del canje que quieres cancelar. Antes de cancelarlo verás su detalle para comprobar que es el correcto."
			initialCodigo={ultimoCodigo}
			onFound={handleFound}
		/>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			{#if consulta}
				<Button
					variant="outline"
					onclick={searchAgain}
					disabled={isLoading}
					class="w-full sm:w-auto"
				>
					Buscar otro código
				</Button>
				{#if canCancel}
					<Button
						variant="destructive"
						onclick={handleCancel}
						loading={isLoading}
						class="w-full sm:w-auto"
					>
						Cancelar canje
					</Button>
				{:else}
					<Button onclick={handleClose} class="w-full sm:w-auto">Cerrar</Button>
				{/if}
			{:else}
				<Button variant="outline" onclick={handleClose} class="w-full sm:w-auto">Cerrar</Button>
			{/if}
		</div>
	{/snippet}
</Modal>
