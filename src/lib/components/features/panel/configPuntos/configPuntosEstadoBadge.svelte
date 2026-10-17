<script lang="ts">
	import { Badge } from '#lib/components/ui/index.ts';

	interface Props {
		/** La configuración activa es la que tiene status ACTIVE */
		isActive: boolean;
		class?: string;
	}

	let { isActive, class: className }: Props = $props();
</script>

{#if isActive}
	<Badge variant="success" class={className}>Activa</Badge>
{:else}
	<Badge
		variant="outline"
		class="border-light-four text-light-two_d dark:border-dark-four dark:text-dark-two_d {className ??
			''}"
	>
		Inactiva
	</Badge>
{/if}
