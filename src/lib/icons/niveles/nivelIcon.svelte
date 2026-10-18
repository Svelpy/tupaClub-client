<script lang="ts">
	import type { Component } from 'svelte';
	import type { NivelCliente } from '#lib/interfaces/index.ts';
	import BronceIcon from './bronceIcon.svelte';
	import DiamanteIcon from './diamanteIcon.svelte';
	import OroIcon from './oroIcon.svelte';
	import PlataIcon from './plataIcon.svelte';

	interface Props {
		nivel: NivelCliente;
		class?: string;
	}

	let { nivel, class: className }: Props = $props();

	const ICONS: Record<NivelCliente, Component<{ class?: string }>> = {
		BRONCE: BronceIcon,
		PLATA: PlataIcon,
		ORO: OroIcon,
		DIAMANTE: DiamanteIcon
	};

	const Icon = $derived(ICONS[nivel]);
</script>

<Icon class={className} />
