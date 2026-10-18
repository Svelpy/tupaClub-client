<script lang="ts">
	let { class: className = 'size-12' }: { class?: string } = $props();

	// Ids únicos por instancia: varios íconos en la misma página no comparten degradados
	const id = $props.id();
</script>

<!-- Estrella de plata facetada (luz desde arriba a la izquierda) -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 64 64"
	fill="none"
	aria-hidden="true"
	class={className}
>
	<defs>
		<linearGradient id="{id}-face" x1="8" y1="6" x2="54" y2="56" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#FFFFFF" />
			<stop offset="0.45" stop-color="#D5DCE6" />
			<stop offset="1" stop-color="#8592A6" />
		</linearGradient>
		<linearGradient id="{id}-rim" x1="8" y1="6" x2="54" y2="56" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#B8C2D0" />
			<stop offset="1" stop-color="#5B6678" />
		</linearGradient>
	</defs>

	<ellipse cx="32" cy="61" rx="14" ry="2.2" fill="#000" opacity="0.15" />

	<path
		d="M32 7 38.76 24.7 57.68 25.66 42.94 37.55 47.87 55.84 32 45.5 16.13 55.84 21.06 37.55 6.32 25.66 25.24 24.7Z"
		fill="url(#{id}-face)"
		stroke="url(#{id}-rim)"
		stroke-width="2.5"
		stroke-linejoin="round"
	/>

	<!-- Facetas: cada punta tiene una cara clara y una oscura -->
	<g fill="#FFF">
		<path d="M32 34 25.24 24.7 32 7Z" opacity="0.5" />
		<path d="M32 34 32 7 38.76 24.7Z" opacity="0.28" />
		<path d="M32 34 21.06 37.55 6.32 25.66Z" opacity="0.4" />
		<path d="M32 34 6.32 25.66 25.24 24.7Z" opacity="0.55" />
		<path d="M32 34 16.13 55.84 21.06 37.55Z" opacity="0.08" />
	</g>
	<g fill="#1E293B">
		<path d="M32 34 57.68 25.66 42.94 37.55Z" opacity="0.26" />
		<path d="M32 34 42.94 37.55 47.87 55.84Z" opacity="0.3" />
		<path d="M32 34 47.87 55.84 32 45.5Z" opacity="0.28" />
		<path d="M32 34 32 45.5 16.13 55.84Z" opacity="0.14" />
	</g>

	<!-- Destello -->
	<path d="M47 26Q47 30 51 30 47 30 47 34 47 30 43 30 47 30 47 26Z" fill="#FFF" />
</svg>
