<script lang="ts">
	import { XIcon } from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { formatFullName } from '#lib/utils/index.ts';

	interface Props {
		/** Cliente elegido desde un movimiento; null = todos */
		cliente: Cliente | null;
		disabled?: boolean;
		onClearCliente: () => void;
	}

	let { cliente, disabled = false, onClearCliente }: Props = $props();
</script>

<!-- El tipo se filtra con las pestañas; aquí solo el cliente, que se elige desde un movimiento -->
{#if cliente}
	<ul class="mt-4 flex flex-wrap gap-2" aria-label="Filtros aplicados">
		<li
			class="inline-flex max-w-full items-center gap-1 rounded-full border border-light-three/15 bg-light-three/10 py-1 pr-1 pl-3 text-sm text-light-three dark:border-dark-three/15 dark:bg-dark-three/10 dark:text-dark-three"
		>
			<span class="truncate">
				<span class="text-light-two_d dark:text-dark-two_d">Cliente:</span>
				<span class="font-medium">{formatFullName(cliente)}</span>
			</span>
			<button
				type="button"
				onclick={onClearCliente}
				{disabled}
				aria-label="Quitar filtro Cliente: {formatFullName(cliente)}"
				class="inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-light-three/15 focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none disabled:opacity-50 dark:hover:bg-dark-three/15 dark:focus-visible:ring-dark-three"
			>
				<XIcon class="size-4" />
			</button>
		</li>
	</ul>
{/if}
