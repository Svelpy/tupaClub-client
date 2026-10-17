<script lang="ts">
	import { Badge } from '#lib/components/ui/index.ts';
	import { CANJE_STATUS_LABEL } from '#lib/constants/index.ts';
	import type { CanjeStatus } from '#lib/interfaces/index.ts';

	interface Props {
		/** Estado a mostrar (ver getCanjeStatus: un pendiente vencido llega como EXPIRADO) */
		status: CanjeStatus;
		class?: string;
	}

	let { status, class: className }: Props = $props();

	const VARIANTS = {
		PENDIENTE: 'warning',
		CANJEADO: 'success',
		EXPIRADO: 'secondary',
		CANCELADO: 'error'
	} as const satisfies Record<CanjeStatus, string>;
</script>

<Badge variant={VARIANTS[status]} dot class={className}>{CANJE_STATUS_LABEL[status]}</Badge>
