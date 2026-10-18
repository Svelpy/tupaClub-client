<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ClientDetailHeader } from '#lib/components/features/app/navigation/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';

	const canjeId = $derived(page.params.canjeId);
</script>

<MainLayout title="Detalle del canje">
	<ClientDetailHeader title="Detalle del canje" backHref={resolve('/app/mis-canjes')} />
	<p class="mt-4 text-light-two_d md:mt-0 dark:text-dark-two_d">Canje: {canjeId}</p>
</MainLayout>
