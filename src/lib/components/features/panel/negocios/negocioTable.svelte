<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { Negocio, NegocioListItem } from '#lib/interfaces/index.ts';
	import NegocioRow from './negocioRow.svelte';

	interface Props {
		items: NegocioListItem[];
		onView: (negocio: Negocio) => void;
		onEdit: (negocio: Negocio) => void;
		onImage: (negocio: Negocio) => void;
		onDelete: (negocio: Negocio) => void;
		onAddSucursal: (negocio: Negocio) => void;
	}

	let { items, onView, onEdit, onImage, onDelete, onAddSucursal }: Props = $props();

	// Total de columnas (incluidas las que se ocultan por breakpoint)
	const COLUMNS = 6;

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class="{headClass} w-auto">Negocio</TableHead>
				<TableHead class="{headClass} w-28">Tipo</TableHead>
				<TableHead class="{headClass} hidden w-36 lg:table-cell">Teléfono</TableHead>
				<TableHead class="{headClass} w-40">Sucursales</TableHead>
				<TableHead class="{headClass} hidden w-48 xl:table-cell">Actualizado</TableHead>
				<TableHead class="h-11 w-28 px-2 lg:w-40"><span class="sr-only">Acciones</span></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each items as { negocio, sucursales } (negocio.id)}
				<NegocioRow
					{negocio}
					{sucursales}
					colspan={COLUMNS}
					{onView}
					{onEdit}
					{onImage}
					{onDelete}
					{onAddSucursal}
				/>
			{/each}
		</TableBody>
	</Table>
</div>
