<script lang="ts">
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { PageHeader } from '#lib/components/ui/index.ts';
	import { ReportePuntosCard } from '#lib/components/features/panel/reportes/index.ts';

	// Solo SUPERADMIN, OWNER y ADMIN abren esta página (ROLE_ACCESS les da todo /panel)
</script>

<MainLayout title="Reportes" noIndex class="container mx-auto">
	<PageHeader title="Reportes" description="Descarga la información del programa en Excel." />

	<div class="mt-6">
		<ReportePuntosCard />
	</div>
</MainLayout>
