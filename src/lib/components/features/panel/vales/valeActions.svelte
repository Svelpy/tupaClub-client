<script lang="ts">
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import { DotsVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from '#lib/icons/outline/index.ts';
	import type { DropdownOption, ValeListItem } from '#lib/interfaces/index.ts';

	/** Solo se muestran las opciones cuyo handler se pasa (según los permisos del rol) */
	interface Props {
		item: ValeListItem;
		onView: (item: ValeListItem) => void;
		onEdit?: (item: ValeListItem) => void;
		onDelete?: (item: ValeListItem) => void;
	}

	let { item, onView, onEdit, onDelete }: Props = $props();

	let isOpen = $state(false);
	let trigger = $state<HTMLButtonElement>();

	const options = $derived<DropdownOption[]>(
		[
			{ id: 'view', label: 'Ver detalle', icon: EyeIcon, action: () => onView(item) },
			onEdit && {
				id: 'edit',
				label: 'Editar',
				icon: PencilIcon,
				divider: true,
				action: () => onEdit(item)
			},
			onDelete && {
				id: 'delete',
				label: 'Eliminar',
				icon: TrashIcon,
				divider: true,
				action: () => onDelete(item)
			}
		].filter((option) => !!option)
	);
</script>

<button
	bind:this={trigger}
	type="button"
	onclick={() => (isOpen = !isOpen)}
	aria-label="Acciones de {item.vale.nombre}"
	aria-haspopup="menu"
	aria-expanded={isOpen}
	class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:text-dark-two_d dark:hover:bg-dark-one_d dark:hover:text-dark-two dark:focus-visible:ring-dark-three"
>
	<DotsVerticalIcon class="size-5" />
</button>

<DropdownMenu bind:isOpen {options} width={190} triggerElement={trigger} class="mt-1" />
