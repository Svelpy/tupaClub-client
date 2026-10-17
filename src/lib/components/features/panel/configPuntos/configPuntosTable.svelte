<script lang="ts">
	import { Table, TableBody, TableHead, TableHeader, TableRow } from '#lib/components/ui/index.ts';
	import type { ConfigPuntos } from '#lib/interfaces/index.ts';
	import ConfigPuntosRow from './configPuntosRow.svelte';

	interface Props {
		configs: ConfigPuntos[];
	}

	let { configs }: Props = $props();

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
</script>

<div class="overflow-x-auto">
	<Table class="table-fixed text-sm">
		<TableHeader>
			<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
				<TableHead class="{headClass} w-28">Estado</TableHead>
				<TableHead class={headClass}>Asignación de puntos</TableHead>
				<TableHead class={headClass}>Costo de vale</TableHead>
				<TableHead class="{headClass} w-52">Inicio de vigencia</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each configs as config (config.id)}
				<ConfigPuntosRow {config} />
			{/each}
		</TableBody>
	</Table>
</div>
