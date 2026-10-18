<script lang="ts">
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import { DotsVerticalIcon, FilterIcon, UserIcon } from '#lib/icons/outline/index.ts';
	import type { DropdownOption, OperacionListItem } from '#lib/interfaces/index.ts';

	/** Solo se muestran las opciones cuyo handler se pasa (p. ej. no se ofrece un filtro ya aplicado) */
	interface Props {
		item: OperacionListItem;
		onFilterReceptor?: (item: OperacionListItem) => void;
		onFilterEmisor?: (item: OperacionListItem) => void;
	}

	let { item, onFilterReceptor, onFilterEmisor }: Props = $props();

	let isOpen = $state(false);
	let trigger = $state<HTMLButtonElement>();

	const options = $derived<DropdownOption[]>(
		[
			onFilterReceptor && {
				id: 'filter-receptor',
				label: `Ver compras de ${item.receptor.nombre}`,
				icon: UserIcon,
				action: () => onFilterReceptor(item)
			},
			onFilterEmisor && {
				id: 'filter-emisor',
				label: `Ver registradas por ${item.emisor.nombre}`,
				icon: FilterIcon,
				action: () => onFilterEmisor(item)
			}
		].filter((option) => !!option)
	);
</script>

{#if options.length > 0}
	<button
		bind:this={trigger}
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Acciones de la operación de {item.receptor.nombre}"
		aria-haspopup="menu"
		aria-expanded={isOpen}
		class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:text-dark-four dark:hover:bg-dark-one_d dark:hover:text-dark-two"
	>
		<DotsVerticalIcon class="size-5" />
	</button>

	<DropdownMenu bind:isOpen {options} width={256} triggerElement={trigger} class="mt-1" />
{/if}
