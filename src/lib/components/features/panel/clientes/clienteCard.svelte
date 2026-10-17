<script lang="ts">
	import { MailIcon, PhoneIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { formatDate, formatNumber } from '#lib/utils/index.ts';
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

<article
	class="flex gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<ClienteAvatar {cliente} size="lg" />
	<div class="min-w-0 flex-1">
		<h3 class="truncate font-semibold text-light-two dark:text-dark-two">
			<button
				type="button"
				onclick={() => onView(cliente)}
				class="max-w-full truncate text-left hover:underline focus-visible:underline focus-visible:outline-none"
			>
				{fullName}
			</button>
		</h3>
		<p class="truncate text-xs text-light-two_d dark:text-dark-four_d">CI {cliente.ci}</p>
		<div class="mt-2 space-y-1 text-sm">
			{#if cliente.telefono}
				<a
					href="tel:{cliente.telefono}"
					class="flex items-center gap-1.5 font-medium text-light-three dark:text-dark-three"
				>
					<PhoneIcon class="size-4 shrink-0" />
					{cliente.telefono}
				</a>
			{/if}
			{#if cliente.email}
				<a
					href="mailto:{cliente.email}"
					class="flex min-w-0 items-center gap-1.5 text-light-two_d dark:text-dark-four"
				>
					<MailIcon class="size-4 shrink-0" />
					<span class="truncate">{cliente.email}</span>
				</a>
			{/if}
		</div>
		<div class="mt-2 flex items-center justify-between gap-2 text-xs">
			<span class="text-light-two_d dark:text-dark-four_d">
				Registrado el {formatDate(cliente.created_at)}
			</span>
			<span class="shrink-0 font-semibold text-light-two dark:text-dark-two">
				{formatNumber(cliente.puntos)} pts
			</span>
		</div>
	</div>
	<div class="-mt-1.5 -mr-2 shrink-0 self-start">
		<ClienteActions {cliente} {onView} {onEdit} {onResetPassword} {onDelete} />
	</div>
</article>
