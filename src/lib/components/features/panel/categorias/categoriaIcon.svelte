<script module lang="ts">
	import categoriesEmojis from '#lib/data/categoriesEmojis.json';
	import type { CategoriaEmoji } from '#lib/interfaces/index.ts';

	const EMOJIS = new Map(
		(categoriesEmojis as CategoriaEmoji[]).map((emoji) => [emoji.icon_number, emoji])
	);

	const FALLBACK: Omit<CategoriaEmoji, 'icon_number'> = { name: 'Sin icono', icon: '🏷️' };
</script>

<script lang="ts">
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		iconNumber: number;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { iconNumber, size = 'md', class: className }: Props = $props();

	const sizes = {
		sm: 'size-9 text-lg rounded-lg',
		md: 'size-11 text-2xl rounded-xl',
		lg: 'size-14 text-3xl rounded-2xl'
	} as const;

	const emoji = $derived(EMOJIS.get(iconNumber) ?? FALLBACK);
</script>

<span
	role="img"
	aria-label={emoji.name}
	title={emoji.name}
	class={cn(
		'inline-flex shrink-0 items-center justify-center bg-light-one_d leading-none select-none dark:bg-dark-one_d',
		sizes[size],
		className
	)}
>
	{emoji.icon}
</span>
