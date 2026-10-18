<script lang="ts">
	import { Sheet } from '#lib/components/ui/index.ts';
	import { MapPinIcon, PhoneIcon } from '#lib/icons/outline/index.ts';
	import type { Negocio, Sucursal } from '#lib/interfaces/index.ts';
	import { getSucursalMapsUrl } from '#lib/utils/index.ts';

	interface Props {
		open: boolean;
		negocio: Negocio;
		sucursales: Sucursal[];
		onClose: () => void;
	}

	let { open, negocio, sucursales, onClose }: Props = $props();

	const description = $derived(
		`${sucursales.length} ${sucursales.length === 1 ? 'sucursal' : 'sucursales'} de ${negocio.nombre}`
	);
</script>

<Sheet {open} title="Dónde canjear" {description} {onClose}>
	<ul class="space-y-3">
		{#each sucursales as sucursal (sucursal.id)}
			<li class="rounded-2xl border border-light-one_d p-4 dark:border-dark-one_d">
				<div class="flex gap-3">
					<span
						class="flex size-10 shrink-0 items-center justify-center rounded-full bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
					>
						<MapPinIcon class="size-5" />
					</span>
					<div class="min-w-0 flex-1 space-y-0.5">
						<p class="font-semibold text-light-two dark:text-dark-two">{sucursal.nombre}</p>
						<p class="text-sm text-light-two_d dark:text-dark-two_d">{sucursal.direccion}</p>
						{#if sucursal.telefono}
							<a
								href="tel:{sucursal.telefono}"
								class="inline-flex items-center gap-1 pt-0.5 text-sm font-medium text-light-three hover:underline dark:text-dark-three"
							>
								<PhoneIcon class="size-4" />
								{sucursal.telefono}
							</a>
						{/if}
					</div>
				</div>

				<a
					href={getSucursalMapsUrl(sucursal)}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full border border-light-three/20 text-sm font-semibold text-light-three transition-colors hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-[0.98] dark:border-dark-three/20 dark:text-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three/40"
				>
					<MapPinIcon class="size-4" />
					Cómo llegar
					<span class="sr-only">a {sucursal.nombre} (abre Google Maps)</span>
				</a>
			</li>
		{/each}
	</ul>
</Sheet>
