<script lang="ts">
	import type { ResumenCanjesPeriodo, ResumenOperaciones } from '#lib/interfaces/index.ts';
	import { cn, formatCurrency, formatNumber } from '#lib/utils/index.ts';

	interface Props {
		/** Qué ventas se muestran (p. ej. "Ventas registradas hoy" o "Tus ventas de hoy") */
		title: string;
		operaciones: ResumenOperaciones;
		/** Canjes del día (solo en el resumen de administración); sin ellos se muestra el promedio */
		canjes?: ResumenCanjesPeriodo;
		class?: string;
	}

	let { title, operaciones, canjes, class: className }: Props = $props();

	const stats = $derived.by(() => {
		const base = [
			{ label: 'Compras', value: formatNumber(operaciones.cantidad), caption: undefined },
			{
				label: 'Puntos otorgados',
				value: formatNumber(operaciones.puntos_otorgados),
				caption: undefined
			}
		];
		if (canjes) {
			return [
				...base,
				{
					label: 'Canjes',
					value: formatNumber(canjes.cantidad),
					caption: `${formatNumber(canjes.puntos)} pts`
				}
			];
		}
		const promedio =
			operaciones.cantidad > 0 ? Number(operaciones.total_compra) / operaciones.cantidad : null;
		return [
			...base,
			{
				label: 'Por compra',
				value: promedio === null ? formatCurrency(0) : formatCurrency(promedio),
				caption: 'promedio'
			}
		];
	});
</script>

<!-- La cifra principal del inicio: lo vendido hoy. Debajo, el resto de la actividad del día -->
<section
	aria-labelledby="resumen-hoy"
	class={cn(
		'flex flex-col justify-between gap-6 rounded-2xl bg-light-three p-5 text-light-one shadow-lg md:p-6 dark:bg-dark-three dark:text-dark-one',
		className
	)}
>
	<div>
		<h2 id="resumen-hoy" class="text-sm font-medium text-light-one/80 dark:text-dark-one/80">
			{title}
		</h2>
		<p class="mt-1 text-4xl font-bold md:text-5xl">
			{formatCurrency(operaciones.total_compra)}
		</p>
		{#if operaciones.cantidad === 0}
			<p class="mt-2 text-sm text-light-one/80 dark:text-dark-one/80">
				Aún no hay compras registradas hoy.
			</p>
		{/if}
	</div>

	<dl class="grid grid-cols-3 gap-3 border-t border-light-one/15 pt-4 dark:border-dark-one/15">
		{#each stats as stat (stat.label)}
			<div class="min-w-0">
				<dt class="truncate text-xs text-light-one/70 dark:text-dark-one/70">{stat.label}</dt>
				<dd class="mt-0.5 truncate text-xl font-semibold md:text-2xl">{stat.value}</dd>
				{#if stat.caption}
					<dd class="text-xs text-light-one/70 dark:text-dark-one/70">{stat.caption}</dd>
				{/if}
			</div>
		{/each}
	</dl>
</section>
