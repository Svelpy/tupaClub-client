<script lang="ts">
	import { resolve } from '$app/paths';
	import { ChevronRightIcon, TicketIcon } from '#lib/icons/outline/index.ts';
	import type { ResumenTopVale } from '#lib/interfaces/index.ts';
	import { cn, formatNumber } from '#lib/utils/index.ts';

	interface Props {
		vales: ResumenTopVale[];
		class?: string;
	}

	let { vales, class: className }: Props = $props();

	// Ranking de mayor a menor; la barra más larga es el más canjeado
	const ranking = $derived([...vales].sort((a, b) => b.canjes - a.canjes));
	const max = $derived(Math.max(1, ...ranking.map((vale) => vale.canjes)));
</script>

<!-- Una sola serie (canjes por vale): un solo color, valor escrito al final de cada fila -->
<section
	aria-labelledby="top-vales"
	class={cn(
		'rounded-2xl border border-light-one_d bg-light-one p-5 md:p-6 dark:border-dark-one_d dark:bg-dark-one',
		className
	)}
>
	<div class="flex items-start justify-between gap-3">
		<div>
			<h2 id="top-vales" class="font-semibold text-light-two dark:text-dark-two">
				Vales más canjeados
			</h2>
			<p class="text-xs text-light-two_d dark:text-dark-two_d">Este mes</p>
		</div>
		<a
			href={resolve('/panel/vales')}
			class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-light-three hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-three"
		>
			Ver vales
			<ChevronRightIcon class="size-4" />
		</a>
	</div>

	{#if ranking.length === 0}
		<div class="flex flex-col items-center gap-2 py-10 text-center">
			<TicketIcon class="size-8 text-light-two_d dark:text-dark-two_d" />
			<p class="text-sm text-light-two_d dark:text-dark-two_d">Todavía no hay canjes este mes.</p>
		</div>
	{:else}
		<ol class="mt-5 space-y-4">
			{#each ranking as vale, index (vale.vale_id)}
				<li class="flex items-center gap-3">
					<span
						class="flex size-7 shrink-0 items-center justify-center rounded-full bg-light-one_d text-xs font-bold text-light-three dark:bg-dark-one_d dark:text-dark-three"
						aria-hidden="true"
					>
						{index + 1}
					</span>
					<div class="min-w-0 flex-1 space-y-1.5">
						<div class="flex items-baseline justify-between gap-3">
							<p class="min-w-0 truncate text-sm text-light-two dark:text-dark-two">
								<span class="font-medium">{vale.nombre}</span>
								<span class="text-light-two_d dark:text-dark-two_d">· {vale.negocio}</span>
							</p>
							<p
								class="shrink-0 text-sm font-semibold text-light-two tabular-nums dark:text-dark-two"
							>
								{formatNumber(vale.canjes)}
								<span class="font-normal text-light-two_d dark:text-dark-two_d">
									{vale.canjes === 1 ? 'canje' : 'canjes'}
								</span>
							</p>
						</div>
						<div class="h-2 rounded bg-light-three/10 dark:bg-dark-three/10" aria-hidden="true">
							<div
								class="h-full rounded-r bg-light-three dark:bg-dark-three"
								style:width="{(vale.canjes / max) * 100}%"
							></div>
						</div>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</section>
