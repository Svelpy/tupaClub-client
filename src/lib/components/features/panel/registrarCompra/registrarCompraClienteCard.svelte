<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { CheckCircleIcon, PhoneIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		cliente: Cliente;
		disabled?: boolean;
		onChange: () => void;
	}

	let { cliente, disabled = false, onChange }: Props = $props();

	const fullName = $derived(`${cliente.nombre} ${cliente.apellidos ?? ''}`.trim());
</script>

<div
	class="flex flex-col gap-4 rounded-xl border border-light-success/25 bg-light-success/10 p-4 sm:flex-row sm:items-center dark:border-dark-success/25 dark:bg-dark-success/10"
>
	<div class="flex min-w-0 flex-1 items-center gap-3">
		<ClienteAvatar {cliente} size="lg" />
		<div class="min-w-0">
			<p
				class="flex items-center gap-1.5 text-xs font-medium text-[color-mix(in_oklab,var(--color-light-success)_70%,black)] dark:text-[color-mix(in_oklab,var(--color-dark-success)_70%,black)]"
			>
				<CheckCircleIcon class="size-4" />
				Cliente encontrado
			</p>
			<p class="truncate font-semibold text-light-two dark:text-dark-two">{fullName}</p>
			<p class="flex flex-wrap gap-x-3 text-xs text-light-two_d dark:text-dark-two_d">
				<span>CI {cliente.ci}</span>
				{#if cliente.telefono}
					<span class="inline-flex items-center gap-1">
						<PhoneIcon class="size-3.5" />
						{cliente.telefono}
					</span>
				{/if}
			</p>
		</div>
	</div>

	<div class="flex items-center justify-between gap-4 sm:justify-end">
		<div class="text-left sm:text-right">
			<p class="text-xs text-light-two_d dark:text-dark-two_d">Saldo actual</p>
			<p class="font-semibold text-light-three tabular-nums dark:text-dark-three">
				{formatNumber(cliente.puntos)} pts
			</p>
		</div>
		<button
			type="button"
			onclick={onChange}
			{disabled}
			class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-light-two underline-offset-2 transition-colors hover:bg-light-one/60 hover:underline focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none disabled:opacity-50 dark:text-dark-two dark:hover:bg-dark-one/60 dark:focus-visible:ring-dark-three"
		>
			Cambiar cliente
		</button>
	</div>
</div>
