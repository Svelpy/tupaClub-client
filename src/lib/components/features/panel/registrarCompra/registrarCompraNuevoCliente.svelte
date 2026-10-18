<script lang="ts" module>
	import type { CreateClienteInput } from '#lib/zod/index.ts';

	/** Datos del cliente que se registra junto con la compra */
	export type NuevoClienteValues = Omit<CreateClienteInput, 'genero'> & {
		/** Vacío hasta que se elige en el select */
		genero: string;
	};

	export const emptyNuevoCliente = (ci = ''): NuevoClienteValues => ({
		ci,
		nombre: '',
		apellidos: '',
		telefono: '',
		genero: '',
		email: '',
		birth_date: '',
		direccion: ''
	});
</script>

<script lang="ts">
	import { Input, Select } from '#lib/components/ui/index.ts';
	import { USER_GENERO_LABEL } from '#lib/constants/index.ts';

	interface Props {
		values: NuevoClienteValues;
		fieldErrors?: Record<string, string>;
		disabled?: boolean;
	}

	let { values = $bindable(), fieldErrors = {}, disabled = false }: Props = $props();

	const GENEROS = Object.entries(USER_GENERO_LABEL);
	const today = new Date().toLocaleDateString('en-CA');
</script>

<div class="space-y-4">
	<p class="text-sm text-light-two_d dark:text-dark-two_d">
		Al registrar la compra se crea su cuenta de cliente y recibe los puntos de inmediato. Los campos
		con <span class="text-red-500">*</span> son obligatorios.
	</p>

	<fieldset class="grid gap-5 sm:grid-cols-2" {disabled}>
		<legend class="sr-only">Datos del cliente nuevo</legend>
		<Input
			id="nuevo-cliente-ci"
			label="Cédula de identidad"
			placeholder="Ej. 12345678"
			bind:value={values.ci}
			error={fieldErrors.ci}
			aria-invalid={!!fieldErrors.ci}
			autocomplete="off"
			required
		/>

		<Input
			id="nuevo-cliente-telefono"
			label="Teléfono"
			type="tel"
			inputmode="tel"
			placeholder="Ej. 71234567"
			bind:value={values.telefono}
			error={fieldErrors.telefono}
			aria-invalid={!!fieldErrors.telefono}
			autocomplete="off"
			required
		/>

		<Input
			id="nuevo-cliente-nombre"
			label="Nombre"
			placeholder="Ej. Ana"
			bind:value={values.nombre}
			error={fieldErrors.nombre}
			aria-invalid={!!fieldErrors.nombre}
			autocomplete="off"
			required
		/>

		<Input
			id="nuevo-cliente-apellidos"
			label="Apellidos (opcional)"
			placeholder="Ej. Pérez López"
			bind:value={values.apellidos}
			error={fieldErrors.apellidos}
			aria-invalid={!!fieldErrors.apellidos}
			autocomplete="off"
		/>

		<Select
			id="nuevo-cliente-genero"
			label="Género"
			bind:value={values.genero}
			error={fieldErrors.genero}
			aria-invalid={!!fieldErrors.genero}
			required
		>
			<option value="" disabled>Selecciona el género</option>
			{#each GENEROS as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</Select>

		<Input
			id="nuevo-cliente-birth-date"
			label="Fecha de nacimiento (opcional)"
			type="date"
			max={today}
			bind:value={values.birth_date}
			error={fieldErrors.birth_date}
			aria-invalid={!!fieldErrors.birth_date}
		/>

		<Input
			id="nuevo-cliente-email"
			label="Correo electrónico (opcional)"
			type="email"
			inputmode="email"
			placeholder="Ej. ana@example.com"
			bind:value={values.email}
			error={fieldErrors.email}
			aria-invalid={!!fieldErrors.email}
			autocomplete="off"
		/>

		<Input
			id="nuevo-cliente-direccion"
			label="Dirección (opcional)"
			placeholder="Ej. Avenida Principal 123"
			bind:value={values.direccion}
			error={fieldErrors.direccion}
			aria-invalid={!!fieldErrors.direccion}
			autocomplete="off"
		/>
	</fieldset>
</div>
