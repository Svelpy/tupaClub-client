<script lang="ts">
	import { backOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { scale } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { CanjeStatusBadge } from '#lib/components/features/panel/canjes/index.ts';
	import { Button, Sheet } from '#lib/components/ui/index.ts';
	import { CheckIcon, CopyIcon } from '#lib/icons/outline/index.ts';
	import type { CanjeDetail, Negocio, Vale } from '#lib/interfaces/index.ts';
	import {
		alert,
		formatCodigoCanje,
		formatDate,
		formatDateTime,
		formatNumber
	} from '#lib/utils/index.ts';

	interface Props {
		/** Canje recién creado; null = cerrado */
		canje: CanjeDetail | null;
		vale: Vale;
		negocio: Negocio;
		onClose: () => void;
	}

	let { canje, vale, negocio, onClose }: Props = $props();

	const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)', false);

	let copied = $state(false);
	let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

	async function copyCodigo(codigo: string) {
		try {
			await navigator.clipboard.writeText(codigo);
			copied = true;
			clearTimeout(copiedTimeout);
			copiedTimeout = setTimeout(() => (copied = false), 2000);
		} catch {
			alert('error', 'No se pudo copiar el código. Anótalo o toma una captura.');
		}
	}

	$effect(() => () => clearTimeout(copiedTimeout));
</script>

<Sheet
	open={canje !== null}
	title="¡Canje exitoso!"
	description="Presenta tu código en una sucursal de {negocio.nombre} para recibir tu vale."
	hideTitle
	{onClose}
>
	{#if canje}
		<!-- El título y la descripción visibles repiten los del diálogo (ocultos a lectores de pantalla) -->
		<div class="flex flex-col items-center pt-2 text-center" aria-hidden="true">
			<div
				in:scale={{ start: 0.4, duration: reducedMotion.current ? 0 : 450, easing: backOut }}
				class="flex size-20 items-center justify-center rounded-full bg-light-success/15 dark:bg-dark-success/15"
			>
				<span
					class="flex size-14 items-center justify-center rounded-full bg-light-success text-light-one shadow-lg dark:bg-dark-success dark:text-dark-one"
				>
					<CheckIcon class="size-8" />
				</span>
			</div>
			<p class="mt-4 text-2xl font-bold text-light-two dark:text-dark-two">¡Canje exitoso!</p>
			<p class="mt-1 max-w-xs text-sm text-light-two_d dark:text-dark-two_d">
				Presenta este código en una sucursal de
				<strong class="text-light-two dark:text-dark-two">{negocio.nombre}</strong>
				para recibir tu vale.
			</p>
		</div>

		<!-- Código de canje: el dato que el cliente necesita en la sucursal -->
		<div
			class="mt-5 rounded-2xl border-2 border-dashed border-light-three/25 bg-light-one_d/40 p-4 text-center dark:border-dark-three/25 dark:bg-dark-one_d/40"
		>
			<p
				class="text-xs font-semibold tracking-wider text-light-two_d uppercase dark:text-dark-two_d"
			>
				Tu código de canje
			</p>
			<p
				class="mt-1 font-mono text-3xl font-bold tracking-[0.15em] text-light-three tabular-nums select-all dark:text-dark-three"
			>
				{formatCodigoCanje(canje.codigo_canje)}
			</p>
			<button
				type="button"
				onclick={() => canje && copyCodigo(canje.codigo_canje)}
				class="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-light-one px-4 text-sm font-semibold text-light-three shadow-sm transition-colors hover:bg-light-one_d focus-visible:ring-2 focus-visible:ring-light-three/40 focus-visible:outline-none active:scale-95 dark:bg-dark-one dark:text-dark-three dark:hover:bg-dark-one_d dark:focus-visible:ring-dark-three/40"
			>
				{#if copied}
					<CheckIcon class="size-4 text-light-success dark:text-dark-success" />
				{:else}
					<CopyIcon class="size-4" />
				{/if}
				<span aria-live="polite">{copied ? '¡Copiado!' : 'Copiar código'}</span>
			</button>
		</div>

		<dl
			class="mt-5 divide-y divide-light-one_d rounded-2xl border border-light-one_d text-sm dark:divide-dark-one_d dark:border-dark-one_d"
		>
			<div class="flex items-start justify-between gap-4 px-4 py-3">
				<dt class="shrink-0 text-light-two_d dark:text-dark-two_d">Vale</dt>
				<dd class="text-right font-medium text-light-two dark:text-dark-two">{vale.nombre}</dd>
			</div>
			<div class="flex items-center justify-between gap-4 px-4 py-3">
				<dt class="text-light-two_d dark:text-dark-two_d">Puntos usados</dt>
				<dd class="font-semibold text-light-two tabular-nums dark:text-dark-two">
					{formatNumber(canje.total_puntos)} pts
				</dd>
			</div>
			<div class="flex items-center justify-between gap-4 px-4 py-3">
				<dt class="text-light-two_d dark:text-dark-two_d">Estado</dt>
				<dd><CanjeStatusBadge status={canje.status} /></dd>
			</div>
			<div class="flex items-center justify-between gap-4 px-4 py-3">
				<dt class="text-light-two_d dark:text-dark-two_d">Válido hasta</dt>
				<dd class="font-semibold text-light-two dark:text-dark-two">
					{formatDate(canje.expires_at)}
				</dd>
			</div>
			<div class="flex items-center justify-between gap-4 px-4 py-3">
				<dt class="text-light-two_d dark:text-dark-two_d">Fecha del canje</dt>
				<dd class="text-light-two dark:text-dark-two">{formatDateTime(canje.created_at)}</dd>
			</div>
		</dl>

		<p class="mt-3 text-center text-xs text-light-two_d dark:text-dark-two_d">
			También lo encontrarás en Mis canjes.
		</p>
	{/if}

	{#snippet footer()}
		<div class="flex flex-col gap-2 sm:flex-row-reverse">
			<Button fullWidth href={resolve('/app/mis-canjes')}>Ver mis canjes</Button>
			<Button
				variant="secondary"
				fullWidth
				href={resolve('/app/categorias/[categoriaId]', { categoriaId: vale.categoria_id })}
			>
				Seguir explorando
			</Button>
		</div>
	{/snippet}
</Sheet>
