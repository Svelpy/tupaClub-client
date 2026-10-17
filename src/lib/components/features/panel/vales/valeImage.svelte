<script lang="ts">
	import { Image } from '#lib/components/ui/index.ts';
	import { TicketIcon } from '#lib/icons/outline/index.ts';
	import type { Vale } from '#lib/interfaces/index.ts';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		/** Sin image_url (p. ej. el vale de un canje) se muestra el icono */
		vale: Pick<Vale, 'nombre'> & Partial<Pick<Vale, 'image_url'>>;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { vale, size = 'md', class: className }: Props = $props();

	const sizes = {
		sm: 'size-9 rounded-lg',
		md: 'size-11 rounded-xl',
		lg: 'size-14 rounded-2xl'
	} as const;
</script>

<span
	class={cn(
		'inline-flex shrink-0 items-center justify-center overflow-hidden bg-light-one_d text-light-three select-none dark:bg-dark-one_d dark:text-dark-three',
		sizes[size],
		className
	)}
>
	{#if vale.image_url}
		<Image src={vale.image_url} alt="Imagen de {vale.nombre}" />
	{:else}
		<TicketIcon class="size-1/2" />
	{/if}
</span>
