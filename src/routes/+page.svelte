<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { InstallAppButton } from '#lib/components/features/landing/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { APP_SITE_CONFIG } from '#lib/constants/index.ts';
	import { NivelIcon } from '#lib/icons/niveles/index.ts';
	import { GiftIcon, ShoppingCartIcon, SparklesIcon } from '#lib/icons/outline/index.ts';
	//import type { NivelCliente } from '#lib/interfaces/index.ts';

	const pasos = [
		{
			icon: ShoppingCartIcon,
			titulo: 'Compra y suma',
			texto: 'Cada compra en los negocios afiliados te da puntos al instante.'
		},

		{
			icon: GiftIcon,
			titulo: 'Canjea vales',
			texto: 'Usa tus puntos en vales y preséntalos en caja con tu código.'
		}
	];

	//const niveles: NivelCliente[] = ['BRONCE', 'PLATA', 'ORO', 'DIAMANTE'];
</script>

<MainLayout
	title={`${APP_SITE_CONFIG.APP_NAME} · Programa de fidelización`}
	description={APP_SITE_CONFIG.APP_DESCRIPTION}
	keywords={APP_SITE_CONFIG.APP_KEYWORDS}
	class="min-h-dvh bg-light-one text-light-two dark:bg-dark-one dark:text-dark-two"
>
	<!-- Barra superior -->
	<header class="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-6">
		<a href={resolve('/')} class="flex items-center gap-2.5">
			<img
				src={asset('images/logo_app.webp')}
				alt=""
				width="40"
				height="40"
				class="size-10 rounded-xl object-cover ring-1 ring-light-four dark:ring-dark-four"
			/>
			<span class="text-lg font-bold tracking-tight">{APP_SITE_CONFIG.APP_NAME}</span>
		</a>
		<Button href={resolve('/auth/sign-in')} variant="ghost" size="sm">Iniciar sesión</Button>
	</header>

	<main>
		<!-- Hero -->
		<section
			class="container mx-auto grid items-center gap-10 px-4 pt-8 pb-16 md:grid-cols-2 md:px-6 md:pt-16 md:pb-24"
		>
			<div class="space-y-6 text-center md:text-left">
				<span
					class="inline-flex items-center gap-2 rounded-full bg-light-one_d px-3 py-1 text-sm font-medium text-light-three dark:bg-dark-one_d dark:text-dark-three"
				>
					<SparklesIcon class="size-4" />
					Tu lealtad tiene premio
				</span>
				<h1 class="text-4xl leading-tight font-bold tracking-tight md:text-5xl">
					Compra, suma puntos y
					<span class="text-light-three dark:text-dark-three">canjéalos por vales</span>
				</h1>
				<p class="mx-auto max-w-md text-lg text-light-two_d md:mx-0 dark:text-dark-two_d">
					{APP_SITE_CONFIG.APP_NAME} premia cada compra que haces en los negocios afiliados. Revisa tu
					saldo, tu nivel y tus canjes desde el celular.
				</p>
				<div class="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
					<Button href={resolve('/auth/sign-up')} variant="primary" size="lg">
						Crear mi cuenta
					</Button>
					<Button href={resolve('/auth/sign-in')} variant="outline" size="lg">
						Ya tengo cuenta
					</Button>
				</div>
				<!-- Solo aparece si el navegador permite instalar (Android/Chrome) o en iPhone/iPad -->
				<InstallAppButton />
			</div>

			<!-- Tarjeta de muestra, al estilo del resumen de puntos del cliente -->
			<div class="mx-auto w-full max-w-sm" aria-hidden="true">
				<div
					class="space-y-6 rounded-3xl bg-light-three p-6 text-light-one shadow-2xl md:rotate-2 md:p-8 dark:bg-dark-three dark:text-dark-one"
				>
					<div class="flex items-center justify-between gap-3">
						<div>
							<p
								class="flex items-center gap-2 text-sm font-medium text-light-one/80 dark:text-dark-one/80"
							>
								<SparklesIcon class="size-4" />
								Tus puntos
							</p>
							<p class="mt-1 text-5xl font-bold tabular-nums">1.250</p>
						</div>
						<div class="flex flex-col items-center gap-1.5">
							<NivelIcon nivel="ORO" class="size-16" />
							<span
								class="rounded-full bg-light-one/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase dark:bg-dark-one/15"
							>
								Oro
							</span>
						</div>
					</div>
					<div class="space-y-2">
						<div class="h-2.5 overflow-hidden rounded-full bg-light-one/20 dark:bg-dark-one/20">
							<div class="h-full w-2/3 rounded-full bg-light-one dark:bg-dark-one"></div>
						</div>
						<p class="text-sm text-light-one/90 dark:text-dark-one/90">
							Te faltan <strong class="font-semibold">750 pts</strong> para Diamante
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Cómo funciona -->
		<section class="bg-light-one_d/40 py-16 dark:bg-dark-one_d/40">
			<div class="container mx-auto px-4 md:px-6">
				<h2 class="text-center text-3xl font-bold tracking-tight">¿Cómo funciona?</h2>
				<ol class="mt-10 grid gap-4 md:grid-cols-3">
					{#each pasos as paso, i (paso.titulo)}
						<li
							class="rounded-2xl border border-light-one_d bg-light-one p-6 dark:border-dark-one_d dark:bg-dark-one"
						>
							<div class="flex items-center gap-3">
								<span
									class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
								>
									<paso.icon class="size-6" />
								</span>
								<span class="text-sm font-semibold text-light-two_d dark:text-dark-two_d"
									>Paso {i + 1}</span
								>
							</div>
							<h3 class="mt-4 text-lg font-semibold">{paso.titulo}</h3>
							<p class="mt-1 text-light-two_d dark:text-dark-two_d">{paso.texto}</p>
						</li>
					{/each}
				</ol>
			</div>
		</section>

		<!-- Niveles -->
		<!-- <section class="container mx-auto px-4 py-16 text-center md:px-6">
			<h2 class="text-3xl font-bold tracking-tight">Cuatro niveles, más beneficios</h2>
			<p class="mx-auto mt-3 max-w-md text-light-two_d dark:text-dark-two_d">
				Tu nivel sube con los puntos que acumulas. Empiezas en Bronce y puedes llegar a Diamante.
			</p>
			<ul class="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
				{#each niveles as nivel (nivel)}
					<li class="flex flex-col items-center gap-2">
						<NivelIcon {nivel} class="size-16" />
						<span class="font-semibold">{NIVEL_CLIENTE_LABEL[nivel]}</span>
					</li>
				{/each}
			</ul>
		</section> -->

		<!-- Llamado final -->
		<section class="container mx-auto px-4 pb-16 md:px-6">
			<div
				class="flex flex-col items-center gap-5 rounded-3xl bg-light-three px-6 py-12 text-center text-light-one dark:bg-dark-three dark:text-dark-one"
			>
				<h2 class="text-2xl font-bold tracking-tight md:text-3xl">Empieza a sumar hoy</h2>
				<p class="max-w-md text-light-one/80 dark:text-dark-one/80">
					Regístrate gratis y presenta tu usuario en tu próxima compra.
				</p>
				<a
					href={resolve('/auth/sign-up')}
					class="rounded-lg bg-light-one px-6 py-3 text-lg font-semibold text-light-three shadow-md transition-transform active:scale-95 dark:bg-dark-one dark:text-dark-three"
				>
					Crear mi cuenta
				</a>
			</div>
		</section>
	</main>

	<footer
		class="border-t border-light-one_d py-6 text-center text-sm text-light-two_d dark:border-dark-one_d dark:text-dark-two_d"
	>
		© {new Date().getFullYear()}
		{APP_SITE_CONFIG.APP_NAME}
	</footer>
</MainLayout>
