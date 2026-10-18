<script lang="ts">
	import QRCode from 'qrcode';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		/** Texto a codificar (p. ej. el código de canje) */
		value: string;
		/** Nombre accesible; sin él el QR es decorativo (p. ej. dentro de un botón con su propio label) */
		label?: string;
		class?: string;
	}

	let { value, label, class: className }: Props = $props();

	// Zona en blanco alrededor (en módulos) para que el lector separe el QR de lo que lo rodea
	const MARGIN = 2;

	// Un solo path con un cuadrado por módulo oscuro: escala nítido a cualquier tamaño
	const qr = $derived.by(() => {
		const { modules } = QRCode.create(value, { errorCorrectionLevel: 'M' });
		let path = '';
		for (let row = 0; row < modules.size; row++) {
			for (let col = 0; col < modules.size; col++) {
				if (modules.get(row, col)) path += `M${col} ${row}h1v1h-1z`;
			}
		}
		return { size: modules.size + MARGIN * 2, path };
	});
</script>

<!-- Siempre negro sobre blanco (también en modo oscuro): muchos lectores no leen QR invertidos -->
<svg
	viewBox="{-MARGIN} {-MARGIN} {qr.size} {qr.size}"
	shape-rendering="crispEdges"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	class={cn('block bg-white', className)}
>
	<path d={qr.path} fill="#000" />
</svg>
