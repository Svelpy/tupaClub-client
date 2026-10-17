<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/images/logo_app.webp';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
