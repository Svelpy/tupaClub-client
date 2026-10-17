<script lang="ts">
	import { Image } from '#lib/components/ui/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		cliente: Pick<Cliente, 'nombre' | 'apellidos' | 'avatar_url'>;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
	}

	let { cliente, size = 'md', class: className }: Props = $props();

	const sizes = {
		sm: 'size-9 text-xs',
		md: 'size-11 text-sm',
		lg: 'size-14 text-base',
		xl: 'size-20 text-2xl'
	} as const;

	// Inicial del nombre y de los apellidos como respaldo cuando no hay foto
	const initials = $derived(
		`${cliente.nombre.trim().charAt(0)}${cliente.apellidos?.trim().charAt(0) ?? ''}`.toUpperCase()
	);
</script>

<span
	class={cn(
		'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-light-one_d font-semibold text-light-three select-none dark:bg-dark-one_d dark:text-dark-three',
		sizes[size],
		className
	)}
>
	{#if cliente.avatar_url}
		<Image src={cliente.avatar_url} alt="Foto de {cliente.nombre}" />
	{:else}
		<span aria-hidden="true">{initials}</span>
	{/if}
</span>
