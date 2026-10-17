<script lang="ts">
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import { DotsVerticalIcon, XIcon } from '#lib/icons/outline/index.ts';
	import type { CanjeListItem, DropdownOption } from '#lib/interfaces/index.ts';

	/** Solo se muestran las opciones cuyo handler se pasa (según permisos y estado del canje) */
	interface Props {
		item: CanjeListItem;
		onCancel?: (item: CanjeListItem) => void;
	}

	let { item, onCancel }: Props = $props();

	let isOpen = $state(false);
	let trigger = $state<HTMLButtonElement>();

	const options = $derived<DropdownOption[]>(
		[
			onCancel && {
				id: 'cancel',
				label: 'Cancelar canje',
				icon: XIcon,
				action: () => onCancel(item)
			}
		].filter((option) => !!option)
	);
</script>

{#if options.length > 0}
	<button
		bind:this={trigger}
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Acciones del canje de {item.vale.nombre}"
		aria-haspopup="menu"
		aria-expanded={isOpen}
		class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:text-dark-two_d dark:hover:bg-dark-one_d dark:hover:text-dark-two dark:focus-visible:ring-dark-three"
	>
		<DotsVerticalIcon class="size-5" />
	</button>

	<DropdownMenu bind:isOpen {options} width={176} triggerElement={trigger} class="mt-1" />
{/if}
