<script lang="ts">
	import {
		CanjeEstadoDetalle,
		CanjeStatusBadge
	} from '#lib/components/features/panel/canjes/index.ts';
	import { BarCode, Image } from '#lib/components/ui/index.ts';
	import { TicketIcon } from '#lib/icons/outline/index.ts';
	import type { MiCanjeListItem } from '#lib/interfaces/index.ts';
	import { cn, formatCodigoCanje, formatDateTime, getCanjeStatus } from '#lib/utils/index.ts';

	interface Props {
		item: MiCanjeListItem;
		/** Referencia de "ahora" compartida por toda la lista (ms) */
		now: number;
		/** Abre el código ampliado para mostrarlo en caja (solo canjes vigentes) */
		onShowCodigo?: (item: MiCanjeListItem) => void;
	}

	let { item, now, onShowCodigo }: Props = $props();

	const canje = $derived(item.canje);
	// Un pendiente vencido que la API aún lista como PENDIENTE se muestra como expirado
	const status = $derived(getCanjeStatus(canje, now));
	// Solo un canje vigente se puede presentar en caja: el resto muestra su QR atenuado
	const isVigente = $derived(status === 'PENDIENTE');
	const barCodeClass = $derived(cn('h-14 w-36 rounded-lg px-1 py-1.5', !isVigente && 'opacity-25'));
</script>

<article
	class="flex h-full gap-4 rounded-2xl border border-light-one_d bg-light-one p-4 dark:border-dark-one_d dark:bg-dark-one"
>
	<div class="min-w-0 flex-1">
		<!-- El vale de este listado no trae imagen: se muestra la del negocio -->
		<div
			class="flex w-full items-center justify-center overflow-hidden rounded-xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
		>
			{#if item.vale.image_url}
				<Image objectFit="contain" src={item.vale.image_url} alt="" />
			{:else}
				<TicketIcon class="size-10" />
			{/if}
		</div>
		<div>
			<div class="mt-3 flex items-center gap-2.5">
				<!-- El Image ocupa todo su contenedor: el tamaño del logo lo fija este wrapper -->
				<div
					class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-light-one_d bg-light-one_d text-sm font-bold text-light-three uppercase dark:border-dark-one_d dark:bg-dark-one_d dark:text-dark-three"
				>
					{#if item.negocio.image_url}
						<Image objectFit="cover" src={item.negocio.image_url} alt="" />
					{:else}
						<span aria-hidden="true">{item.negocio.nombre.charAt(0)}</span>
					{/if}
				</div>
				<p class="min-w-0 truncate text-sm font-semibold text-light-three dark:text-dark-three">
					{item.negocio.nombre}
				</p>
			</div>
			<h3 class="mt-1.5 line-clamp-2 text-sm leading-snug text-light-two dark:text-dark-two">
				{item.vale.nombre}
			</h3>
		</div>
		<p class="mt-1.5 text-xs text-light-two_d dark:text-dark-two_d">
			Solicitado el {formatDateTime(canje.created_at)}
		</p>
		<CanjeEstadoDetalle {canje} {now} class="block" />
	</div>

	<div class="flex w-36 shrink-0 flex-col items-center gap-1.5 text-center">
		<p class="text-xs text-light-two_d dark:text-dark-two_d">Código de canje</p>

		{#if isVigente && onShowCodigo}
			<button
				type="button"
				onclick={() => onShowCodigo(item)}
				class="rounded-lg shadow-sm transition-transform [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:focus-visible:ring-dark-three/40"
			>
				<BarCode value={canje.codigo_canje} class={barCodeClass} />
				<span class="sr-only">Ampliar el código de canje {canje.codigo_canje}</span>
			</button>
		{:else}
			<div class="relative">
				<BarCode value={canje.codigo_canje} class={barCodeClass} />
				{#if !isVigente}
					<!-- Fondo sólido: el badge es translúcido y se mezclaría con el QR -->
					<span class="absolute inset-0 flex items-center justify-center">
						<span class="rounded-full bg-light-one shadow-sm dark:bg-dark-one">
							<CanjeStatusBadge {status} />
						</span>
					</span>
				{/if}
			</div>
		{/if}

		<p
			class={[
				'font-mono text-base font-bold tracking-wider tabular-nums select-all',
				isVigente ? 'text-light-two dark:text-dark-two' : 'text-light-two_d dark:text-dark-two_d'
			]}
		>
			{formatCodigoCanje(canje.codigo_canje)}
		</p>
	</div>
</article>
