<script lang="ts" module>
	/** EXISTENTE = se busca por CI; NUEVO = se registra junto con la compra */
	export type ModoCliente = 'EXISTENTE' | 'NUEVO';
</script>

<script lang="ts">
	import type { Component } from 'svelte';
	import { SearchIcon, UserIcon } from '#lib/icons/outline/index.ts';

	interface Props {
		value: ModoCliente;
		disabled?: boolean;
		onChange: (value: ModoCliente) => void;
	}

	let { value, disabled = false, onChange }: Props = $props();

	const OPTIONS: { value: ModoCliente; title: string; description: string; icon: Component }[] = [
		{
			value: 'EXISTENTE',
			title: 'Ya es cliente',
			description: 'Búscalo por su cédula de identidad.',
			icon: SearchIcon
		},
		{
			value: 'NUEVO',
			title: 'Cliente nuevo',
			description: 'Es su primera compra: regístralo aquí.',
			icon: UserIcon
		}
	];
</script>

<!-- Radios nativos con aspecto de tarjeta: accesibles con teclado y lectores de pantalla -->
<fieldset {disabled}>
	<legend class="sr-only">¿El cliente ya está registrado?</legend>
	<div class="grid gap-3 sm:grid-cols-2">
		{#each OPTIONS as option (option.value)}
			{@const selected = option.value === value}
			<label
				class={[
					'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-light-three has-disabled:cursor-not-allowed has-disabled:opacity-60 dark:has-focus-visible:ring-dark-three',
					selected
						? 'border-light-three bg-light-three/10 dark:border-dark-three dark:bg-dark-three/10'
						: 'border-light-one_d hover:border-light-four dark:border-dark-one_d dark:hover:border-dark-four'
				]}
			>
				<input
					type="radio"
					name="registrar-compra-modo-cliente"
					value={option.value}
					checked={selected}
					onchange={() => onChange(option.value)}
					class="sr-only"
				/>
				<span
					class={[
						'inline-flex size-10 shrink-0 items-center justify-center rounded-full',
						selected
							? 'bg-light-three text-light-one dark:bg-dark-three dark:text-dark-one'
							: 'bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three'
					]}
					aria-hidden="true"
				>
					<option.icon class="size-5" />
				</span>
				<span class="min-w-0">
					<span class="block font-semibold text-light-two dark:text-dark-two">{option.title}</span>
					<span class="block text-sm text-light-two_d dark:text-dark-two_d">
						{option.description}
					</span>
				</span>
			</label>
		{/each}
	</div>
</fieldset>
