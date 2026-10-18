<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowsLeftRightIcon,
		ChevronRightIcon,
		GiftIcon,
		SearchIcon
	} from '#lib/icons/outline/index.ts';

	const shortcuts = [
		{
			href: resolve('/app/categorias'),
			label: 'Explorar vales',
			hint: 'Mira en qué puedes usar tus puntos',
			icon: SearchIcon
		},
		{
			href: resolve('/app/mis-canjes'),
			label: 'Mis canjes',
			hint: 'Revisa tus vales canjeados',
			icon: GiftIcon
		},
		{
			href: resolve('/app/mis-movimientos'),
			label: 'Mis movimientos',
			hint: 'Puntos que ganaste y usaste',
			icon: ArrowsLeftRightIcon
		}
	];
</script>

<nav aria-label="Accesos rápidos">
	<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each shortcuts as shortcut (shortcut.href)}
			<li>
				<a
					href={shortcut.href}
					class="flex items-center gap-4 rounded-2xl border border-light-one_d bg-light-one p-4 transition-[background-color,transform] [-webkit-tap-highlight-color:transparent] hover:bg-light-one_d/40 focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-[0.98] dark:border-dark-one_d dark:bg-dark-one dark:hover:bg-dark-one_d/40 dark:focus-visible:ring-dark-three/40"
				>
					<span
						class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
					>
						<shortcut.icon class="size-6" />
					</span>
					<span class="min-w-0 flex-1">
						<span class="block font-semibold text-light-two dark:text-dark-two">
							{shortcut.label}
						</span>
						<span class="block truncate text-sm text-light-two_d dark:text-dark-two_d">
							{shortcut.hint}
						</span>
					</span>
					<ChevronRightIcon class="size-5 shrink-0 text-light-two_d dark:text-dark-two_d" />
				</a>
			</li>
		{/each}
	</ul>
</nav>
