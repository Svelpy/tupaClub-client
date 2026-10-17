<script lang="ts">
	import { Badge, TableCell, TableRow } from '#lib/components/ui/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { formatDateTime, formatNumber, formatValue } from '#lib/utils/index.ts';
	import ClienteActions from './clienteActions.svelte';
	import ClienteAvatar from './clienteAvatar.svelte';

	interface Props {
		cliente: Cliente;
		onView: (cliente: Cliente) => void;
		onEdit?: (cliente: Cliente) => void;
		onResetPassword?: (cliente: Cliente) => void;
		onDelete?: (cliente: Cliente) => void;
	}

	let { cliente, onView, onEdit, onResetPassword, onDelete }: Props = $props();

	const fullName = $derived(`${cliente.nombre} ${cliente.apellidos ?? ''}`.trim());
</script>

<TableRow
	class="border-light-one_d hover:bg-light-one_d/50 dark:border-dark-one_d dark:hover:bg-dark-one_d/40"
>
	<TableCell class="px-4 py-3">
		<div class="flex min-w-0 items-center gap-3">
			<ClienteAvatar {cliente} />
			<div class="min-w-0">
				<button
					type="button"
					onclick={() => onView(cliente)}
					class="block max-w-full truncate text-left font-medium text-light-two hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-two"
				>
					{fullName}
				</button>
				<p class="truncate text-xs text-light-two_d dark:text-dark-four_d">CI {cliente.ci}</p>
			</div>
		</div>
	</TableCell>
	<TableCell class="px-4 py-3 text-sm">
		{#if cliente.telefono}
			<a
				href="tel:{cliente.telefono}"
				class="block truncate text-light-two hover:underline dark:text-dark-two"
			>
				{cliente.telefono}
			</a>
		{:else}
			<p class="text-light-two dark:text-dark-two">{formatValue(cliente.telefono)}</p>
		{/if}
		{#if cliente.email}
			<a
				href="mailto:{cliente.email}"
				class="block truncate text-xs text-light-two_d hover:underline dark:text-dark-four_d"
			>
				{cliente.email}
			</a>
		{/if}
	</TableCell>
	<TableCell
		class="hidden px-4 py-3 text-sm whitespace-nowrap text-light-two_d lg:table-cell dark:text-dark-four"
	>
		{formatDateTime(cliente.created_at)}
	</TableCell>
	<TableCell
		class="px-4 py-3 text-right font-semibold whitespace-nowrap text-light-two dark:text-dark-two"
	>
		<Badge variant="secondary">{formatNumber(cliente.puntos)}</Badge>
	</TableCell>
	<TableCell class="px-2 py-3 text-right">
		<ClienteActions {cliente} {onView} {onEdit} {onResetPassword} {onDelete} />
	</TableCell>
</TableRow>
