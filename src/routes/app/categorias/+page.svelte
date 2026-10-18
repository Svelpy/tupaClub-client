<script lang="ts">
	import { onMount } from 'svelte';
	import { CategoriaTile } from '#lib/components/features/app/categorias/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { CategoriaGridSkeleton } from '#lib/components/skeletons/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { AlertTriangleIcon, RefreshIcon, TagIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria } from '#lib/interfaces/index.ts';
	import { categoriaService, errorService } from '#lib/services/index.ts';
	import { fetchAllPages } from '#lib/utils/index.ts';

	let categorias = $state<Categoria[]>([]);
	let isLoading = $state(false);
	let loadError = $state('');

	// Son pocas: se traen todas para mostrar la grilla completa sin paginar
	async function loadCategorias() {
		loadError = '';
		isLoading = true;
		try {
			categorias = await fetchAllPages((params) => categoriaService.list(params));
		} catch (error) {
			loadError = errorService.getMessage(error);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadCategorias);
</script>

<MainLayout title="Explorar">
	<p class="mb-4 text-light-two_d dark:text-dark-two_d">¿En qué quieres usar tus puntos?</p>

	{#if loadError && !isLoading}
		<div
			role="alert"
			class="flex flex-col items-center gap-3 rounded-3xl border border-light-one_d bg-light-one px-4 py-12 text-center dark:border-dark-one_d dark:bg-dark-one"
		>
			<AlertTriangleIcon class="size-10 text-light-error dark:text-dark-error" />
			<p class="text-sm text-light-two_d dark:text-dark-two_d">{loadError}</p>
			<Button variant="outline" size="sm" onclick={loadCategorias}>
				{#snippet leftIcon()}<RefreshIcon class="size-4" />{/snippet}
				Reintentar
			</Button>
		</div>
	{:else if isLoading && categorias.length === 0}
		<CategoriaGridSkeleton />
	{:else if categorias.length === 0}
		<div class="flex flex-col items-center gap-2 px-4 py-16 text-center">
			<TagIcon class="size-10 text-light-two_d dark:text-dark-two_d" />
			<p class="font-medium text-light-two dark:text-dark-two">Aún no hay categorías</p>
			<p class="text-sm text-light-two_d dark:text-dark-two_d">
				Pronto encontrarás aquí vales para canjear con tus puntos.
			</p>
		</div>
	{:else}
		<ul class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
			{#each categorias as categoria (categoria.id)}
				<li>
					<CategoriaTile {categoria} />
				</li>
			{/each}
		</ul>
	{/if}
</MainLayout>
