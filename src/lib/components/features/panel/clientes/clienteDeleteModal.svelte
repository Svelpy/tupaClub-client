<script lang="ts">
	import { ModalConfirm } from '#lib/components/ui/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { clienteService, errorService } from '#lib/services/index.ts';
	import { alert } from '#lib/utils/index.ts';

	interface Props {
		/** Cliente a eliminar; null = modal cerrado */
		cliente: Cliente | null;
		onClose: () => void;
		onDeleted: (cliente: Cliente) => void;
	}

	let { cliente, onClose, onDeleted }: Props = $props();

	let isLoading = $state(false);

	const fullName = $derived(cliente ? `${cliente.nombre} ${cliente.apellidos ?? ''}`.trim() : '');

	function handleCancel() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!cliente || isLoading) return;
		const target = cliente;
		const targetName = fullName;

		isLoading = true;
		let deleted = false;
		try {
			await clienteService.delete(target.id);
			alert('success', `Cliente «${targetName}» eliminado correctamente.`);
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
	isOpen={!!cliente}
	message={cliente
		? `¿Seguro que deseas eliminar al cliente «${fullName}»? Dejará de aparecer en el listado.`
		: ''}
	loading={isLoading}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>
