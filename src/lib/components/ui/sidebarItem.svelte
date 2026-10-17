<script lang="ts">
	import type { NavItem } from '#lib/interfaces/index.ts';

	interface Props {
		item: NavItem;
		active: boolean;
	}

	let { item, active }: Props = $props();
</script>

<a
	href={item.href}
	aria-current={active ? 'page' : undefined}
	class={[
		'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-light-one/60 focus-visible:outline-none dark:focus-visible:ring-dark-two/60',
		active
			? 'bg-white/10 text-light-one dark:bg-dark-two/10 dark:text-dark-two'
			: 'text-light-one/70 hover:bg-white/5 hover:text-light-one dark:text-dark-two/70 dark:hover:bg-dark-two/5 dark:hover:text-dark-two'
	]}
>
	{#if active}
		<span class="absolute inset-y-2 left-0 w-1 rounded-r-full bg-light-accent" aria-hidden="true"
		></span>
	{/if}
	<item.icon class="size-5 shrink-0" />
	<span class="truncate">{item.label}</span>
</a>
