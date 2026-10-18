<script lang="ts">
	let { class: className = 'size-12' }: { class?: string } = $props();

	// Ids únicos por instancia: varios íconos en la misma página no comparten degradados
	const id = $props.id();
</script>

<!-- Corona de oro con gemas -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 64 64"
	fill="none"
	aria-hidden="true"
	class={className}
>
	<defs>
		<linearGradient id="{id}-gold" x1="7" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#FFF4B5" />
			<stop offset="0.35" stop-color="#FFD43B" />
			<stop offset="0.7" stop-color="#F2A700" />
			<stop offset="1" stop-color="#B47400" />
		</linearGradient>
		<linearGradient id="{id}-band" x1="0" y1="44" x2="0" y2="54" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#FFD54A" />
			<stop offset="1" stop-color="#C27F00" />
		</linearGradient>
		<radialGradient id="{id}-ruby" cx="0.35" cy="0.3" r="0.8">
			<stop offset="0" stop-color="#FFB4C0" />
			<stop offset="0.45" stop-color="#E11D48" />
			<stop offset="1" stop-color="#881337" />
		</radialGradient>
		<radialGradient id="{id}-sapphire" cx="0.35" cy="0.3" r="0.8">
			<stop offset="0" stop-color="#BFDBFE" />
			<stop offset="0.45" stop-color="#2563EB" />
			<stop offset="1" stop-color="#1E3A8A" />
		</radialGradient>
	</defs>

	<ellipse cx="32" cy="61" rx="17" ry="2.2" fill="#000" opacity="0.15" />

	<!-- Cuerpo -->
	<path
		d="M7 21 19.5 33 32 11 44.5 33 57 21 52 47H12Z"
		fill="url(#{id}-gold)"
		stroke="#B97A06"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<path d="M7 21 19.5 33 32 11V47H12Z" fill="#FFF" opacity="0.18" />
	<path d="M32 11 44.5 33 57 21 52 47H32Z" fill="#7A4A00" opacity="0.1" />

	<!-- Rubí central -->
	<path
		d="M32 26 37 33.5 32 41 27 33.5Z"
		fill="url(#{id}-ruby)"
		stroke="#9F1239"
		stroke-width="0.8"
	/>
	<path d="M32 27.5 29.2 33.5H32Z" fill="#FFF" opacity="0.55" />

	<!-- Puntas -->
	<g fill="url(#{id}-gold)" stroke="#B97A06" stroke-width="1.2">
		<circle cx="7" cy="20" r="4" />
		<circle cx="32" cy="10" r="4" />
		<circle cx="57" cy="20" r="4" />
	</g>
	<g fill="#FFF" opacity="0.75">
		<circle cx="5.7" cy="18.7" r="1.3" />
		<circle cx="30.7" cy="8.7" r="1.3" />
		<circle cx="55.7" cy="18.7" r="1.3" />
	</g>

	<!-- Banda con gemas -->
	<rect
		x="11"
		y="44"
		width="42"
		height="10"
		rx="3"
		fill="url(#{id}-band)"
		stroke="#A86A00"
		stroke-width="1.2"
	/>
	<rect x="13.5" y="45.4" width="37" height="1.6" rx="0.8" fill="#FFF" opacity="0.55" />
	<circle cx="20" cy="49.5" r="2.6" fill="url(#{id}-sapphire)" />
	<circle cx="32" cy="49.5" r="3" fill="url(#{id}-ruby)" />
	<circle cx="44" cy="49.5" r="2.6" fill="url(#{id}-sapphire)" />

	<!-- Destello -->
	<path d="M22 24Q22 28 26 28 22 28 22 32 22 28 18 28 22 28 22 24Z" fill="#FFF" />
</svg>
