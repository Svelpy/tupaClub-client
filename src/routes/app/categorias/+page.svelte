<script lang="ts">
	import { categories } from '#lib/data/mockData.ts';

	import { goto } from '$app/navigation';
</script>

<div class="relative w-full pb-8">
	<!-- Header -->
	<div class="rounded-b-[40px] bg-gradient-to-r from-brand-red to-rose-400 px-4 pt-10 pb-16">
		<div class="mb-2 flex items-center text-white">
			<button class="p-2" onclick={() => goto('/app')}>
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
			<h1 class="ml-2 text-xl font-bold tracking-wide">Categorías</h1>
		</div>
	</div>

	<!-- Categories Grid -->
	<div class="-mt-10 px-4">
		<div class="min-h-screen rounded-t-3xl bg-white px-2 pt-6 pb-20">
			<div class="grid grid-cols-3 gap-3">
				{#each categories as category}
					<a
						href={`/app/vales/${category.id}`}
						class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-transform active:scale-95"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-brand-blue"
						>
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
									d={category.icon}
								/>
							</svg>
						</div>
						<span
							class="flex h-8 items-center text-center text-[11px] leading-tight font-medium text-brand-blue"
							>{category.name}</span
						>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
