<script lang="ts">
	import { ModalConfirm } from '#lib/components/ui/index.ts';
	import type { Administrador } from '#lib/interfaces/index.ts';
	import { administradorService, errorService } from '#lib/services/index.ts';
	import { alert, formatRole } from '#lib/utils/index.ts';

	interface Props {
		/** Usuario a eliminar; null = modal cerrado */
		administrador: Administrador | null;
		onClose: () => void;
		onDeleted: (administrador: Administrador) => void;
	}

	let { administrador, onClose, onDeleted }: Props = $props();

	let isLoading = $state(false);

	const fullName = $derived(
		administrador ? `${administrador.nombre} ${administrador.apellidos ?? ''}`.trim() : ''
	);

	function handleCancel() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!administrador || isLoading) return;
		const target = administrador;
		const targetName = fullName;

		isLoading = true;
		let deleted = false;
		try {
			await administradorService.delete(target.id);
			alert('success', `Usuario «${targetName}» eliminado correctamente.`);
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
	isOpen={!!administrador}
	message={administrador
		? `¿Seguro que deseas eliminar a «${fullName}» (${formatRole(administrador.role)})? Perderá el acceso al panel y dejará de aparecer en el listado.`
		: ''}
	loading={isLoading}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>
