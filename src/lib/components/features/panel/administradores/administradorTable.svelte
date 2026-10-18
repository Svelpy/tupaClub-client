<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { Administrador, SucursalConNegocio } from '#lib/interfaces/index.ts';
	import AdministradorRow from './administradorRow.svelte';

	interface Props {
		administradores: Administrador[];
		sucursalesById: Map<string, SucursalConNegocio>;
		currentUserId: string | null;
		onView: (administrador: Administrador) => void;
		onEdit?: (administrador: Administrador) => void;
		onResetPassword?: (administrador: Administrador) => void;
		onDelete?: (administrador: Administrador) => void;
	}

	let {
		administradores,
		sucursalesById,
		currentUserId,
		onView,
		onEdit,
		onResetPassword,
		onDelete
	}: Props = $props();

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class="{headClass} w-[45%] lg:w-[35%]">Usuario</TableHead>
				<TableHead class={headClass}>Sucursal</TableHead>
				<TableHead class="{headClass} hidden lg:table-cell">Contacto</TableHead>
				<TableHead class="{headClass} hidden w-48 xl:table-cell">Registrado</TableHead>
				<TableHead class="h-11 w-14 px-2">
					<span class="sr-only">Acciones</span>
				</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each administradores as administrador (administrador.id)}
				<AdministradorRow
					{administrador}
					sucursal={administrador.sucursal_id
						? sucursalesById.get(administrador.sucursal_id)
						: undefined}
					isCurrentUser={administrador.id === currentUserId}
					{onView}
					{onEdit}
					{onResetPassword}
					{onDelete}
				/>
			{/each}
		</TableBody>
	</Table>
</div>
