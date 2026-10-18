<script lang="ts">
	import { page } from '$app/state';
	import type { ClientNavItem } from '#lib/interfaces/index.ts';
	import { isNavItemActive } from '#lib/utils/index.ts';

	interface Props {
		items: ClientNavItem[];
	}

	let { items }: Props = $props();

	// Como en las apps nativas: tocar la pestaña en la que ya estás vuelve al inicio de la página
	function handleClick(event: MouseEvent, active: boolean) {
		if (!active) return;
		event.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<!-- Solo móvil. Respeta la zona segura inferior (barra de gestos del iPhone) -->
<nav
	aria-label="Navegación principal"
	class="fixed inset-x-0 bottom-0 z-40 border-t border-light-one_d bg-light-one/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg [view-transition-name:client-tab-bar] md:hidden dark:border-dark-one_d dark:bg-dark-one/85"
>
	<ul class="mx-auto flex h-16 max-w-lg items-stretch">
		{#each items as item (item.id)}
			{@const active = isNavItemActive(item, page.url.pathname)}
			<li class="flex-1">
				<a
					href={item.href}
					aria-current={active ? 'page' : undefined}
					onclick={(event) => handleClick(event, active)}
					class="group flex h-full flex-col items-center justify-center gap-1 select-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-none"
				>
					<!-- Indicador tipo Material 3: pastilla detrás del icono activo -->
					<span
						class={[
							'flex h-8 w-14 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 ease-out group-focus-visible:ring-2 group-focus-visible:ring-light-three/40 group-active:scale-90 dark:group-focus-visible:ring-dark-three/40',
							active
								? 'bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three'
								: 'text-light-two_d dark:text-dark-two_d'
						]}
					>
						<item.icon class="size-6" />
					</span>
					<span
						class={[
							'text-[11px] leading-none transition-colors',
							active
								? 'font-semibold text-light-three dark:text-dark-three'
								: 'font-medium text-light-two_d dark:text-dark-two_d'
						]}
					>
						{item.shortLabel}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
