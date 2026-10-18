<script lang="ts">
	import { resolve } from '$app/paths';
	import { ChevronRightIcon, SparklesIcon, UserIcon, UsersIcon } from '#lib/icons/outline/index.ts';
	import type { ResumenClientes } from '#lib/interfaces/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		clientes: ResumenClientes;
	}

	let { clientes }: Props = $props();

	const rows = $derived([
		{ label: 'Clientes registrados', value: formatNumber(clientes.total), icon: UsersIcon },
		{ label: 'Nuevos este mes', value: `+${formatNumber(clientes.nuevos_mes)}`, icon: UserIcon },
		{
			label: 'Puntos en circulación',
			value: formatNumber(clientes.puntos_en_circulacion),
			caption: 'Saldo disponible de todos los clientes',
			icon: SparklesIcon
		}
	]);
</script>

<section
	aria-labelledby="resumen-clientes"
	class="flex flex-col rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex items-start justify-between gap-3">
		<h2 id="resumen-clientes" class="font-semibold text-light-two dark:text-dark-two">Clientes</h2>
		<a
			href={resolve('/panel/clientes')}
			class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-light-three hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-three"
		>
			Ver clientes
			<ChevronRightIcon class="size-4" />
		</a>
	</div>

	<ul class="mt-4 divide-y divide-light-one_d dark:divide-dark-one_d">
		{#each rows as row (row.label)}
			<li class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
				<span
					class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
				>
					<row.icon class="size-4" />
				</span>
				<div class="min-w-0 flex-1">
					<p class="text-sm text-light-two_d dark:text-dark-two_d">{row.label}</p>
					{#if row.caption}
						<p class="text-xs text-light-two_d/80 dark:text-dark-two_d/80">{row.caption}</p>
					{/if}
				</div>
				<p class="shrink-0 text-lg font-semibold text-light-two dark:text-dark-two">
					{row.value}
				</p>
			</li>
		{/each}
	</ul>
</section>
