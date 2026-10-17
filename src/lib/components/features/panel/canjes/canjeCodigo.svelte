<script lang="ts">
	import type { Canje } from '#lib/interfaces/index.ts';
	import { cn, maskCodigoCanje } from '#lib/utils/index.ts';

	interface Props {
		canje: Pick<Canje, 'codigo_canje' | 'status'>;
		class?: string;
	}

	let { canje, class: className }: Props = $props();

	// Con el código completo de un pendiente se podría confirmar el canje sin el cliente presente;
	// una vez cerrado ya no sirve para canjear y se muestra para poder rastrearlo
	const isHidden = $derived(canje.status === 'PENDIENTE');
</script>

<span
	class={cn(
		'font-mono tracking-wider whitespace-nowrap text-light-two tabular-nums dark:text-dark-two',
		className
	)}
	title={isHidden ? 'El código completo solo lo tiene el cliente' : undefined}
>
	{#if isHidden}
		<span aria-hidden="true">{maskCodigoCanje(canje.codigo_canje)}</span>
		<span class="sr-only">Código oculto, termina en {canje.codigo_canje.slice(-2)}</span>
	{:else}
		{canje.codigo_canje}
	{/if}
</span>
