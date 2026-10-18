<script lang="ts">
	import { ModalConfirm } from '#lib/components/ui/index.ts';
	import type { Sucursal } from '#lib/interfaces/index.ts';
	import { errorService, sucursalService } from '#lib/services/index.ts';
	import { alert } from '#lib/utils/index.ts';

	interface Props {
		/** Sucursal a eliminar; null = modal cerrado */
		sucursal: Sucursal | null;
		onClose: () => void;
		onDeleted: (sucursal: Sucursal) => void;
	}

	let { sucursal, onClose, onDeleted }: Props = $props();

	let isLoading = $state(false);

	function handleCancel() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!sucursal || isLoading) return;
		const target = sucursal;

		isLoading = true;
		let deleted = false;
		try {
			await sucursalService.delete(target.id);
			alert('success', `Sucursal «${target.nombre}» eliminada correctamente.`);
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
	isOpen={!!sucursal}
	message={sucursal
		? `¿Seguro que deseas eliminar la sucursal «${sucursal.nombre}»? Dejará de aparecer en el negocio.`
		: ''}
	loading={isLoading}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>
