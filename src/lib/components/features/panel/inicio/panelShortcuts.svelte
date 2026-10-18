<script lang="ts">
	import { ChevronRightIcon } from '#lib/icons/outline/index.ts';
	import type { NavSection } from '#lib/interfaces/index.ts';

	interface Props {
		/** Menú ya filtrado por rol (filterNavigation): solo se muestran páginas que puede abrir */
		navigation: NavSection[];
	}

	let { navigation }: Props = $props();

	// Atajos en orden de uso: el link, el icono y el nombre salen del menú (PANEL_NAVIGATION)
	const HINTS: Record<string, string> = {
		'registrar-compra': 'Suma puntos a un cliente por su compra',
		canjes: 'Entrega vales con el código del cliente',
		clientes: 'Busca, registra y edita clientes',
		vales: 'Catálogo de vales para canjear',
		administradores: 'Usuarios del panel y sus roles',
		'configuracion-puntos': 'Cuántos puntos da cada compra',
		operaciones: 'Historial de compras registradas',
		negocios: 'Comercios afiliados y sus sucursales'
	};

	const shortcuts = $derived(
		Object.keys(HINTS).flatMap((id) => {
			const item = navigation.flatMap((section) => section.items).find((nav) => nav.id === id);
			return item ? [{ ...item, hint: HINTS[id] }] : [];
		})
	);
</script>

{#if shortcuts.length > 0}
	<nav aria-labelledby="accesos-rapidos">
		<h2 id="accesos-rapidos" class="mb-3 font-semibold text-light-two dark:text-dark-two">
			Accesos rápidos
		</h2>
		<ul class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{#each shortcuts as shortcut (shortcut.id)}
				<li>
					<a
						href={shortcut.href}
						class="group flex h-full items-center gap-3 rounded-2xl border border-light-one_d bg-light-one p-4 transition-[background-color,border-color,transform] hover:border-light-three/20 hover:bg-light-one_d/40 focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-[0.98] dark:border-dark-one_d dark:bg-dark-one dark:hover:border-dark-three/20 dark:hover:bg-dark-one_d/40 dark:focus-visible:ring-dark-three/40"
					>
						<span
							class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
						>
							<shortcut.icon class="size-5" />
						</span>
						<span class="min-w-0 flex-1">
							<span class="block text-sm font-semibold text-light-two dark:text-dark-two">
								{shortcut.label}
							</span>
							<span class="block text-xs text-light-two_d dark:text-dark-two_d">
								{shortcut.hint}
							</span>
						</span>
						<ChevronRightIcon
							class="size-4 shrink-0 text-light-two_d transition-transform group-hover:translate-x-0.5 dark:text-dark-two_d"
						/>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
