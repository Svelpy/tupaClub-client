<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tabs } from '#lib/components/ui/index.ts';
	import type { CanjeStatus } from '#lib/interfaces/index.ts';

	interface Props {
		/** Pestaña activa */
		status: CanjeStatus;
		onChange: (status: CanjeStatus) => void;
		/** Contenido de la pestaña activa */
		children: Snippet;
	}

	let { status, onChange, children }: Props = $props();

	// Nombres pensados para el cliente: "vigente" = pendiente de presentar en caja
	const OPTIONS: { value: CanjeStatus; label: string }[] = [
		{ value: 'PENDIENTE', label: 'Vigentes' },
		{ value: 'CANJEADO', label: 'Utilizados' },
		{ value: 'EXPIRADO', label: 'Vencidos' },
		{ value: 'CANCELADO', label: 'Cancelados' }
	];
</script>

<Tabs
	id="mis-canjes"
	label="Estado de mis canjes"
	variant="underline"
	options={OPTIONS}
	value={status}
	{onChange}
>
	{@render children()}
</Tabs>
