<script lang="ts">
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		/** Texto a codificar (p. ej. el código de canje). Admite ASCII imprimible */
		value: string;
		/** Nombre accesible; sin él el código es decorativo (p. ej. dentro de un botón con su propio label) */
		label?: string;
		class?: string;
	}

	let { value, label, class: className }: Props = $props();

	// Code 128: cada símbolo son 6 anchos alternos barra/espacio que suman 11 módulos (el stop lleva 7)
	const PATTERNS = [
		'212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212',
		'221213', '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221',
		'223211', '221132', '221231', '213212', '223112', '312131', '311222', '321122', '321221',
		'312212', '322112', '322211', '212123', '212321', '232121', '111323', '131123', '131321',
		'112313', '132113', '132311', '211313', '231113', '231311', '112133', '112331', '132131',
		'113123', '113321', '133121', '313121', '211331', '231131', '213113', '213311', '213131',
		'311123', '311321', '331121', '312113', '312311', '332111', '314111', '221411', '431111',
		'111224', '111422', '121124', '121421', '141122', '141221', '112214', '112412', '122114',
		'122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', '111242',
		'121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
		'214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311',
		'113141', '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
	];
	const START_B = 104;
	const START_C = 105;
	const STOP = 106;

	// Zona en blanco a cada lado (en módulos) para que el lector separe las barras de lo que las rodea
	const QUIET = 6;
	const HEIGHT = 40;

	/** Valores de símbolo: set C (dos dígitos por símbolo) si todo es numérico y par, si no set B */
	function encode(text: string): number[] {
		const symbols: number[] = [];
		if (/^\d+$/.test(text) && text.length % 2 === 0) {
			symbols.push(START_C);
			for (let i = 0; i < text.length; i += 2) symbols.push(Number(text.slice(i, i + 2)));
		} else {
			symbols.push(START_B);
			for (const char of text) {
				const code = char.charCodeAt(0) - 32;
				// Fuera de ASCII imprimible no existe en el set B: se sustituye por "?"
				symbols.push(code >= 0 && code <= 94 ? code : 31);
			}
		}
		const checksum = symbols.reduce((sum, s, i) => sum + s * (i === 0 ? 1 : i), 0) % 103;
		return [...symbols, checksum, STOP];
	}

	// Un solo path con un rect por barra: escala nítido a cualquier tamaño
	const bars = $derived.by(() => {
		let path = '';
		let x = QUIET;
		for (const symbol of encode(value)) {
			const widths = PATTERNS[symbol];
			for (let i = 0; i < widths.length; i++) {
				const w = Number(widths[i]);
				if (i % 2 === 0) path += `M${x} 0h${w}v${HEIGHT}h-${w}z`;
				x += w;
			}
		}
		return { width: x + QUIET, path };
	});
</script>

<!-- Siempre negro sobre blanco (también en modo oscuro): muchos lectores no leen códigos invertidos -->
<svg
	viewBox="0 0 {bars.width} {HEIGHT}"
	preserveAspectRatio="none"
	shape-rendering="crispEdges"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	class={cn('block bg-white', className)}
>
	<path d={bars.path} fill="#000" />
</svg>
