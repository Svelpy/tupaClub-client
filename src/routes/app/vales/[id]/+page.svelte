<script lang="ts">
	import { categories, merchants, vouchers } from '#lib/data/mockData.ts';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let categoryId = $derived(page.params.id);
	let category = $derived(categories.find((c) => c.id === categoryId) || categories[0]);
	let categoryVouchers = $derived(vouchers.filter((v) => v.categoryId === categoryId));
	// If no vouchers found for this category, just show all to demonstrate UI
	let displayVouchers = $derived(categoryVouchers.length > 0 ? categoryVouchers : vouchers);

	let selectedMerchant = $state('farmacorp');
</script>

<div class="relative min-h-screen w-full bg-brand-light-blue pb-20">
	<!-- Header -->
	<div class="rounded-b-[40px] bg-gradient-to-r from-brand-red to-rose-400 px-4 pt-10 pb-20">
		<div class="mb-6 flex items-center justify-between text-white">
			<div class="flex items-center">
				<button class="p-1" onclick={() => goto('/app/categorias')}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
				</button>
				<h1 class="ml-2 text-xl font-bold tracking-wide">{category.name}</h1>
			</div>
			<div class="p-2 opacity-80">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={category.icon} />
				</svg>
			</div>
		</div>

		<!-- Search Bar -->
		<div class="relative">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<svg
					class="h-5 w-5 text-brand-blue"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<input
				type="text"
				class="block w-full rounded-full border-none bg-white py-3 pr-3 pl-10 leading-5 text-gray-900 placeholder-brand-blue shadow-md focus:ring-2 focus:ring-white focus:outline-none sm:text-sm"
				placeholder="Buscar vales de consumo y/o cupones"
			/>
		</div>
	</div>

	<!-- Content -->
	<div class="-mt-6 px-4">
		<div class="min-h-screen rounded-t-3xl bg-white px-4 pt-8 pb-10">
			<h2 class="mb-4 text-xl font-bold text-gray-700">Canjea en estos comercios</h2>

			<!-- Merchants Horizontal Scroll -->
			<div class="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
				{#each merchants as merchant}
					<button class="relative flex-shrink-0" onclick={() => (selectedMerchant = merchant.id)}>
						<div
							class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 bg-white {selectedMerchant ===
							merchant.id
								? 'border-brand-blue'
								: 'border-gray-200'}"
						>
							<span class="text-xs font-bold text-brand-blue">{merchant.name}</span>
						</div>
						{#if selectedMerchant === merchant.id}
							<div
								class="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-blue shadow-sm"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3 w-3 text-white"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Vouchers Grid -->
			<div class="mt-8 grid grid-cols-2 gap-4">
				{#each displayVouchers as voucher}
					<div
						class="flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
					>
						<div class="flex flex-1 flex-col items-center bg-blue-50/50 p-3">
							<div class="mb-2 h-32 w-24 overflow-hidden rounded-md bg-gray-200">
								<!-- Mock Image -->
								<div
									class="flex h-full w-full items-center justify-center bg-blue-100 p-2 text-center text-xs text-brand-blue"
								>
									{voucher.title.split(' ')[0]}
								</div>
							</div>
							<div class="mb-1 text-center text-xs font-bold text-brand-blue">
								{merchants.find((m) => m.id === voucher.merchantId)?.name}
							</div>
							<p
								class="line-clamp-2 h-8 overflow-hidden text-center text-[10px] leading-tight text-gray-500"
							>
								{voucher.title}
							</p>
						</div>

						<!-- Dashed line separator -->
						<div
							class="relative flex h-4 w-full items-center justify-center overflow-hidden bg-white"
						>
							<div class="absolute left-[-8px] h-4 w-4 rounded-full bg-brand-light-blue"></div>
							<div class="mx-3 w-full border-t-2 border-dashed border-gray-200"></div>
							<div class="absolute right-[-8px] h-4 w-4 rounded-full bg-brand-light-blue"></div>
						</div>

						<div class="bg-white p-3 text-center">
							<div class="mb-3 flex items-center justify-center gap-1">
								<span class="text-sm text-yellow-500">🪙</span>
								<span class="text-lg font-bold text-gray-700">{voucher.points}</span>
								<span class="mt-1 text-[10px] font-bold text-gray-400">PTS</span>
							</div>
							<button
								class="w-full rounded-full bg-brand-blue px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-800 active:scale-95"
							>
								Ver más
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
