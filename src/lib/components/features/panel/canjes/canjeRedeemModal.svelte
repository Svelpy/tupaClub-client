<script lang="ts">
	import { Button, Modal } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, CircleCheckIcon } from '#lib/icons/outline/index.ts';
	import type { Canje, CanjeConsulta } from '#lib/interfaces/index.ts';
	import { canjeService, errorService } from '#lib/services/index.ts';
	import { formatNumber, getCanjeStatus } from '#lib/utils/index.ts';
	import { CANJE_CODIGO_LENGTH } from '#lib/zod/index.ts';
	import CanjeBuscarCodigo from './canjeBuscarCodigo.svelte';
	import CanjeConsultaCard from './canjeConsultaCard.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onRedeemed: (canje: Canje) => void;
	}

	let { isOpen, onClose, onRedeemed }: Props = $props();

	// 1. Se busca el canje por código  2. Se revisa su estado y titular  3. Se confirma
	let consulta = $state<CanjeConsulta | null>(null);
	let consultadoEn = $state(Date.now());
	let ultimoCodigo = $state('');
	let isLoading = $state(false);
	let formError = $state('');
	// Con valor, el modal muestra el canje recién confirmado
	let redeemed = $state<CanjeConsulta | null>(null);

	const canRedeem = $derived(
		!!consulta && getCanjeStatus(consulta.canje, consultadoEn) === 'PENDIENTE'
	);
	const clienteNombre = $derived(
		redeemed
			? `${redeemed.usuario_cliente.nombre} ${redeemed.usuario_cliente.apellidos ?? ''}`.trim()
			: ''
	);

	function resetForm() {
		consulta = null;
		ultimoCodigo = '';
		formError = '';
		redeemed = null;
	}

	// Siempre empieza en el buscador cada vez que se abre
	$effect(() => {
		if (isOpen) resetForm();
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

	function redeemAnother() {
		resetForm();
	}

	async function handleRedeem() {
		if (!consulta || !canRedeem || isLoading) return;
		formError = '';

		isLoading = true;
		try {
			redeemed = await canjeService.redeem(consulta.canje.id);
			onRedeemed(redeemed.canje);
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<Modal
	{isOpen}
	title="Confirmar canje"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[30rem]"
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
					Entrega <strong class="text-light-two dark:text-dark-two">{redeemed.vale.nombre}</strong>
					a {clienteNombre}.
				</p>
			</div>
			<p
				class="w-full rounded-xl bg-light-one_d px-4 py-2.5 text-sm text-light-two_d dark:bg-dark-one_d dark:text-dark-two_d"
			>
				Se usaron
				<span class="font-semibold text-light-three tabular-nums dark:text-dark-three">
					{formatNumber(redeemed.canje.total_puntos)} pts
				</span>
				del cliente para este vale.
			</p>
		</div>
	{:else if consulta}
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

			{#if canRedeem}
				<p class="text-sm text-light-two_d dark:text-dark-two_d">
					Comprueba que quien presenta el código sea el titular. Al confirmar, el canje queda como
					<strong class="text-light-two dark:text-dark-two">canjeado</strong> y no se puede deshacer.
				</p>
			{/if}
		</div>
	{:else}
		<CanjeBuscarCodigo
			id="canje-redeem"
			description="Pide al cliente el código de {CANJE_CODIGO_LENGTH} dígitos que aparece en su app. Antes de confirmar verás el detalle del canje."
			initialCodigo={ultimoCodigo}
			onFound={handleFound}
		/>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			{#if redeemed}
				<Button variant="outline" onclick={redeemAnother} class="w-full sm:w-auto">
					Confirmar otro canje
				</Button>
				<Button onclick={handleClose} class="w-full sm:w-auto">Listo</Button>
			{:else if consulta}
				<Button
					variant="outline"
					onclick={searchAgain}
					disabled={isLoading}
					class="w-full sm:w-auto"
				>
					Buscar otro código
				</Button>
				{#if canRedeem}
					<Button onclick={handleRedeem} loading={isLoading} class="w-full sm:w-auto">
						Confirmar canje
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
