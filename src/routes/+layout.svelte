<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/images/logo_app.webp';
	import { AppUpdateBanner } from '#lib/components/layout/index.ts';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<AppUpdateBanner />
