<script lang="ts">
	import type { Component } from 'svelte';
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
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
		ShieldIcon,
		UserIcon
	} from '#lib/icons/outline/index.ts';
	import type { Administrador, SucursalConNegocio } from '#lib/interfaces/index.ts';
	import {
		alert,
		formatAge,
		formatDate,
		formatDateTime,
		formatRole,
		formatValue
	} from '#lib/utils/index.ts';

	interface Props {
		/** Usuario a mostrar; null = modal cerrado */
		administrador: Administrador | null;
		/** undefined si no tiene sucursal o aún no se cargó */
		sucursal?: SucursalConNegocio;
		/** El usuario es quien tiene la sesión iniciada */
		isCurrentUser?: boolean;
		onClose: () => void;
		/** Sin handler (sin permiso o rol no inferior) no se muestra el botón */
		onEdit?: (administrador: Administrador) => void;
	}

	let { administrador, sucursal, isCurrentUser = false, onClose, onEdit }: Props = $props();

	type IconComponent = Component<{ class?: string }>;

	const fullName = $derived(
		administrador ? `${administrador.nombre} ${administrador.apellidos ?? ''}`.trim() : ''
	);
	const generoLabel = $derived(
		administrador?.genero
			? (USER_GENERO_LABEL[administrador.genero as keyof typeof USER_GENERO_LABEL] ??
					administrador.genero)
			: null
	);
	const birthDateLabel = $derived(
		administrador?.birth_date
			? `${formatDate(administrador.birth_date)} · ${formatAge(administrador.birth_date)}`
			: null
	);
	const sucursalLabel = $derived(
		sucursal ? `${sucursal.sucursal.nombre} · ${sucursal.negocio.nombre}` : null
	);

	async function copyId() {
		if (!administrador) return;
		try {
			await navigator.clipboard.writeText(administrador.id);
			alert('success', 'ID copiado al portapapeles.');
		} catch {
			alert('error', 'No se pudo copiar el ID.');
		}
	}

	function handleEdit() {
		if (!administrador || !onEdit) return;
		const target = administrador;
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
	isOpen={!!administrador}
	title="Detalle del usuario"
	{onClose}
	maxWidth="mx-auto max-w-[calc(100vw-1.5rem)] sm:w-[40rem]"
>
	{#if administrador}
		<div class="space-y-6">
			<!-- Resumen: avatar, nombre y rol -->
			<div
				class="flex flex-col items-center gap-4 rounded-2xl border border-light-one_d bg-light-one_d/50 p-4 text-center sm:flex-row sm:text-left dark:border-dark-one_d dark:bg-dark-one_d/50"
			>
				<ClienteAvatar cliente={administrador} size="xl" />
				<div class="min-w-0 flex-1">
					<p class="text-lg font-semibold break-words text-light-two dark:text-dark-two">
						{fullName}
					</p>
					<p class="text-sm text-light-two_d dark:text-dark-two_d">CI {administrador.ci}</p>
					<div class="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
						<Badge variant="info">{formatRole(administrador.role)}</Badge>
						{#if isCurrentUser}
							<Badge variant="secondary">Tú</Badge>
						{/if}
					</div>
				</div>
			</div>

			<section>
				{@render sectionTitle('Acceso')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Rol', formatRole(administrador.role), ShieldIcon)}
					{@render field('Sucursal', sucursalLabel, BuildindStoreIcon, {
						fallback: 'Sin sucursal asignada'
					})}
				</div>
			</section>

			<section>
				{@render sectionTitle('Contacto')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Teléfono', administrador.telefono, PhoneIcon, { link: 'tel' })}
					{@render field('Correo electrónico', administrador.email, MailIcon, { link: 'mailto' })}
					{@render field('Dirección', administrador.direccion, MapPinIcon, {
						class: 'sm:col-span-2'
					})}
				</div>
			</section>

			<section>
				{@render sectionTitle('Datos personales')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field('Cédula de identidad', administrador.ci, CreditCardIcon)}
					{@render field('Género', generoLabel, UserIcon)}
					{@render field('Fecha de nacimiento', birthDateLabel, CalendarIcon)}
				</div>
			</section>

			<section>
				{@render sectionTitle('Registro')}
				<div class="grid gap-4 sm:grid-cols-2">
					{@render field(
						'Fecha de registro',
						formatDateTime(administrador.created_at),
						CalendarIcon
					)}
					{@render field(
						'Última actualización',
						formatDateTime(administrador.updated_at ?? undefined),
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
							<p class="text-xs text-light-two_d dark:text-dark-two_d">ID del usuario</p>
							<div class="flex items-center gap-1">
								<p
									class="truncate font-mono text-xs text-light-two dark:text-dark-two"
									title={administrador.id}
								>
									{administrador.id}
								</p>
								<button
									type="button"
									onclick={copyId}
									aria-label="Copiar ID del usuario"
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
					Editar usuario
				</Button>
			{/if}
		</div>
	{/snippet}
</Modal>
