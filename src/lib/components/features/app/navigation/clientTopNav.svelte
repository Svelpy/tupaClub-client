<script lang="ts">
	import { goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DropdownMenu } from '#lib/components/ui/index.ts';
	import { APP_SITE_CONFIG } from '#lib/constants/index.ts';
	import { ChevronDownIcon, LogOutIcon, UserIcon } from '#lib/icons/outline/index.ts';
	import type { ClientNavItem, DropdownOption } from '#lib/interfaces/index.ts';
	import { authStore, currentUserStore } from '#lib/stores/index.ts';
	import { isNavItemActive } from '#lib/utils/index.ts';

	interface Props {
		/** Links de la barra (solo escritorio: en móvil son las pestañas inferiores) */
		items: ClientNavItem[];
		/** También se muestra en móvil: solo en las páginas raíz, las de detalle traen ClientDetailHeader */
		mobile?: boolean;
	}

	let { items, mobile = false }: Props = $props();

	let isUserMenuOpen = $state(false);
	let userMenuTrigger = $state<HTMLButtonElement>();

	const user = $derived($currentUserStore?.user);
	const initials = $derived(
		user ? `${user.nombre.charAt(0)}${user.apellidos?.charAt(0) ?? ''}`.toUpperCase() : ''
	);

	async function logout() {
		authStore.logout();
		await goto(resolve('/auth/sign-in'), { replaceState: true });
	}

	const userMenuOptions: DropdownOption[] = [
		{
			id: 'perfil',
			label: 'Mi perfil',
			icon: UserIcon,
			action: () => goto(resolve('/app/perfil'))
		},
		{ id: 'logout', label: 'Cerrar sesión', icon: LogOutIcon, action: logout }
	];
</script>

<!-- Logo y menú del usuario en móvil y escritorio; los links de navegación solo en escritorio -->
<header
	class={[
		'sticky top-0 z-30 border-b border-light-one_d bg-light-one/85 pt-[env(safe-area-inset-top)] backdrop-blur-lg [view-transition-name:client-top-nav] md:block dark:border-dark-one_d dark:bg-dark-one/85',
		!mobile && 'hidden'
	]}
>
	<div class="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:gap-6 md:px-6">
		<a href={resolve('/app')} class="flex min-w-0 items-center gap-2.5">
			<img
				src={asset('images/logo_app.webp')}
				alt=""
				width="32"
				height="32"
				class="size-8 shrink-0 rounded-lg"
			/>
			<span class="truncate text-base font-semibold text-light-two dark:text-dark-two">
				{APP_SITE_CONFIG.APP_NAME}
			</span>
		</a>

		<nav aria-label="Navegación principal" class="hidden flex-1 md:block">
			<ul class="flex items-center gap-1">
				{#each items as item (item.id)}
					{@const active = isNavItemActive(item, page.url.pathname)}
					<li>
						<a
							href={item.href}
							aria-current={active ? 'page' : undefined}
							class={[
								'inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none dark:focus-visible:ring-dark-three/40',
								active
									? 'bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three'
									: 'text-light-two_d hover:bg-light-one_d/60 hover:text-light-two dark:text-dark-two_d dark:hover:bg-dark-one_d/60 dark:hover:text-dark-two'
							]}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		{#if user}
			<button
				bind:this={userMenuTrigger}
				type="button"
				onclick={() => (isUserMenuOpen = !isUserMenuOpen)}
				aria-haspopup="menu"
				aria-expanded={isUserMenuOpen}
				aria-label="Menú de usuario"
				class="ml-auto flex shrink-0 items-center gap-1 rounded-full p-0.5 pr-1.5 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-95 dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three/40"
			>
				{#if user.avatar_url}
					<img src={user.avatar_url} alt="" class="size-9 rounded-full object-cover" />
				{:else}
					<span
						class="flex size-9 items-center justify-center rounded-full bg-light-three text-sm font-semibold text-light-one dark:bg-dark-three dark:text-dark-one"
					>
						{initials}
					</span>
				{/if}
				<ChevronDownIcon
					class="size-4 text-light-two_d transition-transform dark:text-dark-two_d {isUserMenuOpen
						? 'rotate-180'
						: ''}"
				/>
			</button>

			<DropdownMenu
				bind:isOpen={isUserMenuOpen}
				options={userMenuOptions}
				width={208}
				triggerElement={userMenuTrigger}
				class="mt-2"
			/>
		{/if}
	</div>
</header>
