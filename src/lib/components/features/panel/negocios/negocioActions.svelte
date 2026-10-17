<script lang="ts">
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import {
		DotsVerticalIcon,
		EyeIcon,
		MapPinIcon,
		PencilIcon,
		PhotoIcon,
		TrashIcon
	} from '#lib/icons/outline/index.ts';
	import type { DropdownOption, Negocio } from '#lib/interfaces/index.ts';

	interface Props {
		negocio: Negocio;
		onView: (negocio: Negocio) => void;
		onEdit: (negocio: Negocio) => void;
		onImage: (negocio: Negocio) => void;
		onDelete: (negocio: Negocio) => void;
		onAddSucursal: (negocio: Negocio) => void;
	}

	let { negocio, onView, onEdit, onImage, onDelete, onAddSucursal }: Props = $props();

	let isOpen = $state(false);
	let trigger = $state<HTMLButtonElement>();

	const options = $derived<DropdownOption[]>([
		{ id: 'view', label: 'Ver detalle', icon: EyeIcon, action: () => onView(negocio) },
		{
			id: 'add-sucursal',
			label: 'Agregar sucursal',
			icon: MapPinIcon,
			divider: true,
			action: () => onAddSucursal(negocio)
		},
		{
			id: 'edit',
			label: 'Editar',
			icon: PencilIcon,
			divider: true,
			action: () => onEdit(negocio)
		},
		{
			id: 'image',
			label: negocio.image_url ? 'Cambiar imagen' : 'Agregar imagen',
			icon: PhotoIcon,
			action: () => onImage(negocio)
		},
		{
			id: 'delete',
			label: 'Eliminar',
			icon: TrashIcon,
			divider: true,
			action: () => onDelete(negocio)
		}
	]);
</script>

<button
	bind:this={trigger}
	type="button"
	onclick={() => (isOpen = !isOpen)}
	aria-label="Acciones de {negocio.nombre}"
	aria-haspopup="menu"
	aria-expanded={isOpen}
	class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:text-dark-four dark:hover:bg-dark-one_d dark:hover:text-dark-two"
>
	<DotsVerticalIcon class="size-5" />
</button>

<DropdownMenu bind:isOpen {options} width={230} triggerElement={trigger} class="mt-1" />
