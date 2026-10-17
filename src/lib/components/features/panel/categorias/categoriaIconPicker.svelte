<script module lang="ts">
	import categoriesEmojis from '#lib/data/categoriesEmojis.json';
	import type { CategoriaEmoji } from '#lib/interfaces/index.ts';

	const EMOJIS = categoriesEmojis as CategoriaEmoji[];
</script>

<script lang="ts">
	import { Select } from '#lib/components/ui/index.ts';

	interface Props {
		/** icon_number seleccionado; 0 = sin icono */
		value: number;
		error?: string;
		disabled?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(),
		error,
		disabled = false,
		id = 'icon-picker',
		class: className
	}: Props = $props();

	function handleChange(event: Event & { currentTarget: HTMLSelectElement }) {
		value = Number(event.currentTarget.value);
	}
</script>

<Select
	{id}
	label="Icono"
	{value}
	onchange={handleChange}
	{error}
	{disabled}
	aria-invalid={!!error}
	class={className}
>
	<option value={0}>Sin icono</option>
	{#each EMOJIS as emoji (emoji.icon_number)}
		<option value={emoji.icon_number}>{emoji.icon} {emoji.name}</option>
	{/each}
</Select>
