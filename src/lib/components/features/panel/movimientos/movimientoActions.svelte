<script lang="ts">
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import { DotsVerticalIcon, UserIcon } from '#lib/icons/outline/index.ts';
	import type { DropdownOption, MovimientoListItem } from '#lib/interfaces/index.ts';

	/** Solo se muestran las opciones cuyo handler se pasa (p. ej. no se ofrece un filtro ya aplicado) */
	interface Props {
		item: MovimientoListItem;
		onFilterCliente?: (item: MovimientoListItem) => void;
	}

	let { item, onFilterCliente }: Props = $props();

	let isOpen = $state(false);
	let trigger = $state<HTMLButtonElement>();

	const options = $derived<DropdownOption[]>(
		[
			onFilterCliente && {
				id: 'filter-cliente',
				label: `Ver movimientos de ${item.cliente.nombre}`,
				icon: UserIcon,
				action: () => onFilterCliente(item)
			}
		].filter((option) => !!option)
	);
</script>

{#if options.length > 0}
	<button
		bind:this={trigger}
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Acciones del movimiento de {item.cliente.nombre}"
		aria-haspopup="menu"
		aria-expanded={isOpen}
		class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:text-dark-two_d dark:hover:bg-dark-one_d dark:hover:text-dark-two dark:focus-visible:ring-dark-three"
	>
		<DotsVerticalIcon class="size-5" />
	</button>

	<DropdownMenu bind:isOpen {options} width={256} triggerElement={trigger} class="mt-1" />
{/if}
