<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { InstallAppButton } from '#lib/components/features/landing/index.ts';
	import { LegalLinks } from '#lib/components/features/legal/index.ts';
	import { MainLayout } from '#lib/components/layout/index.ts';
	import { Button } from '#lib/components/ui/index.ts';
	import { APP_SITE_CONFIG } from '#lib/constants/index.ts';
	import {
		ArrowUpRightIcon,
		CheckCircleIcon,
		GiftIcon,
		MapPinIcon,
		ShoppingCartIcon,
		SparklesIcon,
		TicketIcon,
		UserIcon
	} from '#lib/icons/outline/index.ts';

	const SVELPY_URL = 'https://svelpy.com';

	// Sucursales de Farmatupa, la empresa dueña de la app
	const NEGOCIO_NOMBRE = 'Farmatupa';
	const sucursales = [
		{
			nombre: 'Central',
			direccion: 'Mercado 24 de Junio',
			mapaUrl: 'https://maps.app.goo.gl/B4nwLrT5spHrgrcd9'
		},
		{
			nombre: 'Sucursal 1',
			direccion: 'Av. Comercio, Entrada al Mercado Municipal',
			mapaUrl: 'https://maps.app.goo.gl/XgmGQR9VVyuSjKjJA'
		}
	];

	const pasos = [
		{
			icon: UserIcon,
			titulo: 'Regístrate',
			texto: 'Crea tu cuenta gratis con tu cédula en pocos segundos.'
		},
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

	// Ventajas que se resumen bajo los botones del hero (salen de lo que ya dice la página)
	//const ventajas = ['Gratis', 'Con tu cédula', 'Desde el celular'];

	// Pestañas de la app de muestra, solo ilustrativas
	const pestanas = [
		{ icon: SparklesIcon, label: 'Inicio', activa: true },
		{ icon: GiftIcon, label: 'Vales', activa: false },
		{ icon: TicketIcon, label: 'Canjes', activa: false },
		{ icon: UserIcon, label: 'Perfil', activa: false }
	];
</script>

<!-- Cruz de farmacia -->
{#snippet cruz(clase: string)}
	<svg viewBox="0 0 24 24" fill="currentColor" class={clase} aria-hidden="true">
		<path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
	</svg>
{/snippet}

<MainLayout
	title={`${APP_SITE_CONFIG.APP_NAME} · ${APP_SITE_CONFIG.APP_SLOGAN}`}
	description={APP_SITE_CONFIG.APP_DESCRIPTION}
	keywords={APP_SITE_CONFIG.APP_KEYWORDS}
	class="min-h-dvh bg-light-one text-light-two dark:bg-dark-one dark:text-dark-two"
>
	<!-- Cabecera y portada sobre un degradado suave -->
	<div
		class="relative overflow-hidden bg-linear-to-b from-light-one_d to-light-one dark:from-dark-one_d dark:to-dark-one"
	>
		<!-- Destellos de color de fondo -->
		<div
			class="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-light-three/10 blur-3xl dark:bg-dark-three/10"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute top-1/2 -left-32 size-80 rounded-full bg-light-accent/5 blur-3xl dark:bg-dark-accent/5"
			aria-hidden="true"
		></div>

		<header
			class="relative container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-6"
		>
			<a href={resolve('/')} class="flex items-center gap-2.5">
				<img
					src={asset('images/logo_app.webp')}
					alt=""
					width="40"
					height="40"
					class="size-10 rounded-xl object-cover shadow-sm ring-1 ring-light-four dark:ring-dark-four"
				/>
				<span class="text-lg font-bold tracking-tight">{APP_SITE_CONFIG.APP_NAME}</span>
			</a>
			<Button href={resolve('/auth/sign-in')} variant="ghost" size="sm">Iniciar sesión</Button>
		</header>

		<!-- Portada -->
		<section
			class="relative container mx-auto grid items-center gap-12 px-4 pt-6 pb-16 md:px-6 lg:grid-cols-2 lg:pt-12 lg:pb-24"
		>
			<div class="space-y-6 text-center lg:text-left">
				<span
					class="inline-flex items-center gap-2 rounded-full border border-light-three/15 bg-light-one px-3.5 py-1.5 text-sm font-medium text-light-three shadow-sm dark:border-dark-three/15 dark:bg-dark-one dark:text-dark-three"
				>
					{@render cruz('size-3.5 text-light-accent dark:text-dark-accent')}
					{APP_SITE_CONFIG.APP_SLOGAN}
				</span>
				<h1 class="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
					Compra, suma puntos y
					<span class="text-light-three dark:text-dark-three">canjéalos por vales</span>
				</h1>
				<p class="mx-auto max-w-md text-lg text-light-two_d lg:mx-0 dark:text-dark-two_d">
					{APP_SITE_CONFIG.APP_NAME} premia cada compra que haces en los negocios afiliados. Revisa tu
					saldo y tus canjes desde el celular.
				</p>
				<div class="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
					<Button href={resolve('/auth/sign-up')} variant="primary" size="lg"
						>Crear mi cuenta</Button
					>
					<Button href={resolve('/auth/sign-in')} variant="outline" size="lg"
						>Ya tengo cuenta</Button
					>
				</div>
				<!-- Solo aparece si el navegador permite instalar (Android/Chrome) o en iPhone/iPad -->
				<InstallAppButton />
				<!-- <ul
					class="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-light-two_d lg:justify-start dark:text-dark-two_d"
				>
					{#each ventajas as ventaja (ventaja)}
						<li class="flex items-center gap-1.5">
							<CheckCircleIcon class="size-4 text-light-three dark:text-dark-three" />
							{ventaja}
						</li>
					{/each}
				</ul> -->
			</div>

			<!-- Teléfono de muestra con la pantalla de inicio de la app -->
			<div class="relative mx-auto w-full max-w-[17rem] sm:max-w-xs" aria-hidden="true">
				<div
					class="rounded-[2.5rem] bg-light-two p-2.5 shadow-2xl ring-1 ring-light-four/40 dark:bg-dark-two dark:ring-dark-four/40"
				>
					<div class="overflow-hidden rounded-4xl bg-light-one dark:bg-dark-one">
						<!-- Notch -->
						<div class="mx-auto mt-2.5 h-5 w-24 rounded-full bg-light-two dark:bg-dark-two"></div>

						<div class="space-y-4 px-4 pt-4 pb-5">
							<p class="text-sm text-light-two_d dark:text-dark-two_d">Hola 👋</p>

							<!-- Saldo de puntos -->
							<div
								class="relative overflow-hidden rounded-2xl bg-linear-to-br from-light-three to-light-three_d p-5 text-light-one shadow-lg dark:from-dark-three dark:to-dark-three_d dark:text-dark-one"
							>
								<div
									class="absolute -top-8 -right-8 size-28 rounded-full bg-light-one/10 dark:bg-dark-one/10"
								></div>
								<p class="relative flex items-center gap-1.5 text-xs font-medium opacity-80">
									<SparklesIcon class="size-3.5" />
									Tus puntos
								</p>
								<p class="relative mt-1 text-4xl font-bold tabular-nums">1.250</p>
								<p class="relative text-xs opacity-80">puntos disponibles</p>
							</div>

							<!-- Vales -->
							<p class="text-sm font-semibold">Vales para canjear</p>
							<div class="space-y-2">
								{#each [1, 2] as n (n)}
									<div
										class="flex items-center gap-3 rounded-xl border border-light-one_d bg-light-one p-2.5 dark:border-dark-one_d dark:bg-dark-one"
									>
										<span
											class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
										>
											<GiftIcon class="size-4" />
										</span>
										<div class="min-w-0">
											<p class="truncate text-xs font-semibold">Vale de descuento</p>
											<p class="truncate text-[10px] text-light-two_d dark:text-dark-two_d">
												Presenta tu código en caja
											</p>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Barra de pestañas -->
						<div
							class="flex justify-around border-t border-light-one_d px-2 py-2.5 dark:border-dark-one_d"
						>
							{#each pestanas as pestana (pestana.label)}
								<div
									class={[
										'flex flex-col items-center gap-0.5 text-[10px] font-medium',
										pestana.activa
											? 'text-light-three dark:text-dark-three'
											: 'text-light-two_d dark:text-dark-two_d'
									]}
								>
									<pestana.icon class="size-5" />
									{pestana.label}
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Aviso flotante -->
				<div
					class="absolute bottom-24 -left-6 hidden items-center gap-2 rounded-2xl border border-light-one_d bg-light-one px-3 py-2 text-xs font-semibold shadow-xl sm:flex dark:border-dark-one_d dark:bg-dark-one"
				>
					<CheckCircleIcon class="size-5 text-light-success dark:text-dark-success" />
					Vale canjeado
				</div>
			</div>
		</section>
	</div>

	<main>
		<!-- Cómo funciona -->
		<section class="container mx-auto px-4 py-16 md:px-6" aria-labelledby="como-funciona-titulo">
			<div class="text-center">
				<p class="text-sm font-semibold text-light-three dark:text-dark-three">Paso a paso</p>
				<h2 id="como-funciona-titulo" class="mt-1 text-3xl font-bold tracking-tight">
					¿Cómo funciona?
				</h2>
			</div>
			<ol class="mt-10 grid gap-4 md:grid-cols-3">
				{#each pasos as paso, i (paso.titulo)}
					<li
						class="rounded-3xl border border-light-one_d bg-light-one p-6 shadow-sm dark:border-dark-one_d dark:bg-dark-one"
					>
						<div class="flex items-center justify-between gap-3">
							<span
								class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-light-three to-light-three_d text-light-one shadow-md dark:from-dark-three dark:to-dark-three_d dark:text-dark-one"
							>
								<paso.icon class="size-6" />
							</span>
							<span
								class="rounded-full bg-light-one_d px-3 py-1 text-xs font-semibold text-light-three dark:bg-dark-one_d dark:text-dark-three"
							>
								Paso {i + 1}
							</span>
						</div>
						<h3 class="mt-5 text-lg font-semibold">{paso.titulo}</h3>
						<p class="mt-1 text-light-two_d dark:text-dark-two_d">{paso.texto}</p>
					</li>
				{/each}
			</ol>
		</section>

		<!-- Dónde sumar puntos -->
		<section
			class="bg-linear-to-b from-light-one to-light-one_d py-16 dark:from-dark-one dark:to-dark-one_d"
			aria-labelledby="sucursales-titulo"
		>
			<div class="container mx-auto px-4 md:px-6">
				<div class="text-center">
					<span
						class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-light-one text-light-accent shadow-sm dark:bg-dark-one dark:text-dark-accent"
					>
						{@render cruz('size-6')}
					</span>
					<h2 id="sucursales-titulo" class="mt-4 text-3xl font-bold tracking-tight">
						Dónde sumar puntos
					</h2>
					<p class="mx-auto mt-3 max-w-md text-light-two_d dark:text-dark-two_d">
						Suma puntos en cada compra en las sucursales de {NEGOCIO_NOMBRE}.
					</p>
				</div>
				<ul class="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
					{#each sucursales as sucursal (sucursal.nombre)}
						<li
							class="flex flex-col rounded-3xl border border-light-one_d bg-light-one p-6 shadow-sm dark:border-dark-one_d dark:bg-dark-one"
						>
							<span
								class="flex size-11 items-center justify-center rounded-2xl bg-light-one_d text-light-three dark:bg-dark-one_d dark:text-dark-three"
								aria-hidden="true"
							>
								<MapPinIcon class="size-5" />
							</span>
							<h3 class="mt-4 text-lg font-semibold">{NEGOCIO_NOMBRE} · {sucursal.nombre}</h3>
							<p class="mt-1 flex-1 text-light-two_d dark:text-dark-two_d">{sucursal.direccion}</p>
							<Button
								href={sucursal.mapaUrl}
								target="_blank"
								rel="noopener noreferrer"
								variant="outline"
								size="md"
								class="mt-5 w-full"
							>
								Cómo llegar
								{#snippet rightIcon()}<ArrowUpRightIcon class="size-4" />{/snippet}
							</Button>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- Llamado final -->
		<section class="container mx-auto px-4 py-16 md:px-6">
			<div
				class="relative overflow-hidden rounded-3xl bg-linear-to-br from-light-three to-light-three_d px-6 py-12 text-center text-light-one shadow-xl md:px-12 md:py-16 dark:from-dark-three dark:to-dark-three_d dark:text-dark-one"
			>
				<div
					class="absolute -top-16 -right-16 size-64 rounded-full bg-light-one/10 dark:bg-dark-one/10"
					aria-hidden="true"
				></div>
				<div
					class="absolute -bottom-20 -left-12 size-56 rounded-full bg-light-one/5 dark:bg-dark-one/5"
					aria-hidden="true"
				></div>
				<div class="relative flex flex-col items-center gap-5">
					<h2 class="text-3xl font-bold tracking-tight md:text-4xl">Empieza a sumar hoy</h2>
					<p class="max-w-md text-lg text-light-one/80 dark:text-dark-one/80">
						Regístrate gratis y presenta tu usuario en tu próxima compra.
					</p>
					<a
						href={resolve('/auth/sign-up')}
						class="rounded-xl bg-light-one px-8 py-3.5 text-lg font-semibold text-light-three shadow-lg transition-transform active:scale-95 dark:bg-dark-one dark:text-dark-three"
					>
						Crear mi cuenta
					</a>
				</div>
			</div>
		</section>
	</main>

	<footer
		class="space-y-4 border-t border-light-one_d py-8 text-center text-sm text-light-two_d dark:border-dark-one_d dark:text-dark-two_d"
	>
		<!-- Crédito de la empresa desarrolladora -->
		<div class="flex flex-col items-center gap-1">
			<p>Aplicación desarrollada por</p>
			<!-- Fondo blanco fijo: el logo es oscuro y no se vería en modo oscuro -->
			<a
				href={SVELPY_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-xl bg-white px-3 shadow-sm ring-1 ring-light-four transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-light-three focus-visible:outline-none dark:ring-dark-four dark:focus-visible:ring-dark-three"
			>
				<img
					src={asset('logos/Svelpy_Logo_Horizontal.webp')}
					alt="Svelpy"
					width="160"
					height="60"
					loading="lazy"
					class="h-14 w-auto"
				/>
				<span class="sr-only">(se abre en una pestaña nueva)</span>
			</a>
			<a
				href={SVELPY_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="font-medium text-light-three hover:underline dark:text-dark-three"
			>
				svelpy.com
			</a>
		</div>

		<LegalLinks />
		<p>© {new Date().getFullYear()} {APP_SITE_CONFIG.APP_NAME}</p>
	</footer>
</MainLayout>
