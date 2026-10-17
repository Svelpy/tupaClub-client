<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import ClienteRow from './clienteRow.svelte';

	interface Props {
		clientes: Cliente[];
		onView: (cliente: Cliente) => void;
		onEdit?: (cliente: Cliente) => void;
		onResetPassword?: (cliente: Cliente) => void;
		onDelete?: (cliente: Cliente) => void;
	}

	let { clientes, onView, onEdit, onResetPassword, onDelete }: Props = $props();

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-four_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class="{headClass} w-[45%] lg:w-2/5">Cliente</TableHead>
				<TableHead class={headClass}>Contacto</TableHead>
				<TableHead class="{headClass} hidden w-36 lg:table-cell">Registrado</TableHead>
				<TableHead class="{headClass} w-28 text-right">Puntos</TableHead>
				<TableHead class="h-11 w-14 px-2">
					<span class="sr-only">Acciones</span>
				</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each clientes as cliente (cliente.id)}
				<ClienteRow {cliente} {onView} {onEdit} {onResetPassword} {onDelete} />
			{/each}
		</TableBody>
	</Table>
</div>
