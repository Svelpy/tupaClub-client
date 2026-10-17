<script lang="ts">
	import { Select } from '#lib/components/ui/index.ts';
	import { XIcon } from '#lib/icons/outline/index.ts';
	import type { Categoria, Negocio } from '#lib/interfaces/index.ts';

	interface Props {
		categorias: Categoria[];
		negocios: Negocio[];
		/** null = todas las categorías */
		categoriaId: string | null;
		/** null = todos los negocios */
		negocioId: string | null;
		/** Mientras se cargan las opciones de los selects */
		isLoadingOptions?: boolean;
		optionsError?: string;
		disabled?: boolean;
		onCategoriaChange: (categoriaId: string | null) => void;
		onNegocioChange: (negocioId: string | null) => void;
		onClear: () => void;
		onRetryOptions?: () => void;
	}

	let {
		categorias,
		negocios,
		categoriaId,
		negocioId,
		isLoadingOptions = false,
		optionsError = '',
		disabled = false,
		onCategoriaChange,
		onNegocioChange,
		onClear,
		onRetryOptions
	}: Props = $props();

	const byNombre = (a: { nombre: string }, b: { nombre: string }) =>
		a.nombre.localeCompare(b.nombre, 'es');

	const sortedCategorias = $derived([...categorias].sort(byNombre));
	const sortedNegocios = $derived([...negocios].sort(byNombre));
	const isFiltered = $derived(!!categoriaId || !!negocioId);
	const selectDisabled = $derived(disabled || isLoadingOptions);

	const toValue = (event: Event & { currentTarget: HTMLSelectElement }) =>
		event.currentTarget.value || null;
</script>

<div class="mt-6 space-y-2">
	<div class="grid gap-3 sm:grid-cols-2 lg:flex lg:items-end">
		<div class="flex flex-col gap-1 lg:w-64">
			<label for="vales-negocio" class="text-sm font-medium text-light-two dark:text-dark-two">
				Negocio
			</label>
			<Select
				id="vales-negocio"
				value={negocioId ?? ''}
				onchange={(event) => onNegocioChange(toValue(event))}
				disabled={selectDisabled}
			>
				<option value="">{isLoadingOptions ? 'Cargando…' : 'Todos'}</option>
				{#each sortedNegocios as negocio (negocio.id)}
					<option value={negocio.id}>{negocio.nombre}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-col gap-1 lg:w-64">
			<label for="vales-categoria" class="text-sm font-medium text-light-two dark:text-dark-two">
				Categoría
			</label>
			<Select
				id="vales-categoria"
				value={categoriaId ?? ''}
				onchange={(event) => onCategoriaChange(toValue(event))}
				disabled={selectDisabled}
			>
				<option value="">{isLoadingOptions ? 'Cargando…' : 'Todas'}</option>
				{#each sortedCategorias as categoria (categoria.id)}
					<option value={categoria.id}>{categoria.nombre}</option>
				{/each}
			</Select>
		</div>

		{#if isFiltered}
			<button
				type="button"
				onclick={onClear}
				{disabled}
				class="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none disabled:opacity-50 sm:col-span-2 sm:justify-self-start dark:text-dark-four dark:hover:bg-dark-one_d dark:hover:text-dark-two"
			>
				<XIcon class="size-4" />
				Limpiar filtros
			</button>
		{/if}
	</div>

	{#if optionsError}
		<p role="alert" class="text-sm text-light-error dark:text-dark-error">
			No se pudieron cargar los filtros: {optionsError}
			{#if onRetryOptions}
				<button
					type="button"
					onclick={onRetryOptions}
					class="ml-1 font-medium underline underline-offset-2"
				>
					Reintentar
				</button>
			{/if}
		</p>
	{/if}
</div>
