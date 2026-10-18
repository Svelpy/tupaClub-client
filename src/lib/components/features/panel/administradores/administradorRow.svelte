<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { Badge, TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { Administrador, SucursalConNegocio } from '#lib/interfaces/index.ts';
	import { formatDateTime, formatValue } from '#lib/utils/index.ts';
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

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/50"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<ClienteAvatar cliente={administrador} />
			<div class="min-w-0">
				<div class="flex min-w-0 items-center gap-2">
					<button
						type="button"
						onclick={() => onView(administrador)}
						class="block max-w-full truncate text-left font-medium text-light-two hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-two"
					>
						{fullName}
					</button>
					{#if isCurrentUser}
						<Badge variant="info" size="sm">Tú</Badge>
					{/if}
				</div>
				<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
					CI {administrador.ci}
				</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3 text-sm">
		{#if sucursal}
			<p class="truncate text-light-two dark:text-dark-two">{sucursal.sucursal.nombre}</p>
			<p class="truncate text-xs text-light-two_d dark:text-dark-two_d">
				{sucursal.negocio.nombre}
			</p>
		{:else}
			<p class="text-light-two_d dark:text-dark-two_d">Sin sucursal asignada</p>
		{/if}
	</TableCell>
	<TableCell class="hidden px-4 py-3 text-sm lg:table-cell">
		{#if administrador.telefono}
			<a
				href="tel:{administrador.telefono}"
				class="block truncate text-light-two hover:underline dark:text-dark-two"
			>
				{administrador.telefono}
			</a>
		{:else}
			<p class="text-light-two dark:text-dark-two">{formatValue(administrador.telefono)}</p>
		{/if}
		{#if administrador.email}
			<a
				href="mailto:{administrador.email}"
				class="block truncate text-xs text-light-two_d hover:underline dark:text-dark-two_d"
			>
				{administrador.email}
			</a>
		{/if}
	</TableCell>
	<TableCell
		class="hidden px-4 py-3 text-sm whitespace-nowrap text-light-two_d xl:table-cell dark:text-dark-two_d"
	>
		{formatDateTime(administrador.created_at)}
	</TableCell>
	<TableCell class="px-2 py-3 text-right">
		<AdministradorActions {administrador} {onView} {onEdit} {onResetPassword} {onDelete} />
	</TableCell>
</TableRow>
