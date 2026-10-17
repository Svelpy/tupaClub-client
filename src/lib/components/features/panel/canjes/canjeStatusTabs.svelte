<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import {
		CalendarIcon,
		CircleCheckIcon,
		ListIcon,
		StopwatchIcon,
		XIcon
	} from '#lib/icons/outline/index.ts';
	import type { CanjeStatus } from '#lib/interfaces/index.ts';
	import { formatNumber } from '#lib/utils/index.ts';

	interface Props {
		/** Pestaña activa; null = todos los estados */
		status: CanjeStatus | null;
		/** Total de la pestaña activa; null mientras carga */
		total: number | null;
		onChange: (status: CanjeStatus | null) => void;
		/** Controles a la derecha de las pestañas (p. ej. filtro de sucursal) */
		toolbar?: Snippet;
		/** Contenido de la pestaña activa */
		children: Snippet;
	}

	let { status, total, onChange, toolbar, children }: Props = $props();

	const PANEL_ID = 'canjes-panel';

	const TABS: { value: CanjeStatus | null; label: string; icon: Component }[] = [
		{ value: 'PENDIENTE', label: 'Pendientes', icon: StopwatchIcon },
		{ value: 'CANJEADO', label: 'Canjeados', icon: CircleCheckIcon },
		{ value: 'EXPIRADO', label: 'Expirados', icon: CalendarIcon },
		{ value: 'CANCELADO', label: 'Cancelados', icon: XIcon },
		{ value: null, label: 'Todos', icon: ListIcon }
	];

	const tabId = (value: CanjeStatus | null) => `canjes-tab-${(value ?? 'todos').toLowerCase()}`;

	let tabElements = $state<HTMLButtonElement[]>([]);

	function select(value: CanjeStatus | null) {
		if (value !== status) onChange(value);
	}

	// Flechas, Inicio y Fin mueven el foco y activan la pestaña (patrón tablist de WAI-ARIA)
	function handleKeydown(event: KeyboardEvent, index: number) {
		const last = TABS.length - 1;
		const keys: Record<string, number> = {
			ArrowRight: index === last ? 0 : index + 1,
			ArrowLeft: index === 0 ? last : index - 1,
			Home: 0,
			End: last
		};
		const next = keys[event.key];
		if (next === undefined) return;

		event.preventDefault();
		tabElements[next]?.focus();
		select(TABS[next].value);
	}
</script>

<div class="mt-6">
	<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
		<div
			role="tablist"
			aria-label="Estado de los canjes"
			class="flex gap-1 overflow-x-auto rounded-xl bg-light-one_d p-1 sm:w-fit dark:bg-dark-one_d"
		>
			{#each TABS as tab, index (tab.label)}
				{@const selected = tab.value === status}
				<button
					bind:this={tabElements[index]}
					type="button"
					role="tab"
					id={tabId(tab.value)}
					aria-selected={selected}
					aria-controls={PANEL_ID}
					tabindex={selected ? 0 : -1}
					onclick={() => select(tab.value)}
					onkeydown={(event) => handleKeydown(event, index)}
					class={[
						'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:focus-visible:ring-dark-three',
						selected
							? 'bg-light-one text-light-two shadow-sm dark:bg-dark-one dark:text-dark-two'
							: 'text-light-two_d hover:text-light-two dark:text-dark-two_d dark:hover:text-dark-two'
					]}
				>
					<tab.icon class="size-4" />
					{tab.label}
					{#if selected && total !== null}
						<span
							class="rounded-full bg-light-one_d px-1.5 text-xs leading-5 tabular-nums dark:bg-dark-one_d"
						>
							{formatNumber(total)}
						</span>
					{/if}
				</button>
			{/each}
		</div>

		{#if toolbar}
			{@render toolbar()}
		{/if}
	</div>

	<div id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(status)}>
		{@render children()}
	</div>
</div>
