<script lang="ts">
	import { ClienteAvatar } from '#lib/components/features/panel/clientes/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { LoaderIcon, TrashIcon } from '#lib/icons/outline/index.ts';
	import { CameraIcon } from '#lib/icons/solid/index.ts';
	import type { User } from '#lib/interfaces/index.ts';
	import { errorService, perfilService } from '#lib/services/index.ts';
	import { alert, validateSchema } from '#lib/utils/index.ts';
	import { PERFIL_AVATAR_TYPES, perfilAvatarSchema } from '#lib/zod/index.ts';

	interface Props {
		user: User;
		onUpdated: (user: User) => void;
	}

	let { user, onUpdated }: Props = $props();

	const INPUT_ID = 'perfil-avatar';

	let error = $state('');
	let isUploading = $state(false);
	let isRemoving = $state(false);
	let confirmRemove = $state(false);

	const isBusy = $derived(isUploading || isRemoving);

	// Se sube apenas se elige el archivo: elegir la foto ya es la confirmación
	async function handleFileChange(event: Event & { currentTarget: HTMLInputElement }) {
		const selected = event.currentTarget.files?.[0];
		// Permite volver a elegir el mismo archivo después de un error
		event.currentTarget.value = '';
		if (!selected) return;

		error = '';
		confirmRemove = false;

		const result = validateSchema(perfilAvatarSchema, { file: selected });
		if (!result.success) {
			error = result.errors.file ?? '';
			return;
		}

		isUploading = true;
		try {
			const updated = await perfilService.uploadAvatar(result.data.file);
			alert('success', 'Foto de perfil actualizada.');
			onUpdated(updated);
		} catch (err) {
			error = errorService.getMessage(err);
		} finally {
			isUploading = false;
		}
	}

	async function handleRemove() {
		error = '';
		isRemoving = true;
		try {
			const updated = await perfilService.deleteAvatar();
			alert('success', 'Foto de perfil eliminada.');
			onUpdated(updated);
		} catch (err) {
			error = errorService.getMessage(err);
		} finally {
			isRemoving = false;
			confirmRemove = false;
		}
	}
</script>

<div class="flex flex-col items-center gap-3">
	<div class="relative">
		<ClienteAvatar
			cliente={user}
			size="xl"
			class="size-28 text-3xl ring-4 ring-light-one_d dark:ring-dark-one_d"
		/>

		{#if isBusy}
			<span
				class="absolute inset-0 flex items-center justify-center rounded-full bg-light-black/50 text-light-one dark:bg-dark-black/50 dark:text-dark-one"
			>
				<LoaderIcon class="size-8 animate-spin" />
				<span class="sr-only">{isUploading ? 'Subiendo foto…' : 'Eliminando foto…'}</span>
			</span>
		{/if}

		<!-- El input va antes del botón: `peer` le pasa el foco de teclado al círculo visible -->
		<input
			id={INPUT_ID}
			type="file"
			accept={PERFIL_AVATAR_TYPES.join(',')}
			disabled={isBusy}
			onchange={handleFileChange}
			aria-describedby={error ? `${INPUT_ID}-error` : `${INPUT_ID}-hint`}
			aria-invalid={!!error}
			class="peer sr-only"
		/>
		<label
			for={INPUT_ID}
			title={user.avatar_url ? 'Cambiar foto' : 'Subir foto'}
			class={[
				'absolute right-0 bottom-0 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-light-one bg-light-three text-light-one shadow-md transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-light-three/40 hover:scale-105 active:scale-95 dark:border-dark-one dark:bg-dark-three dark:text-dark-one dark:peer-focus-visible:ring-dark-three/40',
				isBusy && 'pointer-events-none opacity-60'
			]}
		>
			<CameraIcon class="size-5" />
			<span class="sr-only">
				{user.avatar_url ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
			</span>
		</label>
	</div>

	{#if error}
		<p id="{INPUT_ID}-error" role="alert" class="text-sm text-light-error dark:text-dark-error">
			{error}
		</p>
	{/if}

	{#if user.avatar_url}
		{#if confirmRemove}
			<div
				class="w-full space-y-3 rounded-xl border border-light-error/40 bg-light-error/5 p-3 dark:border-dark-error/40 dark:bg-dark-error/5"
			>
				<p class="text-sm text-light-two dark:text-dark-two">
					¿Quitar tu foto? Se mostrarán tus iniciales.
				</p>
				<div class="flex gap-2">
					<Button
						variant="ghost"
						size="sm"
						onclick={() => (confirmRemove = false)}
						disabled={isRemoving}
						class="flex-1"
					>
						No
					</Button>
					<Button
						variant="danger"
						size="sm"
						onclick={handleRemove}
						loading={isRemoving}
						class="flex-1"
					>
						Sí, quitar
					</Button>
				</div>
			</div>
		{:else}
			<button
				type="button"
				onclick={() => (confirmRemove = true)}
				disabled={isBusy}
				class="inline-flex items-center gap-1.5 text-sm font-medium text-light-error hover:underline disabled:opacity-50 dark:text-dark-error"
			>
				<TrashIcon class="size-4" />
				Quitar foto
			</button>
		{/if}
	{/if}
</div>
