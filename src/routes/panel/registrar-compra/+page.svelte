<script lang="ts">
	import { onMount } from 'svelte';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Input, PageHeader } from '#lib/components/ui/index.ts';
	import {
		emptyNuevoCliente,
		RegistrarCompraBuscarCliente,
		RegistrarCompraClienteCard,
		RegistrarCompraExito,
		RegistrarCompraModoCliente,
		RegistrarCompraNuevoCliente,
		RegistrarCompraResumen,
		type ModoCliente,
		type NuevoClienteValues
	} from '#lib/components/features/panel/registrarCompra/index.ts';
	import { Action, Module } from '#lib/config/index.ts';
	import { AlertTriangleIcon, CheckIcon } from '#lib/icons/outline/index.ts';
	import type {
		Cliente,
		ConfigPuntosDetail,
		OperacionReceptor,
		OperacionDetail
	} from '#lib/interfaces/index.ts';
	import { configPuntosService, errorService, operacionService } from '#lib/services/index.ts';
	import { currentRole } from '#lib/stores/index.ts';
	import { alert, can, formatDecimal, validateSchema } from '#lib/utils/index.ts';
	import {
		createClienteSchema,
		createCompraSchema,
		OPERACION_REFERENCIA_MAX
	} from '#lib/zod/index.ts';

	const canRegister = $derived(can($currentRole, Module.OPERACION, Action.CREATE));
	// Registrar un cliente nuevo junto con la compra requiere poder crear usuarios
	const canCreateCliente = $derived(can($currentRole, Module.USUARIO, Action.CREATE));

	const FORM_ID = 'registrar-compra-form';

	// Cada modo conserva lo ingresado al cambiar entre "Ya es cliente" y "Cliente nuevo"
	let modo = $state<ModoCliente>('EXISTENTE');
	let clienteEncontrado = $state<Cliente | null>(null);
	// Última CI buscada, para reabrir el buscador con ella al cambiar de cliente
	let ultimaCi = $state('');
	let nuevoCliente = $state<NuevoClienteValues>(emptyNuevoCliente());
	let totalCompra = $state<number | null>(null);
	let referencia = $state('');
	let isSubmitting = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let clienteError = $state('');
	let formError = $state('');

	let config = $state<ConfigPuntosDetail | null>(null);
	let isLoadingConfig = $state(true);
	let configError = $state('');

	// Con valor, la página muestra el resultado en vez del formulario
	let registrado = $state<{
		operacion: OperacionDetail;
		clienteNombre: string;
		saldoAnterior: number | null;
		isNuevoCliente: boolean;
	} | null>(null);

	const isNuevo = $derived(modo === 'NUEVO' && canCreateCliente);
	const clienteNombre = $derived.by(() => {
		if (isNuevo) return `${nuevoCliente.nombre} ${nuevoCliente.apellidos}`.trim() || null;
		if (clienteEncontrado) {
			return `${clienteEncontrado.nombre} ${clienteEncontrado.apellidos ?? ''}`.trim();
		}
		return null;
	});
	// Un cliente nuevo empieza con 0 puntos
	const saldoActual = $derived(isNuevo ? 0 : (clienteEncontrado?.puntos ?? null));
	const isClienteListo = $derived(
		isNuevo ? !!(nuevoCliente.ci.trim() && nuevoCliente.nombre.trim()) : clienteEncontrado !== null
	);

	async function loadConfig() {
		configError = '';
		isLoadingConfig = true;
		try {
			config = await configPuntosService.getActive();
		} catch (error) {
			config = null;
			// 404 = no hay configuración activa: el resumen lo explica sin mostrar el error crudo
			if (errorService.fromUnknown(error).status !== 404) {
				configError = errorService.getMessage(error);
			}
		} finally {
			isLoadingConfig = false;
		}
	}

	function changeModo(next: ModoCliente) {
		modo = next;
		clienteError = '';
		fieldErrors = {};
	}

	function selectCliente(cliente: Cliente) {
		clienteEncontrado = cliente;
		ultimaCi = cliente.ci;
		clienteError = '';
	}

	// Desde "no encontrado": pasa a cliente nuevo con la CI ya cargada
	function createFromCi(ci: string) {
		nuevoCliente.ci = ci;
		changeModo('NUEVO');
	}

	function changeCliente() {
		clienteEncontrado = null;
	}

	/** Datos del receptor para el body, o null si falta o no es válido (deja los errores) */
	function buildReceptor(errors: Record<string, string>): OperacionReceptor | null {
		if (!isNuevo) {
			if (clienteEncontrado) return { receptor_id: clienteEncontrado.id, receptor_data: null };
			clienteError = 'Busca al cliente por su cédula para continuar.';
			return null;
		}

		const result = validateSchema(createClienteSchema, nuevoCliente);
		if (!result.success) {
			Object.assign(errors, result.errors);
			return null;
		}
		return { receptor_id: null, receptor_data: result.data };
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!config || isSubmitting) return;
		formError = '';
		clienteError = '';

		const errors: Record<string, string> = {};
		const compra = validateSchema(createCompraSchema(config.asignacion_bolivianos), {
			total_compra: totalCompra,
			referencia
		});
		if (!compra.success) Object.assign(errors, compra.errors);
		const receptorData = buildReceptor(errors);

		fieldErrors = errors;
		if (!compra.success || !receptorData) return;

		const nombre = clienteNombre ?? '';
		const saldoAnterior = saldoActual;
		const isNuevoCliente = isNuevo;

		isSubmitting = true;
		try {
			const operacion = await operacionService.create({ ...compra.data, ...receptorData });
			alert('success', `Compra registrada: ${nombre} recibió ${operacion.total_puntos} puntos.`);
			registrado = { operacion, clienteNombre: nombre, saldoAnterior, isNuevoCliente };
		} catch (error) {
			formError = errorService.getMessage(error);
			// Errores por campo de la API (p. ej. total_compra, o los datos del cliente nuevo)
			fieldErrors = { ...fieldErrors, ...errorService.getFieldErrors(error) };
		} finally {
			isSubmitting = false;
		}
	}

	function reset() {
		registrado = null;
		modo = 'EXISTENTE';
		clienteEncontrado = null;
		ultimaCi = '';
		nuevoCliente = emptyNuevoCliente();
		totalCompra = null;
		referencia = '';
		fieldErrors = {};
		clienteError = '';
		formError = '';
	}

	onMount(() => {
		loadConfig();
	});
</script>

{#snippet stepHeader(step: number, title: string, description: string, done: boolean)}
	<div class="flex items-start gap-3">
		<span
			class={[
				'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
				done
					? 'bg-light-success/10 text-light-success dark:bg-dark-success/10 dark:text-dark-success'
					: 'bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three'
			]}
			aria-hidden="true"
		>
			{#if done}<CheckIcon class="size-4" />{:else}{step}{/if}
		</span>
		<div>
			<h2 class="font-semibold text-light-two dark:text-dark-two">{title}</h2>
			<p class="text-sm text-light-two_d dark:text-dark-two_d">{description}</p>
		</div>
	</div>
{/snippet}

<MainLayout title="Registrar compra" noIndex class="container mx-auto">
	<PageHeader title="Registrar compra" />

	{#if !canRegister}
		<p
			role="alert"
			class="mt-6 rounded-2xl border border-light-one_d p-6 text-center text-sm text-light-two_d dark:border-dark-one_d dark:text-dark-two_d"
		>
			No tienes permiso para registrar compras.
		</p>
	{:else if registrado}
		<RegistrarCompraExito
			operacion={registrado.operacion}
			clienteNombre={registrado.clienteNombre}
			saldoAnterior={registrado.saldoAnterior}
			isNuevoCliente={registrado.isNuevoCliente}
			onReset={reset}
		/>
	{:else}
		<form
			id={FORM_ID}
			onsubmit={handleSubmit}
			novalidate
			class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
		>
			<div class="space-y-6">
				{#if formError}
					<div
						role="alert"
						class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
					>
						<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
						<span>{formError}</span>
					</div>
				{/if}

				<!-- Paso 1: cliente -->
				<section
					class="space-y-5 rounded-2xl border border-light-one_d bg-light-one p-5 dark:border-dark-one_d dark:bg-dark-one"
				>
					{@render stepHeader(
						1,
						'Cliente',
						canCreateCliente
							? '¿Quién recibe los puntos? Elige si ya es cliente o si lo registras ahora.'
							: '¿Quién recibe los puntos? Búscalo por su cédula de identidad.',
						isClienteListo
					)}

					<!-- Sin permiso para crear clientes solo se puede buscar uno existente -->
					{#if canCreateCliente}
						<RegistrarCompraModoCliente
							value={modo}
							disabled={isSubmitting}
							onChange={changeModo}
						/>
					{/if}

					{#if isNuevo}
						<RegistrarCompraNuevoCliente
							bind:values={nuevoCliente}
							{fieldErrors}
							disabled={isSubmitting}
						/>
					{:else if clienteEncontrado}
						<RegistrarCompraClienteCard
							cliente={clienteEncontrado}
							disabled={isSubmitting}
							onChange={changeCliente}
						/>
					{:else}
						<RegistrarCompraBuscarCliente
							initialCi={ultimaCi}
							error={clienteError}
							onFound={selectCliente}
							onCreateNew={canCreateCliente ? createFromCi : undefined}
						/>
					{/if}
				</section>

				<!-- Paso 2: compra -->
				<section
					class="space-y-5 rounded-2xl border border-light-one_d bg-light-one p-5 dark:border-dark-one_d dark:bg-dark-one"
				>
					{@render stepHeader(
						2,
						'Compra',
						config
							? `Monto total pagado por el cliente. Mínimo Bs ${formatDecimal(config.asignacion_bolivianos)} para acumular puntos.`
							: 'Monto total pagado por el cliente.',
						!!totalCompra && totalCompra > 0
					)}

					<fieldset class="grid gap-5 sm:grid-cols-2" disabled={isSubmitting}>
						<legend class="sr-only">Datos de la compra</legend>
						<Input
							id="registrar-compra-total"
							type="number"
							label="Monto de la compra (Bs)"
							placeholder="Ej. 150.00"
							min={config?.asignacion_bolivianos ?? 0}
							step="0.01"
							inputmode="decimal"
							bind:value={totalCompra}
							error={fieldErrors.total_compra}
							aria-invalid={!!fieldErrors.total_compra}
							required
						/>

						<div>
							<Input
								id="registrar-compra-referencia"
								label="Referencia (opcional)"
								placeholder="Ej. Factura 000123"
								bind:value={referencia}
								error={fieldErrors.referencia}
								aria-invalid={!!fieldErrors.referencia}
								autocomplete="off"
							/>
							<p
								class={[
									'mt-1 text-right text-xs',
									referencia.trim().length > OPERACION_REFERENCIA_MAX
										? 'text-light-error dark:text-dark-error'
										: 'text-light-two_d dark:text-dark-two_d'
								]}
							>
								{referencia.trim().length}/{OPERACION_REFERENCIA_MAX}
							</p>
						</div>
					</fieldset>
				</section>
			</div>

			<!-- Resumen: en escritorio queda fijo a la derecha mientras se completa el formulario -->
			<aside class="lg:sticky lg:top-6">
				<RegistrarCompraResumen
					{config}
					{isLoadingConfig}
					{configError}
					onRetryConfig={loadConfig}
					{totalCompra}
					{clienteNombre}
					{saldoActual}
					formId={FORM_ID}
					{isSubmitting}
				/>
			</aside>
		</form>
	{/if}
</MainLayout>
