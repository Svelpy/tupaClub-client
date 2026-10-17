<script lang="ts">
	import { ModalConfirm } from '#lib/components/ui/index.ts';
	import type { Negocio } from '#lib/interfaces/index.ts';
	import { errorService, negocioService } from '#lib/services/index.ts';
	import { alert } from '#lib/utils/index.ts';

	interface Props {
		/** Negocio a eliminar; null = modal cerrado */
		negocio: Negocio | null;
		onClose: () => void;
		onDeleted: (negocio: Negocio) => void;
	}

	let { negocio, onClose, onDeleted }: Props = $props();

	let isLoading = $state(false);

	function handleCancel() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!negocio || isLoading) return;
		const target = negocio;

		isLoading = true;
		let deleted = false;
		try {
			await negocioService.delete(target.id);
			alert('success', `Negocio «${target.nombre}» eliminado correctamente.`);
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
	isOpen={!!negocio}
	message={negocio
		? `¿Seguro que deseas eliminar el negocio «${negocio.nombre}»? Dejará de aparecer en el listado.`
		: ''}
	loading={isLoading}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>
