<script>
	import { MainLayout } from '#lib/components/layout/index.ts';
	let { children } = $props();
</script>

<MainLayout title="Inicio" description="Bienvenido al sistema de gestión de ventas y finanzas.">
	{@render children()}
</MainLayout>
