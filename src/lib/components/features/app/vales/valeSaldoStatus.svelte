<script lang="ts">
	import { CircleCheckIcon } from '#lib/icons/outline/index.ts';
	import { CoinIcon } from '#lib/icons/solid/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		/** Puntos que cuesta el vale */
		puntos: number;
		/** Saldo actual del cliente */
		saldo: number;
	}

	let { puntos, saldo }: Props = $props();

	const alcanza = $derived(saldo >= puntos);
	const progreso = $derived(puntos > 0 ? Math.min(100, Math.round((saldo / puntos) * 100)) : 100);
</script>

<!-- Costo del vale frente al saldo: el cliente sabe antes de tocar "Canjear" si le alcanza -->
<div
	class="space-y-3 rounded-2xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="flex items-center justify-between gap-3">
		<p class="text-sm text-light-two_d dark:text-dark-two_d">Costo del canje</p>
		<p class="flex items-center gap-1.5">
			<CoinIcon class="size-5 text-light-warning dark:text-dark-warning" />
			<span class="text-2xl font-bold text-light-two tabular-nums dark:text-dark-two">
				{formatNumber(puntos)}
			</span>
			<span class="text-sm font-semibold text-light-two_d dark:text-dark-two_d">pts</span>
		</p>
	</div>

	<div class="border-t border-light-one_d pt-3 dark:border-dark-one_d">
		{#if alcanza}
			<p class="flex items-start gap-2 text-sm text-light-two dark:text-dark-two">
				<CircleCheckIcon class="mt-0.5 size-4 shrink-0 text-light-success dark:text-dark-success" />
				<span>
					Tienes <strong class="tabular-nums">{formatNumber(saldo)} pts</strong>. Después del canje
					te quedarán
					<strong class="tabular-nums">{formatNumber(saldo - puntos)} pts</strong>.
				</span>
			</p>
		{:else}
			<div class="space-y-2">
				<div
					role="progressbar"
					aria-valuenow={progreso}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label="Puntos reunidos para este vale"
					class="h-2 overflow-hidden rounded-full bg-light-one_d dark:bg-dark-one_d"
				>
					<div
						class="h-full rounded-full bg-light-warning dark:bg-dark-warning"
						style:width="{progreso}%"
					></div>
				</div>
				<p class="text-sm text-light-two dark:text-dark-two">
					Te faltan <strong class="tabular-nums">{formatNumber(puntos - saldo)} pts</strong> para
					este vale. Tienes {formatNumber(saldo)} pts.
				</p>
			</div>
		{/if}
	</div>
</div>
