<script lang="ts">
	import { ModalConfirm } from '#lib/components/ui/index.ts';
	import type { ValeListItem } from '#lib/interfaces/index.ts';
	import { errorService, valeService } from '#lib/services/index.ts';
	import { alert } from '#lib/utils/index.ts';

	interface Props {
		/** Vale a eliminar; null = modal cerrado */
		item: ValeListItem | null;
		onClose: () => void;
		onDeleted: (item: ValeListItem) => void;
	}

	let { item, onClose, onDeleted }: Props = $props();

	let isLoading = $state(false);

	function handleCancel() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!item || isLoading) return;
		const target = item;

		isLoading = true;
		let deleted = false;
		try {
			await valeService.delete(target.vale.id);
			alert('success', `Vale «${target.vale.nombre}» eliminado correctamente.`);
			onDeleted(target);
			deleted = true;
		} catch (error) {
			alert('error', errorService.getMessage(error), { duration: 4000 });
		} finally {
			isLoading = false;
		}

		if (deleted) onClose();
	}
</script>

<ModalConfirm
	isOpen={!!item}
	message={item
		? `¿Seguro que deseas eliminar el vale «${item.vale.nombre}»? Los clientes ya no podrán canjearlo.`
		: ''}
	loading={isLoading}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>
