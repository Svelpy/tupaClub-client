<script lang="ts">
	import { goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import { ChevronDownIcon, LogOutIcon, Menu2Icon } from '#lib/icons/outline/index.ts';
	import type { DropdownOption } from '#lib/interfaces/index.ts';
	import { authStore, currentUserStore } from '#lib/stores/index.ts';
	import DropdownMenu from './dropdownMenu.svelte';

	interface Props {
		/** Título de la sección actual */
		title: string;
		/** Estado del sidebar en móvil, para aria-expanded del botón de menú */
		sidebarOpen: boolean;
		/** id del sidebar que controla el botón de menú */
		sidebarId: string;
		onToggleSidebar: () => void;
	}

	let { title, sidebarOpen, sidebarId, onToggleSidebar }: Props = $props();

	let isUserMenuOpen = $state(false);
	let userMenuTrigger = $state<HTMLButtonElement>();

	const user = $derived($currentUserStore?.user);
	const fullName = $derived(user ? `${user.nombre} ${user.apellidos ?? ''}`.trim() : '');
	const initials = $derived(
		user ? `${user.nombre.charAt(0)}${user.apellidos?.charAt(0) ?? ''}`.toUpperCase() : ''
	);
	// Socio: nombre del negocio. Resto: rol del usuario
	const subtitle = $derived(
		$currentUserStore?.negocio?.nombre ??
			(user ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : '')
	);

	async function logout() {
		authStore.logout();
		await goto(resolve('/auth/sign-in'), { replaceState: true });
	}

	const userMenuOptions: DropdownOption[] = [
		{ id: 'logout', label: 'Cerrar sesión', icon: LogOutIcon, action: logout }
	];
</script>

<header
	class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-light-four/30 bg-light-one/85 px-4 backdrop-blur md:px-6 lg:px-8 dark:border-dark-one_d dark:bg-dark-one/85"
>
	<button
		type="button"
		onclick={onToggleSidebar}
		aria-controls={sidebarId}
		aria-expanded={sidebarOpen}
		aria-label="Abrir menú"
		class="-ml-1.5 rounded-lg p-1.5 text-light-two transition-colors hover:bg-light-one_d lg:hidden dark:text-dark-two dark:hover:bg-dark-one_d"
	>
		<Menu2Icon class="size-6" />
	</button>

	<img
		src={asset('images/logo_app.webp')}
		alt=""
		width="32"
		height="32"
		class="size-8 shrink-0 rounded-lg lg:hidden"
	/>

	<h1
		class="min-w-0 flex-1 truncate text-base font-semibold text-light-two md:text-lg dark:text-dark-two"
	>
		{title}
	</h1>

	{#if user}
		<button
			bind:this={userMenuTrigger}
			type="button"
			onclick={() => (isUserMenuOpen = !isUserMenuOpen)}
			aria-haspopup="menu"
			aria-expanded={isUserMenuOpen}
			aria-label="Menú de usuario"
			class="flex shrink-0 items-center gap-2 rounded-full p-1 transition-colors hover:bg-light-one_d sm:pr-2 dark:hover:bg-dark-one_d"
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
			<span class="hidden text-left sm:block">
				<span class="block max-w-40 truncate text-sm font-medium text-light-two dark:text-dark-two">
					{fullName}
				</span>
				<span class="block max-w-40 truncate text-xs text-light-two_d dark:text-dark-four">
					{subtitle}
				</span>
			</span>
			<ChevronDownIcon
				class="hidden size-4 text-light-two_d transition-transform sm:block {isUserMenuOpen
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
</header>
