<script lang="ts">
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import { DotsVerticalIcon, PencilIcon, TrashIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria, DropdownOption } from '#lib/interfaces/index.ts';

	/** Solo se muestran las opciones cuyo handler se pasa (según los permisos del rol) */
	interface Props {
		categoria: Categoria;
		onEdit?: (categoria: Categoria) => void;
		onDelete?: (categoria: Categoria) => void;
	}

	let { categoria, onEdit, onDelete }: Props = $props();

	let isOpen = $state(false);
	let trigger = $state<HTMLButtonElement>();

	const options = $derived<DropdownOption[]>(
		[
			onEdit && {
				id: 'edit',
				label: 'Editar',
				icon: PencilIcon,
				action: () => onEdit(categoria)
			},
			onDelete && {
				id: 'delete',
				label: 'Eliminar',
				icon: TrashIcon,
				divider: true,
				action: () => onDelete(categoria)
			}
		].filter((option) => !!option)
	);
</script>

{#if options.length > 0}
	<button
		bind:this={trigger}
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Acciones de {categoria.nombre}"
		aria-haspopup="menu"
		aria-expanded={isOpen}
		class="inline-flex size-9 items-center justify-center rounded-lg text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none active:scale-95 dark:text-dark-four dark:hover:bg-dark-one_d dark:hover:text-dark-two"
	>
		<DotsVerticalIcon class="size-5" />
	</button>

	<DropdownMenu bind:isOpen {options} width={176} triggerElement={trigger} class="mt-1" />
{/if}
