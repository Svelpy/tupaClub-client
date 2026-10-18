<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '#lib/components/ui/index.ts';

	interface Props {
		/** Cantidad de cards/filas a mostrar */
		items?: number;
	}

	let { items = 5 }: Props = $props();

	// Anchos variados para que las líneas no se vean idénticas
	const NAME_WIDTHS = ['w-1/2', 'w-2/3', 'w-2/5', 'w-3/5', 'w-1/3'];
	const DETAIL_WIDTHS = ['w-3/5', 'w-1/2', 'w-2/3', 'w-2/5', 'w-3/4'];

	const rows = $derived(Array.from({ length: items }, (_, i) => i));

	const headClass = 'h-11 text-xs tracking-wide text-light-two_d uppercase dark:text-dark-two_d';
	const block = 'rounded bg-light-one_d dark:bg-dark-one_d';
</script>

<div role="status" aria-label="Cargando usuarios">
	<span class="sr-only">Cargando…</span>

	<!-- Móvil y tablet pequeña: tarjetas (mismo layout que AdministradorCard) -->
	<div class="grid gap-3 p-3 sm:grid-cols-2 md:hidden" aria-hidden="true">
		{#each rows as i (i)}
			<div
				class="flex animate-pulse gap-3 rounded-xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
			>
				<div class="size-14 shrink-0 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
				<div class="min-w-0 flex-1 space-y-2">
					<div class={['h-4', block, NAME_WIDTHS[i % NAME_WIDTHS.length]]}></div>
					<div class={['h-3 w-1/3', block]}></div>
					<div class="space-y-1.5 pt-1">
						<div class={['h-3.5', block, DETAIL_WIDTHS[i % DETAIL_WIDTHS.length]]}></div>
						<div class={['h-3.5 w-2/5', block]}></div>
					</div>
					<div class={['mt-1 h-3 w-1/2', block]}></div>
				</div>
				<div class="size-9 shrink-0 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
			</div>
		{/each}
	</div>

	<!-- Tablet y escritorio: tabla (mismas columnas que AdministradorTable) -->
	<div class="hidden overflow-x-auto md:block" aria-hidden="true">
		<Table class="table-fixed text-sm">
			<TableHeader>
				<TableRow class="border-light-one_d hover:bg-transparent dark:border-dark-one_d">
					<TableHead class="{headClass} w-[45%] lg:w-[35%]">Usuario</TableHead>
					<TableHead class={headClass}>Sucursal</TableHead>
					<TableHead class="{headClass} hidden lg:table-cell">Contacto</TableHead>
					<TableHead class="{headClass} hidden w-48 xl:table-cell">Registrado</TableHead>
					<TableHead class="h-11 w-14 px-2">
						<span class="sr-only">Acciones</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each rows as i (i)}
					<TableRow
						class="animate-pulse border-light-one_d hover:bg-transparent dark:border-dark-one_d"
					>
						<TableCell class="px-4 py-3">
							<div class="flex items-center gap-3">
								<div class="size-11 shrink-0 rounded-full bg-light-one_d dark:bg-dark-one_d"></div>
								<div class="min-w-0 flex-1 space-y-2">
									<div class={['h-3.5', block, NAME_WIDTHS[i % NAME_WIDTHS.length]]}></div>
									<div class={['h-3 w-1/4', block]}></div>
								</div>
							</div>
						</TableCell>
						<TableCell class="px-4 py-3">
							<div class="space-y-1.5">
								<div class={['h-3.5', block, DETAIL_WIDTHS[i % DETAIL_WIDTHS.length]]}></div>
								<div class={['h-3 w-2/5', block]}></div>
							</div>
						</TableCell>
						<TableCell class="hidden px-4 py-3 lg:table-cell">
							<div class="space-y-1.5">
								<div class={['h-3.5 w-1/2', block]}></div>
								<div class={['h-3', block, DETAIL_WIDTHS[(i + 2) % DETAIL_WIDTHS.length]]}></div>
							</div>
						</TableCell>
						<TableCell class="hidden px-4 py-3 xl:table-cell">
							<div class={['h-3.5 w-36', block]}></div>
						</TableCell>
						<TableCell class="px-2 py-3">
							<div class="ml-auto size-9 rounded-lg bg-light-one_d dark:bg-dark-one_d"></div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
