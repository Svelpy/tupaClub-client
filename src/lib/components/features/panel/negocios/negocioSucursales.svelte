<script lang="ts">
	import {
		ArrowUpRightIcon,
		MapPinIcon,
		PencilIcon,
		PhoneIcon,
		PlusIcon,
		TrashIcon
	} from '#lib/icons/outline/index.ts';
	import type { Sucursal } from '#lib/interfaces/index.ts';
	import { cn, formatDate } from '#lib/utils/index.ts';

	interface Props {
		sucursales: Sucursal[];
		/** Si se pasa, el estado vacío muestra un botón para agregar la primera sucursal */
		onAdd?: () => void;
		/** Si se pasan, cada sucursal muestra botones para editarla o eliminarla */
		onEdit?: (sucursal: Sucursal) => void;
		onDelete?: (sucursal: Sucursal) => void;
		/** Clases del grid (p. ej. columnas por breakpoint) */
		class?: string;
	}

	let { sucursales, onAdd, onEdit, onDelete, class: className }: Props = $props();

	const actionClass =
		'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-light-two_d transition-colors focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:text-dark-two_d dark:focus-visible:ring-dark-three';

	// Solo se enlazan URLs http(s) para no abrir esquemas inesperados
	const isSafeUrl = (url: string | null): url is string => !!url && /^https?:\/\//i.test(url);
</script>

{#if sucursales.length === 0}
	<div
		class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-light-four px-4 py-6 text-center dark:border-dark-four"
	>
		<MapPinIcon class="size-6 text-light-four dark:text-dark-four" />
		<p class="text-sm text-light-two_d dark:text-dark-two_d">
			Este negocio aún no tiene sucursales.
		</p>
		{#if onAdd}
			<button
				type="button"
				onclick={onAdd}
				class="inline-flex items-center gap-1.5 text-sm font-medium text-light-three hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-three"
			>
				<PlusIcon class="size-4" />
				Agregar la primera sucursal
			</button>
		{/if}
	</div>
{:else}
	<ul class={cn('grid gap-2', className)}>
		{#each sucursales as sucursal (sucursal.id)}
			<li
				class="flex min-w-0 gap-3 rounded-xl border border-light-one_d bg-light-one p-3 dark:border-dark-one_d dark:bg-dark-one"
			>
				<span
					class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
					aria-hidden="true"
				>
					<MapPinIcon class="size-4" />
				</span>
				<div class="min-w-0 flex-1 space-y-1">
					<div class="flex items-start gap-1">
						<p
							class="min-w-0 flex-1 truncate pt-0.5 text-sm font-semibold text-light-two dark:text-dark-two"
						>
							{sucursal.nombre}
						</p>
						{#if onEdit || onDelete}
							<div class="-mt-1.5 -mr-1.5 flex shrink-0 items-center">
								{#if onEdit}
									<button
										type="button"
										onclick={() => onEdit(sucursal)}
										title="Editar sucursal"
										aria-label="Editar sucursal {sucursal.nombre}"
										class="{actionClass} hover:bg-light-one_d hover:text-light-two dark:hover:bg-dark-one_d dark:hover:text-dark-two"
									>
										<PencilIcon class="size-4" />
									</button>
								{/if}
								{#if onDelete}
									<button
										type="button"
										onclick={() => onDelete(sucursal)}
										title="Eliminar sucursal"
										aria-label="Eliminar sucursal {sucursal.nombre}"
										class="{actionClass} hover:bg-light-error/10 hover:text-light-error dark:hover:bg-dark-error/10 dark:hover:text-dark-error"
									>
										<TrashIcon class="size-4" />
									</button>
								{/if}
							</div>
						{/if}
					</div>
					<p class="line-clamp-2 text-xs text-light-two_d dark:text-dark-two_d">
						{sucursal.direccion}
					</p>
					<div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs">
						{#if sucursal.telefono}
							<a
								href="tel:{sucursal.telefono}"
								class="inline-flex items-center gap-1 font-medium text-light-three hover:underline dark:text-dark-three"
							>
								<PhoneIcon class="size-3.5" />
								{sucursal.telefono}
							</a>
						{/if}
						{#if isSafeUrl(sucursal.url_ubicacion)}
							<a
								href={sucursal.url_ubicacion}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 font-medium text-light-three hover:underline dark:text-dark-three"
							>
								Ver ubicación
								<ArrowUpRightIcon class="size-3.5" />
								<span class="sr-only">(se abre en una pestaña nueva)</span>
							</a>
						{/if}
						<span class="text-light-two_d dark:text-dark-two_d">
							Desde {formatDate(sucursal.created_at)}
						</span>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
