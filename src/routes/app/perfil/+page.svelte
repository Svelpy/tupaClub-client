<script lang="ts">
	import { resolve } from '$app/paths';
	import { ClientDetailHeader } from '#lib/components/features/app/navigation/index.ts';
	import { LegalLinks } from '#lib/components/features/legal/index.ts';
	import { PerfilView } from '#lib/components/features/perfil/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
</script>

<!-- Se abre desde el menú del avatar: pantalla apilada con "Volver", sin pestañas -->
<MainLayout title="Mi perfil">
	<ClientDetailHeader title="Mi perfil" backHref={resolve('/app')} />

	<div class="mt-4 md:mt-0">
		<PerfilView showPuntos />
	</div>

	<LegalLinks class="mt-8" />
</MainLayout>
