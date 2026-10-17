<script lang="ts">
	import { Badge } from '#lib/components/ui/index.ts';
	import { NEGOCIO_TIPO_LABEL } from '#lib/constants/index.ts';
	import type { NegocioTipo } from '#lib/interfaces/index.ts';

	interface Props {
		tipo: NegocioTipo;
		class?: string;
	}

	let { tipo, class: className }: Props = $props();

	const variants = { MAIN: 'info', SOCIO: 'success' } as const;
</script>

<Badge variant={variants[tipo] ?? 'secondary'} class={className}>
	{NEGOCIO_TIPO_LABEL[tipo] ?? tipo}
</Badge>
