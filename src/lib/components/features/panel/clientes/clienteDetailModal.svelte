<script lang="ts">
	import type { Component } from 'svelte';
	import { Badge, Button, Modal } from '#lib/components/ui/index.ts';
	import { USER_GENERO_LABEL } from '#lib/constants/index.ts';
	import {
		BuildindStoreIcon,
		CalendarIcon,
		CopyIcon,
		CreditCardIcon,
		HashIcon,
		MailIcon,
		MapPinIcon,
		PencilIcon,
		PhoneIcon,
		UserIcon
	} from '#lib/icons/outline/index.ts';
	import type { Cliente } from '#lib/interfaces/index.ts';
	import {
		alert,
		formatAge,
		formatDate,
		formatDateTime,
		formatNumber,
		formatValue
	} from '#lib/utils/index.ts';
	import ClienteAvatar from './clienteAvatar.svelte';

	interface Props {
		/** Cliente a mostrar; null = modal cerrado */
		cliente: Cliente | null;
		onClose: () => void;
		/** Sin handler (el rol no puede editar) no se muestra el botón */
		onEdit?: (cliente: Cliente) => void;
	}

	let { cliente, onClose, onEdit }: Props = $props();

	type IconComponent = Component<{ class?: string }>;

	const fullName = $derived(cliente ? `${cliente.nombre} ${cliente.apellidos ?? ''}`.trim() : '');
	const roleLabel = $derived(
		cliente ? cliente.role.charAt(0) + cliente.role.slice(1).toLowerCase() : ''
	);
	const generoLabel = $derived(
		cliente?.genero
			? (USER_GENERO_LABEL[cliente.genero as keyof typeof USER_GENERO_LABEL] ?? cliente.genero)
			: null
	);
	const birthDateLabel = $derived(
		cliente?.birth_date
			? `${formatDate(cliente.birth_date)} · ${formatAge(cliente.birth_date)}`
			: null
	);

	async function copyId() {
		if (!cliente) return;
		try {
			await navigator.clipboard.writeText(cliente.id);
			alert('success', 'ID copiado al portapapeles.');
		} catch {
			alert('error', 'No se pudo copiar el ID.');
		}
	}

	function handleEdit() {
		if (!cliente || !onEdit) return;
		const target = cliente;
		onClose();
		onEdit(target);
	}
</script>

{#snippet sectionTitle(text: string)}
	<h4
		class="mb-3 text-xs font-semibold tracking-wide text-light-two_d uppercase dark:text-dark-two_d"
	>
		{text}
	</h4>
{/snippet}

{#snippet field(
	label: string,
	value: string | null,
	Icon: IconComponent,
	options: { link?: 'tel' | 'mailto'; fallback?: string; class?: string } = {}
)}
	<div class={['flex min-w-0 gap-3', options.class]}>
		<span
			class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
			aria-hidden="true"
		>
			<Icon class="size-4" />
		</span>
		<div class="min-w-0">
			<p class="text-xs text-light-two_d dark:text-dark-two_d">{label}</p>
			{#if options.link && value}
				<a
					href="{options.link}:{value}"
					class="block text-sm font-medium break-words text-light-three hover:underline dark:text-dark-three"
				>
					{value}
				</a>
			{:else}
				<p class="text-sm font-medium break-words text-light-two dark:text-dark-two">
					{formatValue(value, { fallback: options.fallback })}
				</p>
			{/if}
		</div>
	</div>
{/snippet}

<Modal
	isOpen={!!cliente}
	title="Detalle del cliente"
	{onClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[40rem]"
>
	{#if cliente}
		<div class="space-y-6">
			<!-- Resumen: avatar, nombre y puntos -->
			<div
				class="flex flex-col items-center gap-4 rounded-2xl border border-light-one_d bg-light-one_d/50 p-4 text-center sm:flex-row sm:text-left dark:border-dark-one_d dark:bg-dark-one_d/50"
			>
				{#if cliente.avatar_url}
					<a
						href={cliente.avatar_url}
						target="_blank"
						rel="noopener noreferrer"
						title="Ver foto en tamaño completo"
						class="rounded-full focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:focus-visible:ring-dark-three"
					>
						<ClienteAvatar {cliente} size="xl" />
					</a>
				{:else}
					<ClienteAvatar {cliente} size="xl" />
				{/if}

				<div class="min-w-0 flex-1">
					<p class="text-lg font-semibold break-words text-light-two dark:text-dark-two">
						{fullName}
					</p>
					<p class="text-sm text-light-two_d dark:text-dark-two_d">CI {cliente.ci}</p>
					<div class="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
						<Badge variant="info">{roleLabel}</Badge>
						{#if !cliente.avatar_url}
							<Badge variant="outline">Sin foto de perfil</Badge>
						{/if}
					</div>
				</div>

				<div
					class="shrink-0 rounded-xl bg-light-one px-5 py-3 text-center shadow-sm dark:bg-dark-one"
				>
					<p class="text-2xl leading-none font-bold text-light-three dark:text-dark-three">
						{formatNumber(cliente.puntos)}
					</p>
					<p class="mt-1 text-xs text-light-two_d dark:text-dark-two_d">puntos</p>
				</div>
			</div>

			<section>
				{@render sectionTitle('Contacto')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Teléfono', cliente.telefono, PhoneIcon, { link: 'tel' })}
					{@render field('Correo electrónico', cliente.email, MailIcon, { link: 'mailto' })}
					{@render field('Dirección', cliente.direccion, MapPinIcon, {
						class: 'sm:col-span-2'
					})}
				</div>
			</section>

			<section>
				{@render sectionTitle('Datos personales')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Cédula de identidad', cliente.ci, CreditCardIcon)}
					{@render field('Género', generoLabel, UserIcon)}
					{@render field('Fecha de nacimiento', birthDateLabel, CalendarIcon)}
				</div>
			</section>

			<section>
				{@render sectionTitle('Registro')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Sucursal de registro', cliente.sucursal_id, BuildindStoreIcon, {
						fallback: 'Sin sucursal asignada'
					})}
					{@render field('Fecha de registro', formatDateTime(cliente.created_at), CalendarIcon)}
					{@render field(
						'Última actualización',
						formatDateTime(cliente.updated_at ?? undefined),
						CalendarIcon
					)}

					<div class="flex min-w-0 gap-3">
						<span
							class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
							aria-hidden="true"
						>
							<HashIcon class="size-4" />
						</span>
						<div class="min-w-0 flex-1">
							<p class="text-xs text-light-two_d dark:text-dark-two_d">ID del cliente</p>
							<div class="flex items-center gap-1">
								<p
									class="truncate font-mono text-xs text-light-two dark:text-dark-two"
									title={cliente.id}
								>
									{cliente.id}
								</p>
								<button
									type="button"
									onclick={copyId}
									aria-label="Copiar ID del cliente"
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
		</div>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button variant="outline" onclick={onClose} class="w-full sm:w-auto">Cerrar</Button>
			{#if onEdit}
				<Button onclick={handleEdit} class="w-full sm:w-auto">
					{#snippet leftIcon()}<PencilIcon class="size-4" />{/snippet}
					Editar cliente
				</Button>
			{/if}
		</div>
	{/snippet}
</Modal>
