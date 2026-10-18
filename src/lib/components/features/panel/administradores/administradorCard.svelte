<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { Badge } from '#lib/components/ui/index.ts';
	import { BuildindStoreIcon, MailIcon, PhoneIcon } from '#lib/icons/outline/index.ts';
	import type { Administrador, SucursalConNegocio } from '#lib/interfaces/index.ts';
	import { formatDate } from '#lib/utils/index.ts';
	import AdministradorActions from './administradorActions.svelte';

	interface Props {
		administrador: Administrador;
		/** undefined si no tiene sucursal o aún no se cargó */
		sucursal?: SucursalConNegocio;
		/** El usuario es quien tiene la sesión iniciada */
		isCurrentUser?: boolean;
		onView: (administrador: Administrador) => void;
		onEdit?: (administrador: Administrador) => void;
		onResetPassword?: (administrador: Administrador) => void;
		onDelete?: (administrador: Administrador) => void;
	}

	let {
		administrador,
		sucursal,
		isCurrentUser = false,
		onView,
		onEdit,
		onResetPassword,
		onDelete
	}: Props = $props();

	const fullName = $derived(`${administrador.nombre} ${administrador.apellidos ?? ''}`.trim());
</script>

<article
	class="flex gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<ClienteAvatar cliente={administrador} size="lg" />
	<div class="min-w-0 flex-1">
		<div class="flex min-w-0 items-center gap-2">
			<h3 class="truncate font-semibold text-light-two dark:text-dark-two">
				<button
					type="button"
					onclick={() => onView(administrador)}
					class="max-w-full truncate text-left hover:underline focus-visible:underline focus-visible:outline-none"
				>
					{fullName}
				</button>
			</h3>
			{#if isCurrentUser}
				<Badge variant="info" size="sm">Tú</Badge>
			{/if}
		</div>
		<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">CI {administrador.ci}</p>

		<div class="mt-2 space-y-1 text-sm">
			<p class="flex min-w-0 items-center gap-1.5 text-light-two dark:text-dark-two">
				<BuildindStoreIcon class="size-4 shrink-0 text-light-two_d dark:text-dark-two_d" />
				<span class="truncate">
					{#if sucursal}
						{sucursal.sucursal.nombre}
						<span class="text-light-two_d dark:text-dark-two_d">· {sucursal.negocio.nombre}</span>
					{:else}
						<span class="text-light-two_d dark:text-dark-two_d">Sin sucursal asignada</span>
					{/if}
				</span>
			</p>
			{#if administrador.telefono}
				<a
					href="tel:{administrador.telefono}"
					class="flex items-center gap-1.5 font-medium text-light-three dark:text-dark-three"
				>
					<PhoneIcon class="size-4 shrink-0" />
					{administrador.telefono}
				</a>
			{/if}
			{#if administrador.email}
				<a
					href="mailto:{administrador.email}"
					class="flex min-w-0 items-center gap-1.5 text-light-two_d dark:text-dark-two_d"
				>
					<MailIcon class="size-4 shrink-0" />
					<span class="truncate">{administrador.email}</span>
				</a>
			{/if}
		</div>
		<p class="mt-2 text-xs text-light-two_d dark:text-dark-two_d">
			Registrado el {formatDate(administrador.created_at)}
		</p>
	</div>
	<div class="-mt-1.5 -mr-2 shrink-0 self-start">
		<AdministradorActions {administrador} {onView} {onEdit} {onResetPassword} {onDelete} />
	</div>
</article>
