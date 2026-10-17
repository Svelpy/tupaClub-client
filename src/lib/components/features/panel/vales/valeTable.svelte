<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { Categoria, Negocio, Vale } from '#lib/interfaces/index.ts';
	import ValeRow from './valeRow.svelte';

	interface Props {
		vales: Vale[];
		categoriasById: Map<string, Categoria>;
		negociosById: Map<string, Negocio>;
	}

	let { vales, categoriasById, negociosById }: Props = $props();

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-four_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class="{headClass} w-[40%] lg:w-[32%]">Vale</TableHead>
				<TableHead class={headClass}>Negocio</TableHead>
				<TableHead class="{headClass} hidden lg:table-cell">Categoría</TableHead>
				<TableHead class="{headClass} w-28 text-right">Valor</TableHead>
				<TableHead class="{headClass} w-28 text-right">Puntos</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each vales as vale (vale.id)}
				<ValeRow
					{vale}
					categoria={categoriasById.get(vale.categoria_id)}
					negocio={negociosById.get(vale.negocio_id)}
				/>
			{/each}
		</TableBody>
	</Table>
</div>
