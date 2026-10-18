<script lang="ts">
	import { Badge } from '#lib/components/ui/index.ts';
	import { MOVIMIENTO_TIPO_LABEL } from '#lib/constants/index.ts';
	import type { MovimientoTipo } from '#lib/interfaces/index.ts';

	interface Props {
		tipo: MovimientoTipo;
		size?: 'sm' | 'md';
		class?: string;
	}

	let { tipo, size = 'md', class: className }: Props = $props();

	const VARIANTS = {
		ACUMULA: 'success',
		CANJE: 'info',
		AJUSTE: 'warning'
	} as const satisfies Record<MovimientoTipo, string>;
</script>

<Badge variant={VARIANTS[tipo] ?? 'secondary'} {size} class={className}>
	{MOVIMIENTO_TIPO_LABEL[tipo] ?? tipo}
</Badge>
