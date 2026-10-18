<script lang="ts">
	import type { User } from '#lib/interfaces/index.ts';
	import { formatDate, formatDateTime, formatFullName, formatNumber } from '#lib/utils/index.ts';
	import PerfilAvatarEditor from './perfilAvatarEditor.svelte';

	interface Props {
		user: User;

		showPuntos?: boolean;
		onUpdated: (user: User) => void;
	}

	let { user, showPuntos = false, onUpdated }: Props = $props();
</script>

<section
	aria-labelledby="perfil-nombre"
	class="rounded-2xl border border-light-one_d bg-light-one p-5 text-center md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<PerfilAvatarEditor {user} {onUpdated} />

	<h2
		id="perfil-nombre"
		class="mt-4 text-xl font-bold wrap-break-word text-light-two dark:text-dark-two"
	>
		{formatFullName(user)}
	</h2>
	<p class="text-sm text-light-two_d dark:text-dark-two_d">CI {user.ci}</p>

	{#if showPuntos}
		<div class="mt-5 rounded-xl bg-light-one_d/50 px-4 py-3 dark:bg-dark-one_d/50">
			<p class="text-3xl leading-none font-bold text-light-three dark:text-dark-three">
				{formatNumber(user.puntos)}
			</p>
			<p class="mt-1 text-xs text-light-two_d dark:text-dark-two_d">puntos disponibles</p>
		</div>
	{/if}

	<dl
		class="mt-5 space-y-2 border-t border-light-one_d pt-4 text-left text-sm dark:border-dark-one_d"
	>
		<div class="flex justify-between gap-3">
			<dt class="text-light-two_d dark:text-dark-two_d">Miembro desde</dt>
			<dd class="text-right font-medium text-light-two dark:text-dark-two">
				{formatDate(user.created_at)}
			</dd>
		</div>
		<div class="flex justify-between gap-3">
			<dt class="text-light-two_d dark:text-dark-two_d">Última actualización</dt>
			<dd class="text-right font-medium text-light-two dark:text-dark-two">
				{formatDateTime(user.updated_at ?? undefined)}
			</dd>
		</div>
	</dl>
</section>
