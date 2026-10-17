<script lang="ts">
	import { Select } from '#lib/components/ui/index.ts';
	import { NEGOCIO_TIPO_LABEL } from '#lib/constants/index.ts';
	import type { NegocioTipo } from '#lib/interfaces/index.ts';

	interface Props {
		/** null = todos los tipos */
		tipo: NegocioTipo | null;
		disabled?: boolean;
		onTipoChange: (tipo: NegocioTipo | null) => void;
	}

	let { tipo, disabled = false, onTipoChange }: Props = $props();

	const TIPOS = Object.entries(NEGOCIO_TIPO_LABEL) as [NegocioTipo, string][];

	function handleChange(event: Event & { currentTarget: HTMLSelectElement }) {
		const value = event.currentTarget.value;
		onTipoChange(value ? (value as NegocioTipo) : null);
	}
</script>

<div class="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
	<label
		for="negocios-tipo"
		class="text-sm font-medium whitespace-nowrap text-light-two dark:text-dark-two"
	>
		Tipo de negocio
	</label>
	<Select
		id="negocios-tipo"
		value={tipo ?? ''}
		onchange={handleChange}
		{disabled}
		class="w-full sm:w-48"
	>
		<option value="">Todos</option>
		{#each TIPOS as [value, label] (value)}
			<option {value}>{label}</option>
		{/each}
	</Select>
</div>
