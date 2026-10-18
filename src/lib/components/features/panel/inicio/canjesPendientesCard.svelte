<script lang="ts">
	import { resolve } from '$app/paths';
	import { ChevronRightIcon, CircleCheckIcon, StopwatchIcon } from '#lib/icons/outline/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		pendientes: number;
	}

	let { pendientes }: Props = $props();

	const hayPendientes = $derived(pendientes > 0);
</script>

<!--
	Lo que requiere atención: canjes con un código que todavía no se presentó. El estado lleva
	color, icono y texto (nunca solo el color).
-->
<section
	aria-labelledby="canjes-pendientes"
	class={[
		'flex flex-col gap-4 rounded-2xl border p-5 md:p-6',
		hayPendientes
			? 'border-light-warning/30 bg-light-warning/10 dark:border-dark-warning/30 dark:bg-dark-warning/10'
			: 'border-light-success/25 bg-light-success/10 dark:border-dark-success/25 dark:bg-dark-success/10'
	]}
>
	<div class="flex items-start gap-3">
		<span
			class={[
				'flex size-10 shrink-0 items-center justify-center rounded-xl',
				hayPendientes
					? 'bg-light-warning/20 text-light-warning dark:bg-dark-warning/20 dark:text-dark-warning'
					: 'bg-light-success/20 text-light-success dark:bg-dark-success/20 dark:text-dark-success'
			]}
		>
			{#if hayPendientes}
				<StopwatchIcon class="size-5" />
			{:else}
				<CircleCheckIcon class="size-5" />
			{/if}
		</span>
		<div class="min-w-0">
			<h2 id="canjes-pendientes" class="text-sm font-medium text-light-two dark:text-dark-two">
				Canjes pendientes
			</h2>
			<p class="text-xs text-light-two_d dark:text-dark-two_d">
				{hayPendientes ? 'Clientes con un código por presentar' : 'Todo entregado por ahora'}
			</p>
		</div>
	</div>

	<p class="text-4xl font-bold text-light-two dark:text-dark-two">{formatNumber(pendientes)}</p>

	<a
		href={resolve('/panel/canjes')}
		class="mt-auto inline-flex items-center gap-1 self-start text-sm font-semibold text-light-three hover:underline focus-visible:underline focus-visible:outline-none dark:text-dark-three"
	>
		{hayPendientes ? 'Atender canjes' : 'Ver canjes'}
		<ChevronRightIcon class="size-4" />
	</a>
</section>
