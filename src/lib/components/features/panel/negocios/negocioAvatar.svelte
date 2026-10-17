<script lang="ts">
	import { Image } from '#lib/components/ui/index.ts';
	import type { Negocio } from '#lib/interfaces/index.ts';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		negocio: Pick<Negocio, 'nombre' | 'image_url'>;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { negocio, size = 'md', class: className }: Props = $props();

	const sizes = {
		sm: 'size-9 text-xs rounded-lg',
		md: 'size-11 text-sm rounded-xl',
		lg: 'size-14 text-base rounded-2xl'
	} as const;

	// Iniciales de las dos primeras palabras como respaldo cuando no hay imagen
	const initials = $derived(
		negocio.nombre
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => word[0]?.toUpperCase() ?? '')
			.join('')
	);
</script>

<span
	class={cn(
		'inline-flex shrink-0 items-center justify-center overflow-hidden bg-light-one_d font-semibold text-light-three select-none dark:bg-dark-one_d dark:text-dark-three',
		sizes[size],
		className
	)}
>
	{#if negocio.image_url}
		<Image src={negocio.image_url} alt="Logo de {negocio.nombre}" />
	{:else}
		<span aria-hidden="true">{initials}</span>
	{/if}
</span>
