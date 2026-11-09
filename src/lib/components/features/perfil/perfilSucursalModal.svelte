<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, Modal } from '#lib/components/ui/index.ts';
	import {
		AlertTriangleIcon,
		BuildindStoreIcon,
		CheckIcon,
		MapPinIcon,
		RefreshIcon
	} from '#lib/icons/outline/index.ts';
	import type { CurrentUser, NegocioListItem } from '#lib/interfaces/index.ts';
	import { errorService, negocioService } from '#lib/services/index.ts';
	import { authStore, currentUserStore } from '#lib/stores/index.ts';
	import { alert } from '#lib/utils/index.ts';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		/** Se llama con la sesión actualizada una vez cambiada la sucursal */
		onChanged?: (session: CurrentUser) => void;
	}

	let { isOpen, onClose, onChanged }: Props = $props();

	const FORM_ID = 'perfil-sucursal-form';

	// Negocio MAIN: solo a sus sucursales puede cambiarse el usuario
	let main = $state<NegocioListItem | null>(null);
	let selectedId = $state<string | null>(null);
	let isLoadingMain = $state(false);
	let isSaving = $state(false);
	let loadError = $state('');
	let formError = $state('');

	const currentSucursalId = $derived($currentUserStore?.user.sucursal_id ?? null);
	const sucursales = $derived(
		[...(main?.sucursales ?? [])].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
	);
	const hasChanged = $derived(!!selectedId && selectedId !== currentSucursalId);

	async function loadMain() {
		loadError = '';
		isLoadingMain = true;
		try {
			main = await negocioService.getMain();
		} catch (error) {
			loadError = errorService.getMessage(error);
		} finally {
			isLoadingMain = false;
		}
	}

	// Cada vez que se abre: se parte de la sucursal actual y se recarga la lista desde el servidor
	$effect(() => {
		if (!isOpen) return;
		// untrack: el cambio de sucursal actualiza el store y no debe reiniciar el modal antes de cerrarse
		untrack(() => {
			selectedId = currentSucursalId;
			formError = '';
			loadMain();
		});
	});

	function handleClose() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isSaving) return;
		onClose();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!selectedId || !hasChanged) return;

		formError = '';
		isSaving = true;
		try {
			const session = await authStore.changeSucursal(selectedId);
			alert('success', `Ahora trabajas en «${session.sucursal?.nombre ?? 'la nueva sucursal'}».`);
			onChanged?.(session);
			onClose();
		} catch (error) {
			formError = errorService.getMessage(error);
		} finally {
			isSaving = false;
		}
	}
</script>

<Modal
	{isOpen}
	title="Cambiar de sucursal"
	onClose={handleClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[32rem]"
>
	<div class="space-y-4">
		<p class="text-sm text-light-two_d dark:text-dark-two_d">
			Elige la sucursal en la que vas a trabajar. Tus operaciones y listados se mostrarán según esa
			sucursal.
		</p>

		{#if formError}
			<div
				role="alert"
				class="flex items-start gap-2.5 rounded-xl border border-light-error bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error dark:bg-dark-error/10 dark:text-dark-error"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
				<span>{formError}</span>
			</div>
		{/if}

		{#if isLoadingMain}
			<ul class="space-y-2" aria-busy="true" aria-label="Cargando sucursales">
				{#each [1, 2, 3] as n (n)}
					<li class="h-17 animate-pulse rounded-xl bg-light-one_d dark:bg-dark-one_d"></li>
				{/each}
			</ul>
		{:else if loadError}
			<div
				role="alert"
				class="flex flex-col items-center gap-3 rounded-xl border border-light-one_d px-4 py-8 text-center dark:border-dark-one_d"
			>
				<AlertTriangleIcon class="size-8 text-light-error dark:text-dark-error" />
				<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
				<Button variant="outline" size="sm" onclick={loadMain}>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			</div>
		{:else if sucursales.length === 0}
			<div
				class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-light-four px-4 py-8 text-center dark:border-dark-four"
			>
				<BuildindStoreIcon class="size-6 text-light-four dark:text-dark-four" />
				<p class="text-sm text-light-two_d dark:text-dark-two_d">
					No hay sucursales disponibles para elegir.
				</p>
			</div>
		{:else}
			<form id={FORM_ID} onsubmit={handleSubmit} novalidate>
				<fieldset disabled={isSaving} class="min-w-0">
					<legend class="sr-only">Sucursales de {main?.negocio.nombre}</legend>
					{#if main}
						<p class="mb-2 text-xs font-medium text-light-two_d dark:text-dark-two_d">
							{main.negocio.nombre}
						</p>
					{/if}
					<div role="radiogroup" class="space-y-2">
						{#each sucursales as sucursal (sucursal.id)}
							{@const isCurrent = sucursal.id === currentSucursalId}
							{@const isSelected = sucursal.id === selectedId}
							<label
								class={[
									'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors focus-within:ring-2 focus-within:ring-light-three dark:focus-within:ring-dark-three',
									isSelected
										? 'border-light-three bg-light-three/10 dark:border-dark-three dark:bg-dark-three/10'
										: 'border-light-one_d bg-light-one hover:bg-light-one_d/50 dark:border-dark-one_d dark:bg-dark-one dark:hover:bg-dark-one_d/50'
								]}
							>
								<input
									type="radio"
									name="sucursal"
									value={sucursal.id}
									checked={isSelected}
									onchange={() => (selectedId = sucursal.id)}
									class="sr-only"
								/>
								<span
									class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
									aria-hidden="true"
								>
									<MapPinIcon class="size-4" />
								</span>
								<span class="min-w-0 flex-1">
									<span class="flex items-center gap-2">
										<span
											class="truncate text-sm font-semibold text-light-two dark:text-dark-two"
										>
											{sucursal.nombre}
										</span>
										{#if isCurrent}
											<span
												class="shrink-0 rounded-full bg-light-three/15 px-2 py-0.5 text-xs font-medium text-light-three dark:bg-dark-three/15 dark:text-dark-three"
											>
												Actual
											</span>
										{/if}
									</span>
									<span
										class="mt-0.5 line-clamp-2 block text-xs text-light-two_d dark:text-dark-two_d"
									>
										{sucursal.direccion}
									</span>
								</span>
								<span
									class={[
										'inline-flex size-6 shrink-0 items-center justify-center rounded-full border',
										isSelected
											? 'border-light-three bg-light-three text-light-one dark:border-dark-three dark:bg-dark-three dark:text-dark-one'
											: 'border-light-four dark:border-dark-four'
									]}
									aria-hidden="true"
								>
									{#if isSelected}<CheckIcon class="size-4" />{/if}
								</span>
							</label>
						{/each}
					</div>
				</fieldset>
			</form>
		{/if}
	</div>

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
			<Button variant="outline" onclick={handleClose} disabled={isSaving} class="w-full sm:w-auto">
				Cancelar
			</Button>
			<Button
				type="submit"
				form={FORM_ID}
				loading={isSaving}
				disabled={!hasChanged || isLoadingMain || !!loadError}
				class="w-full sm:w-auto"
			>
				Cambiar sucursal
			</Button>
		</div>
	{/snippet}
</Modal>
