<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '#lib/components/ui/index.ts';
	import { ShoppingCartIcon } from '#lib/icons/outline/index.ts';
</script>

<!-- Tarea principal del cajero, siempre a un toque desde su inicio -->
<section
	aria-labelledby="registrar-compra-cta"
	class="flex flex-col gap-4 rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<span
		class="flex size-11 items-center justify-center rounded-xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
	>
		<ShoppingCartIcon class="size-6" />
	</span>
	<div>
		<h2 id="registrar-compra-cta" class="font-semibold text-light-two dark:text-dark-two">
			Registrar una compra
		</h2>
		<p class="mt-1 text-sm text-light-two_d dark:text-dark-two_d">
			Busca al cliente por su CI y suma los puntos de su compra.
		</p>
	</div>
	<Button fullWidth href={resolve('/panel/registrar-compra')} class="mt-auto">
		Registrar compra
	</Button>
</section>
