<script lang="ts">
	import { Button } from '#lib/components/ui/index.ts';
	import { StopwatchIcon } from '#lib/icons/outline/index.ts';

	interface Props {
		/** Pendientes vencidos en la página actual */
		count: number;
		isExpiring?: boolean;
		onExpire?: () => void;
	}

	let { count, isExpiring = false, onExpire }: Props = $props();
</script>

<div
	role="status"
	class="mt-4 flex flex-col gap-3 rounded-xl border border-light-warning/30 bg-light-warning/15 p-3 text-sm sm:flex-row sm:items-center dark:border-dark-warning/30 dark:bg-dark-warning/15"
>
	<div class="flex flex-1 items-start gap-2.5">
		<StopwatchIcon
			class="mt-0.5 size-5 shrink-0 text-[color-mix(in_oklab,var(--color-light-warning)_60%,black)] dark:text-[color-mix(in_oklab,var(--color-dark-warning)_60%,black)]"
		/>
		<p class="text-light-two dark:text-dark-two">
			{#if count === 1}
				Hay <strong>1 canje vencido</strong> que aún figura como pendiente. Se muestra como expirado y
				ya no se puede cancelar.
			{:else}
				Hay <strong>{count} canjes vencidos</strong> que aún figuran como pendientes. Se muestran como
				expirados y ya no se pueden cancelar.
			{/if}
		</p>
	</div>
	{#if onExpire}
		<Button
			variant="outline"
			size="sm"
			onclick={onExpire}
			loading={isExpiring}
			class="w-full shrink-0 sm:w-auto"
		>
			Marcar como expirados
		</Button>
	{/if}
</div>
