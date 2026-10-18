<script lang="ts">
	import { untrack } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ClientDetailHeader } from '#lib/components/features/app/navigation/index.ts';
	import { ValeTicketCard } from '#lib/components/features/app/vales/index.ts';
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { ValeGridSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { PAGINATION } from '#lib/constants/index.ts';
	import { AlertTriangleIcon, RefreshIcon, TicketIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria, ValeListItem } from '#lib/interfaces/index.ts';
	import { categoriaService, errorService, valeService } from '#lib/services/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	// Siempre viene en esta ruta; el tipo de SvelteKit lo declara opcional
	const categoriaId = $derived(page.params.categoriaId ?? '');

	let categoria = $state<Categoria | null>(null);
	let vales = $state<ValeListItem[]>([]);
	let currentPage = $state<number>(PAGINATION.DEFAULT_PAGE);
	let totalPages = $state(1);
	let total = $state(0);
	let isLoading = $state(false);
	let loadError = $state('');

	// Mientras carga la categoría, el nombre sale del primer vale (todos son de la misma)
	const nombre = $derived(categoria?.nombre ?? vales[0]?.categoria.nombre ?? 'Vales');
	const hasMore = $derived(currentPage < totalPages);
	const isInitialLoading = $derived(isLoading && vales.length === 0);

	// Evita que una respuesta lenta (de otra categoría o página) pise a la más reciente
	let lastRequestId = 0;

	async function loadVales(id: string, pageNumber: number) {
		const requestId = ++lastRequestId;
		loadError = '';
		isLoading = true;
		try {
			const response = await valeService.list({
				categoria_id: id,
				page: pageNumber,
				per_page: PAGINATION.DEFAULT_PER_PAGE
			});
			if (requestId !== lastRequestId) return;
			// "Ver más vales" agrega la página siguiente debajo de las ya cargadas
			vales = pageNumber === PAGINATION.DEFAULT_PAGE ? response.data : [...vales, ...response.data];
			currentPage = response.page;
			totalPages = Math.max(1, response.total_pages);
			total = response.total;
		} catch (error) {
			if (requestId !== lastRequestId) return;
			loadError = errorService.getMessage(error);
		} finally {
			if (requestId === lastRequestId) isLoading = false;
		}
	}

	// Solo para el encabezado (nombre, descripción): si falla, la página sigue con los vales
	async function loadCategoria(id: string) {
		try {
			const response = await categoriaService.get(id);
			if (id === categoriaId) categoria = response;
		} catch (error) {
			errorService.log(error);
		}
	}

	// SvelteKit reutiliza la página al cambiar de categoría: se recarga al cambiar el parámetro
	$effect(() => {
		const id = categoriaId;
		untrack(() => {
			categoria = null;
			vales = [];
			currentPage = PAGINATION.DEFAULT_PAGE;
			totalPages = 1;
			total = 0;
			loadCategoria(id);
			loadVales(id, PAGINATION.DEFAULT_PAGE);
		});
	});
</script>

<MainLayout title={nombre}>
	<ClientDetailHeader title={nombre} backHref={resolve('/app/categorias')} />

	<div class="mt-4 space-y-5 md:mt-0">
		{#if categoria}
			<div class="flex items-center gap-3">
				<CategoriaIcon iconNumber={categoria.icon_number} size="lg" class="rounded-full" />
				<div class="min-w-0">
					<p class="text-sm text-light-two dark:text-dark-two">
						{categoria.descripcion ?? 'Canjea tus puntos por estos vales.'}
					</p>
					{#if !isInitialLoading && total > 0}
						<p class="text-xs text-light-two_d dark:text-dark-two_d">
							{formatNumber(total)}
							{total === 1 ? 'vale disponible' : 'vales disponibles'}
						</p>
					{/if}
				</div>
			</div>
		{/if}

		{#if loadError && vales.length === 0}
			<div
				role="alert"
				class="flex flex-col items-center gap-3 rounded-3xl border border-light-one_d bg-light-one px-4 py-12 text-center dark:border-dark-one_d dark:bg-dark-one"
			>
				<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
				<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
				<Button
					variant="outline"
					size="sm"
					onclick={() => loadVales(categoriaId, PAGINATION.DEFAULT_PAGE)}
				>
					{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
					Reintentar
				</Button>
			</div>
		{:else if isInitialLoading}
			<ValeGridSkeleton />
		{:else if vales.length === 0}
			<div class="flex flex-col items-center gap-2 px-4 py-16 text-center">
				<TicketIcon class="size-10 text-light-two_d dark:text-dark-two_d" />
				<p class="font-medium text-light-two dark:text-dark-two">
					Aún no hay vales en esta categoría
				</p>
				<p class="text-sm text-light-two_d dark:text-dark-two_d">
					Mira las otras categorías: seguro encuentras algo para tus puntos.
				</p>
				<Button variant="outline" size="sm" href={resolve('/app/categorias')} class="mt-2">
					Ver categorías
				</Button>
			</div>
		{:else}
			<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
				{#each vales as item (item.vale.id)}
					<li>
						<ValeTicketCard {item} />
					</li>
				{/each}
			</ul>

			{#if loadError}
				<div
					role="alert"
					class="flex items-start gap-2 rounded-xl border border-light-error/25 bg-light-error/10 p-3 text-sm text-light-error dark:border-dark-error/25 dark:bg-dark-error/10 dark:text-dark-error"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0" />
					<span class="flex-1">{loadError}</span>
				</div>
			{/if}

			{#if hasMore}
				<div class="flex justify-center">
					<Button
						variant="outline"
						loading={isLoading}
						onclick={() => loadVales(categoriaId, currentPage + 1)}
						class="w-full sm:w-auto"
					>
						Ver más vales
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</MainLayout>
