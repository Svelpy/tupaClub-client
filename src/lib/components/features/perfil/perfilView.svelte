<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { PerfilSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, RefreshIcon } from '#lib/icons/outline/index.ts';
	import type { CurrentUser, User } from '#lib/interfaces/index.ts';
	import { errorService, perfilService } from '#lib/services/index.ts';
	import { authStore, currentRole, currentUserStore } from '#lib/stores/index.ts';
	import { canChangeSucursal } from '#lib/utils/index.ts';
	import PerfilDatosForm from './perfilDatosForm.svelte';
	import PerfilPasswordForm from './perfilPasswordForm.svelte';
	import PerfilResumenCard from './perfilResumenCard.svelte';
	import PerfilSucursalCard from './perfilSucursalCard.svelte';
	import PerfilSucursalModal from './perfilSucursalModal.svelte';

	interface Props {
		/** Saldo de puntos en el resumen (área de clientes) */
		showPuntos?: boolean;
		/** Negocio y sucursal del usuario (panel; a los clientes les llegan en null) */
		showSucursal?: boolean;
	}

	let { showPuntos = false, showSucursal = false }: Props = $props();

	let perfil = $state<CurrentUser | null>(null);
	let isLoading = $state(false);
	let loadError = $state('');
	let isSucursalModalOpen = $state(false);

	async function loadPerfil() {
		loadError = '';
		isLoading = true;
		try {
			const response = await perfilService.get();
			perfil = response;
			// La sesión (cabecera, saldo) se alinea con lo que devuelve el servidor
			authStore.setUser(response);
		} catch (error) {
			loadError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}

	// Editar datos o la foto devuelve solo el usuario: se conservan el negocio y la sucursal
	function handleUserUpdated(user: User) {
		if (!perfil) return;
		perfil = { ...perfil, user };
		authStore.setUserData(user);
	}

	// Cambiar de sucursal (desde el modal de esta página o el del menú de usuario) actualiza la sesión:
	// el perfil adopta su sucursal y negocio sin esperar a recargar
	$effect(() => {
		const session = $currentUserStore;
		const current = untrack(() => perfil);
		if (!session || !current || session.user.sucursal_id === current.user.sucursal_id) return;
		perfil = {
			user: { ...current.user, sucursal_id: session.user.sucursal_id },
			negocio: session.negocio,
			sucursal: session.sucursal
		};
	});

	onMount(loadPerfil);
</script>

{#if perfil}
	<!-- grid-cols-1 = minmax(0, 1fr): sin esto el texto largo ensancha la columna en móvil -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
		<div class="space-y-6">
			<PerfilResumenCard user={perfil.user} {showPuntos} onUpdated={handleUserUpdated} />
			{#if showSucursal && (perfil.negocio || perfil.sucursal)}
				<PerfilSucursalCard
					negocio={perfil.negocio}
					sucursal={perfil.sucursal}
					onChange={canChangeSucursal($currentRole) ? () => (isSucursalModalOpen = true) : undefined}
				/>
			{/if}
		</div>

		<div class="space-y-6">
			<PerfilDatosForm user={perfil.user} onSaved={handleUserUpdated} />
			<PerfilPasswordForm />
		</div>
	</div>

	{#if canChangeSucursal($currentRole)}
		<PerfilSucursalModal
			isOpen={isSucursalModalOpen}
			onClose={() => (isSucursalModalOpen = false)}
		/>
	{/if}
{:else if loadError && !isLoading}
	<div
		role="alert"
		class="flex flex-col items-center gap-3 rounded-2xl border border-light-one_d bg-light-one px-4 py-12 text-center dark:border-dark-one_d dark:bg-dark-one"
	>
		<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
		<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
		<Button variant="outline" size="sm" onclick={loadPerfil}>
			{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
			Reintentar
		</Button>
	</div>
{:else}
	<PerfilSkeleton {showPuntos} {showSucursal} />
{/if}
