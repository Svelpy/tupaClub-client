<script lang="ts">
	import type { Component } from 'svelte';
	import {
		NegocioAvatar,
		NegocioTipoBadge
	} from '#lib/components/features/panel/negocios/index.ts';
	import { BuildindStoreIcon, MapPinIcon, PhoneIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, Sucursal } from '#lib/interfaces/index.ts';
	import { formatValue, getSucursalMapsUrl } from '#lib/utils/index.ts';

	interface Props {
		negocio: Negocio | null;
		sucursal: Sucursal | null;
	}

	let { negocio, sucursal }: Props = $props();

	type IconComponent = Component<{ class?: string }>;
</script>

{#snippet field(label: string, Icon: IconComponent, content: string | null, href?: string)}
	<div class="flex min-w-0 gap-3">
		<span
			class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
			aria-hidden="true"
		>
			<Icon class="size-4" />
		</span>
		<div class="min-w-0">
			<p class="text-xs text-light-two_d dark:text-dark-two_d">{label}</p>
			<div class="text-sm font-medium break-words text-light-two dark:text-dark-two">
				{#if href && content}
					<a {href} class="text-light-three hover:underline dark:text-dark-three">
						{content}
					</a>
				{:else}
					{formatValue(content)}
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<!-- Dónde trabaja el usuario del panel. Los clientes no tienen negocio ni sucursal -->
<section
	aria-labelledby="perfil-sucursal"
	class="rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<h2 id="perfil-sucursal" class="font-semibold text-light-two dark:text-dark-two">
		Negocio y sucursal
	</h2>

	{#if negocio}
		<div class="mt-4 flex items-center gap-3">
			<NegocioAvatar {negocio} />
			<div class="min-w-0">
				<p class="truncate font-medium text-light-two dark:text-dark-two">{negocio.nombre}</p>
				<NegocioTipoBadge tipo={negocio.tipo} class="mt-0.5" />
			</div>
		</div>
	{/if}

	{#if sucursal}
		<div
			class={[
				'space-y-4',
				negocio ? 'mt-4 border-t border-light-one_d pt-4 dark:border-dark-one_d' : 'mt-4'
			]}
		>
			{@render field('Sucursal', BuildindStoreIcon, sucursal.nombre)}
			<div class="space-y-1">
				{@render field('Dirección', MapPinIcon, sucursal.direccion)}
				<a
					href={getSucursalMapsUrl(sucursal)}
					target="_blank"
					rel="noopener noreferrer"
					class="ml-12 inline-block text-sm font-medium text-light-three hover:underline dark:text-dark-three"
				>
					Ver en el mapa
				</a>
			</div>
			{@render field(
				'Teléfono',
				PhoneIcon,
				sucursal.telefono,
				sucursal.telefono ? `tel:${sucursal.telefono}` : undefined
			)}
		</div>
	{/if}
</section>
