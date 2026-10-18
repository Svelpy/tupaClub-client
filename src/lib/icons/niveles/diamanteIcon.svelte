<script lang="ts">
	let { class: className = 'size-12' }: { class?: string } = $props();

	// Ids únicos por instancia: varios íconos en la misma página no comparten degradados
	const id = $props.id();
</script>

<!-- Diamante de talla brillante con resplandor -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 64 64"
	fill="none"
	aria-hidden="true"
	class={className}
>
	<defs>
		<radialGradient id="{id}-glow" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="#67E8F9" stop-opacity="0.55" />
			<stop offset="1" stop-color="#67E8F9" stop-opacity="0" />
		</radialGradient>
		<linearGradient id="{id}-gem" x1="6" y1="11" x2="52" y2="57" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#E0FBFF" />
			<stop offset="0.3" stop-color="#67E8F9" />
			<stop offset="0.6" stop-color="#3B82F6" />
			<stop offset="1" stop-color="#6D28D9" />
		</linearGradient>
	</defs>

	<circle cx="32" cy="32" r="31" fill="url(#{id}-glow)" />
	<ellipse cx="32" cy="61" rx="12" ry="2" fill="#000" opacity="0.15" />

	<path
		d="M18 11H46L58 25 32 57 6 25Z"
		fill="url(#{id}-gem)"
		stroke="#2563EB"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>

	<!-- Facetas: corona (arriba) y pabellón (abajo) -->
	<g fill="#FFF">
		<path d="M18 11 6 25H19Z" opacity="0.55" />
		<path d="M18 11H32L19 25Z" opacity="0.35" />
		<path d="M32 11 19 25H45Z" opacity="0.22" />
		<path d="M32 11H46L45 25Z" opacity="0.06" />
		<path d="M6 25H19L32 57Z" opacity="0.18" />
	</g>
	<g fill="#1E3A8A">
		<path d="M46 11 58 25H45Z" opacity="0.14" />
		<path d="M32 25H45L32 57Z" opacity="0.18" />
		<path d="M45 25H58L32 57Z" opacity="0.32" />
	</g>
	<path
		d="M6 25H58M18 11 19 25M32 11 19 25M32 11 45 25M46 11 45 25M19 25 32 57M45 25 32 57M32 25V57"
		stroke="#FFF"
		stroke-width="0.8"
		opacity="0.45"
	/>

	<!-- Destellos -->
	<path d="M49 13Q49 18 54 18 49 18 49 23 49 18 44 18 49 18 49 13Z" fill="#FFF" />
	<path d="M17 31Q17 34 20 34 17 34 17 37 17 34 14 34 17 34 17 31Z" fill="#FFF" opacity="0.9" />
</svg>
