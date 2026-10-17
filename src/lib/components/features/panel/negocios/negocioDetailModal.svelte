<script lang="ts">
	import type { Component } from 'svelte';
	import { Button, Image, Modal } from '#lib/components/ui/index.ts';
	import {
		BuildindStoreIcon,
		CalendarIcon,
		CopyIcon,
		HashIcon,
		PencilIcon,
		PhoneIcon,
		PhotoIcon,
		PlusIcon
	} from '#lib/icons/outline/index.ts';
	import type { Negocio, NegocioListItem } from '#lib/interfaces/index.ts';
	import { alert, formatDateTime, formatValue } from '#lib/utils/index.ts';
	import NegocioAvatar from './negocioAvatar.svelte';
	import NegocioSucursales from './negocioSucursales.svelte';
	import NegocioTipoBadge from './negocioTipoBadge.svelte';

	interface Props {
		/** Negocio con sus sucursales; null = modal cerrado */
		item: NegocioListItem | null;
		onClose: () => void;
		onEdit: (negocio: Negocio) => void;
		onImage: (negocio: Negocio) => void;
		onAddSucursal: (negocio: Negocio) => void;
	}

	let { item, onClose, onEdit, onImage, onAddSucursal }: Props = $props();

	type IconComponent = Component<{ class?: string }>;

	const negocio = $derived(item?.negocio ?? null);
	const sucursales = $derived(item?.sucursales ?? []);
	const sucursalesLabel = $derived(
		sucursales.length === 0
			? 'Sin sucursales'
			: `${sucursales.length} ${sucursales.length === 1 ? 'sucursal' : 'sucursales'}`
	);

	async function copyId() {
		if (!negocio) return;
		try {
			await navigator.clipboard.writeText(negocio.id);
			alert('success', 'ID copiado al portapapeles.');
		} catch {
			alert('error', 'No se pudo copiar el ID.');
		}
	}

	function handleEdit() {
		if (!negocio) return;
		const target = negocio;
		onClose();
		onEdit(target);
	}
</script>

{#snippet sectionTitle(text: string)}
	<h4 class="text-xs font-semibold tracking-wide text-light-two_d uppercase dark:text-dark-two_d">
		{text}
	</h4>
{/snippet}

{#snippet field(label: string, value: string | null, Icon: IconComponent, tel = false)}
	<div class="flex min-w-0 gap-3">
		<span
			class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
			aria-hidden="true"
		>
			<Icon class="size-4" />
		</span>
		<div class="min-w-0">
			<p class="text-xs text-light-two_d dark:text-dark-two_d">{label}</p>
			{#if tel && value}
				<a
					href="tel:{value}"
					class="block text-sm font-medium break-words text-light-three hover:underline dark:text-dark-three"
				>
					{value}
				</a>
			{:else}
				<p class="text-sm font-medium break-words text-light-two dark:text-dark-two">
					{formatValue(value)}
				</p>
			{/if}
		</div>
	</div>
{/snippet}

<Modal
	isOpen={!!negocio}
	title="Detalle del negocio"
	{onClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[44rem]"
>
	{#if negocio}
		<div class="space-y-6">
			<!-- Imagen del negocio (o avatar con iniciales si no tiene) -->
			{#if negocio.image_url}
				<div class="relative">
					<a
						href={negocio.image_url}
						target="_blank"
						rel="noopener noreferrer"
						title="Ver imagen en tamaño completo"
						class="block h-44 overflow-hidden rounded-2xl border border-light-one_d focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none sm:h-56 dark:border-dark-one_d dark:focus-visible:ring-dark-three"
					>
						<Image src={negocio.image_url} alt="Imagen de {negocio.nombre}" />
					</a>
					<button
						type="button"
						onclick={() => onImage(negocio)}
						class="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-lg bg-light-one/90 px-2.5 py-1.5 text-xs font-medium text-light-two shadow-sm backdrop-blur transition-colors hover:bg-light-one focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:bg-dark-one/90 dark:text-dark-two dark:hover:bg-dark-one dark:focus-visible:ring-dark-three"
					>
						<PhotoIcon class="size-4" />
						Cambiar imagen
					</button>
				</div>
			{/if}

			<!-- Resumen -->
			<div class="flex items-start gap-4">
				{#if !negocio.image_url}
					<NegocioAvatar {negocio} size="lg" />
				{/if}
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<p class="text-lg font-semibold break-words text-light-two dark:text-dark-two">
							{negocio.nombre}
						</p>
						<NegocioTipoBadge tipo={negocio.tipo} />
					</div>
					<p class="mt-1 text-sm whitespace-pre-line text-light-two_d dark:text-dark-two_d">
						{formatValue(negocio.descripcion, { fallback: 'Sin descripción.' })}
					</p>
					{#if !negocio.image_url}
						<button
							type="button"
							onclick={() => onImage(negocio)}
							class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-light-three hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-three"
						>
							<PhotoIcon class="size-4" />
							Agregar imagen
						</button>
					{/if}
				</div>
			</div>

			<section class="space-y-3">
				{@render sectionTitle('Información')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Teléfono', negocio.telefono, PhoneIcon, true)}
					{@render field('Sucursales', sucursalesLabel, BuildindStoreIcon)}
					{@render field('Fecha de registro', formatDateTime(negocio.created_at), CalendarIcon)}
					{@render field(
						'Última actualización',
						negocio.updated_at ? formatDateTime(negocio.updated_at) : null,
						CalendarIcon
					)}

					<div class="flex min-w-0 gap-3 sm:col-span-2">
						<span
							class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
							aria-hidden="true"
						>
							<HashIcon class="size-4" />
						</span>
						<div class="min-w-0 flex-1">
							<p class="text-xs text-light-two_d dark:text-dark-two_d">ID del negocio</p>
							<div class="flex items-center gap-1">
								<p
									class="truncate font-mono text-xs text-light-two dark:text-dark-two"
									title={negocio.id}
								>
									{negocio.id}
								</p>
								<button
									type="button"
									onclick={copyId}
									aria-label="Copiar ID del negocio"
									title="Copiar ID"
									class="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-light-two_d transition-colors hover:bg-light-one_d hover:text-light-two focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:text-dark-two_d dark:hover:bg-dark-one_d dark:hover:text-dark-two dark:focus-visible:ring-dark-three"
								>
									<CopyIcon class="size-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="space-y-3">
				<div class="flex items-center justify-between gap-2">
					{@render sectionTitle(`Sucursales (${sucursales.length})`)}
					{#if sucursales.length > 0}
						<button
							type="button"
							onclick={() => onAddSucursal(negocio)}
							class="inline-flex items-center gap-1 text-sm font-medium text-light-three hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-three"
						>
							<PlusIcon class="size-4" />
							Agregar
						</button>
					{/if}
				</div>
				<NegocioSucursales
					{sucursales}
					onAdd={() => onAddSucursal(negocio)}
					class="sm:grid-cols-2"
				/>
			</section>
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button variant="outline" onclick={onClose} class="w-full sm:w-auto">Cerrar</Button>
			<Button onclick={handleEdit} class="w-full sm:w-auto">
				{#snippet leftIcon()}<PencilIcon class="size-4" />{/snippet}
				Editar negocio
			</Button>
		</div>
	{/snippet}
</Modal>
