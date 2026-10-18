<script lang="ts">
	import type { Canje } from '#lib/interfaces/index.ts';
	import { cn, formatDateTime, formatRelativeTime, isCanjeVencido } from '#lib/utils/index.ts';

	interface Props {
		canje: Canje;
		/** Referencia de "ahora" compartida por toda la lista (ms) */
		now: number;
		class?: string;
	}

	let { canje, now, class: className }: Props = $props();

	const DAY_MS = 24 * 60 * 60 * 1000;

	// Fecha relevante según el estado: vencimiento mientras está pendiente, cierre en el resto
	const detail = $derived.by(() => {
		const expiresIn = new Date(canje.expires_at).getTime() - now;
		const relative = formatRelativeTime(canje.expires_at, { now });

		if (isCanjeVencido(canje, now)) {
			return { text: `Venció ${relative}`, date: canje.expires_at, urgent: false };
		}
		switch (canje.status) {
			case 'PENDIENTE':
				return { text: `Vence ${relative}`, date: canje.expires_at, urgent: expiresIn < DAY_MS };
			case 'EXPIRADO':
				return {
					text: `Expiró el ${formatDateTime(canje.expires_at)}`,
					date: canje.expires_at,
					urgent: false
				};
			case 'CANJEADO':
				return {
					text: `Canjeado el ${formatDateTime(canje.updated_at)}`,
					date: canje.updated_at,
					urgent: false
				};
			case 'CANCELADO':
				return {
					text: `Cancelado el ${formatDateTime(canje.updated_at)}`,
					date: canje.updated_at,
					urgent: false
				};
		}
	});
</script>

<time
	datetime={detail.date}
	title={formatDateTime(detail.date)}
	class={cn(
		'text-xs',
		detail.urgent
			? 'font-medium text-[color-mix(in_oklab,var(--color-light-warning)_60%,black)] dark:text-[color-mix(in_oklab,var(--color-dark-warning)_60%,black)]'
			: 'text-light-two_d dark:text-dark-two_d',
		className
	)}
>
	{detail.text}
</time>
