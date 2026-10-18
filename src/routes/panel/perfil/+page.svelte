<script lang="ts">
	import { PerfilView } from '#lib/components/features/perfil/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { PageHeader } from '#lib/components/ui/index.ts';
</script>

<MainLayout title="Mi perfil" noIndex class="container mx-auto">
	<PageHeader title="Mi perfil" description="Tus datos personales, tu foto y tu contraseña." />

	<div class="mt-6">
		<PerfilView showSucursal />
	</div>
</MainLayout>
