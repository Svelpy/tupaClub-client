<script lang="ts">
	import { resolve } from '$app/paths';
	import { ClientDetailHeader } from '#lib/components/features/app/navigation/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
</script>

<!-- Se abre desde el menú del avatar: pantalla apilada con "Volver", sin pestañas -->
<MainLayout title="Mi perfil">
	<ClientDetailHeader title="Mi perfil" backHref={resolve('/app')} />
	<p class="mt-4 text-light-two_d md:mt-0 dark:text-dark-two_d">Próximamente.</p>
</MainLayout>
