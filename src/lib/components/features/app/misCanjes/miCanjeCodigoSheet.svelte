<script lang="ts">
	import { QrCode, Sheet } from '#lib/components/ui/index.ts';
	import { SunIcon } from '#lib/icons/solid/index.ts';
	import type { MiCanjeListItem } from '#lib/interfaces/index.ts';
	import { formatCodigoCanje, formatDate } from '#lib/utils/index.ts';

	interface Props {
		/** Canje vigente a mostrar en caja; null = cerrado */
		item: MiCanjeListItem | null;
		onClose: () => void;
	}

	let { item, onClose }: Props = $props();
</script>

<Sheet
	open={item !== null}
	title="Código de canje"
	description={item
		? `Muéstralo en caja en una sucursal de ${item.negocio.nombre} para recibir tu vale.`
		: undefined}
	{onClose}
>
	{#if item}
		<div class="flex flex-col items-center pt-2 text-center">
			<QrCode
				value={item.canje.codigo_canje}
				label="Código QR del canje {item.canje.codigo_canje}"
				class="size-60 max-w-full rounded-2xl p-3 shadow-sm ring-1 ring-light-one_d dark:ring-dark-one_d"
			/>
			<p
				class="mt-4 font-mono text-3xl font-bold tracking-[0.15em] text-light-three tabular-nums select-all dark:text-dark-three"
			>
				{formatCodigoCanje(item.canje.codigo_canje)}
			</p>
			<p class="mt-2 flex items-center gap-1.5 text-xs text-light-two_d dark:text-dark-two_d">
				<SunIcon class="size-4 shrink-0 text-light-warning dark:text-dark-warning" />
				Si no lo leen, sube el brillo de tu pantalla.
			</p>
		</div>

		<dl
			class="mt-5 divide-y divide-light-one_d rounded-2xl border border-light-one_d text-sm dark:divide-dark-one_d dark:border-dark-one_d"
		>
			<div class="flex items-start justify-between gap-4 px-4 py-3">
				<dt class="shrink-0 text-light-two_d dark:text-dark-two_d">Vale</dt>
				<dd class="text-right font-medium text-light-two dark:text-dark-two">
					{item.vale.nombre}
				</dd>
			</div>
			<div class="flex items-start justify-between gap-4 px-4 py-3">
				<dt class="shrink-0 text-light-two_d dark:text-dark-two_d">Negocio</dt>
				<dd class="text-right text-light-two dark:text-dark-two">{item.negocio.nombre}</dd>
			</div>
			<div class="flex items-center justify-between gap-4 px-4 py-3">
				<dt class="text-light-two_d dark:text-dark-two_d">Válido hasta</dt>
				<dd class="font-semibold text-light-two dark:text-dark-two">
					{formatDate(item.canje.expires_at)}
				</dd>
			</div>
		</dl>
	{/if}
</Sheet>
