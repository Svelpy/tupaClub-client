<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Acción principal de la página (p. ej. el botón "Canjear por 500 pts") */
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<!--
	Acción principal de una página de detalle. En móvil queda fija abajo, en el lugar de las pestañas
	(al alcance del pulgar); en escritorio se muestra al final del contenido.
-->
<div class="h-24 md:hidden" aria-hidden="true"></div>
<div
	class="fixed inset-x-0 bottom-0 z-40 border-t border-light-one_d bg-light-one/85 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none dark:border-dark-one_d dark:bg-dark-one/85 md:dark:bg-transparent"
>
	<div class="mx-auto max-w-lg md:mx-0 md:max-w-none">
		{@render children()}
	</div>
</div>
