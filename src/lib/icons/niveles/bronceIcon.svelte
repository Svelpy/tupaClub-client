<script lang="ts">
	let { class: className = 'size-12' }: { class?: string } = $props();

	// Ids únicos por instancia: varios íconos en la misma página no comparten degradados
	const id = $props.id();
</script>

<!-- Escudo de bronce con galón -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 64 64"
	fill="none"
	aria-hidden="true"
	class={className}
>
	<defs>
		<linearGradient id="{id}-rim" x1="10" y1="4" x2="54" y2="58" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#F8C990" />
			<stop offset="0.45" stop-color="#B8692C" />
			<stop offset="1" stop-color="#6B3610" />
		</linearGradient>
		<linearGradient id="{id}-face" x1="15" y1="10" x2="49" y2="53" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#FFD8A0" />
			<stop offset="0.5" stop-color="#E8892F" />
			<stop offset="1" stop-color="#A4501A" />
		</linearGradient>
		<linearGradient id="{id}-badge" x1="0" y1="27" x2="0" y2="41" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#A65A20" />
			<stop offset="1" stop-color="#6B3610" />
		</linearGradient>
	</defs>

	<ellipse cx="32" cy="61" rx="14" ry="2.2" fill="#000" opacity="0.15" />

	<!-- Borde y cara -->
	<path
		d="M32 4 54.5 11.5V29.5C54.5 44 44.5 53.5 32 58.5 19.5 53.5 9.5 44 9.5 29.5V11.5Z"
		fill="url(#{id}-rim)"
	/>
	<path
		d="M32 9.5 49.5 15.3V29.8C49.5 40.8 42 48.6 32 52.9 22 48.6 14.5 40.8 14.5 29.8V15.3Z"
		fill="url(#{id}-face)"
	/>

	<!-- Mitad iluminada y brillo superior -->
	<path d="M32 9.5 14.5 15.3V29.8C14.5 40.8 22 48.6 32 52.9Z" fill="#FFF" opacity="0.2" />
	<path d="M16.5 16.6 32 11.6V20C25 20.5 19.5 22.5 16.5 25.5Z" fill="#FFF" opacity="0.4" />

	<!-- Galón -->
	<path d="M21 27.5 32 35 43 27.5V33.5L32 41 21 33.5Z" fill="url(#{id}-badge)" />
	<path d="M21 27.5 32 35 43 27.5V29L32 36.5 21 29Z" fill="#FFE2BC" opacity="0.7" />

	<!-- Destello -->
	<path d="M48 9Q48 13 52 13 48 13 48 17 48 13 44 13 48 13 48 9Z" fill="#FFF" />
</svg>
