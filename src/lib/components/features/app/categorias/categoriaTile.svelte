<script lang="ts">
	import { resolve } from '$app/paths';
	import { CategoriaIcon } from '#lib/components/features/panel/categorias/index.ts';
	import type { Categoria } from '#lib/interfaces/index.ts';

	interface Props {
		categoria: Categoria;
	}

	let { categoria }: Props = $props();
</script>

<a
	href={resolve('/app/categorias/[categoriaId]', { categoriaId: categoria.id })}
	class="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-light-one_d bg-light-one p-4 transition-[background-color,transform] [-webkit-tap-highlight-color:transparent] hover:bg-light-one_d/40 focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-95 dark:border-dark-one_d dark:bg-dark-one dark:hover:bg-dark-one_d/40 dark:focus-visible:ring-dark-three/40"
>
	<CategoriaIcon iconNumber={categoria.icon_number} class="size-12 rounded-full" />
	<span
		class="line-clamp-2 flex min-h-8 items-center text-center text-xs leading-tight font-medium text-light-two dark:text-dark-two"
	>
		{categoria.nombre}
	</span>
</a>
