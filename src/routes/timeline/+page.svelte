<script lang="ts">
	import { onMount } from 'svelte';
	import { searchDinos } from '$lib/api/dinosaur';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { fade } from 'svelte/transition';

	let loading = true;
	let dinosaurs: any[] = [];
	let groupedDinos: { [key: string]: any[] } = {};

	// Hardcoded eras for sorting order
	const ERA_ORDER = ['Triassic', 'Jurassic', 'Cretaceous'];

	onMount(async () => {
		try {
			// Fetch a large number to get "all" for the timeline
			// In a real app with thousands, we'd want a dedicated lightweight endpoint
			const res = await searchDinos({ limit: 100 });
			dinosaurs = res.data;
			groupDinosaurs();
		} catch (e) {
			console.error('Failed to load timeline data', e);
		} finally {
			loading = false;
		}
	});

	function groupDinosaurs() {
		// Group by era
		const groups: { [key: string]: any[] } = {};
		dinosaurs.forEach((dino) => {
			// Simple normalization: Check if string contains the Era name
			let era = 'Unknown';
			if (dino.temporalRange.includes('Triassic')) era = 'Triassic';
			else if (dino.temporalRange.includes('Jurassic')) era = 'Jurassic';
			else if (dino.temporalRange.includes('Cretaceous')) era = 'Cretaceous';

			if (!groups[era]) groups[era] = [];
			groups[era].push(dino);
		});
		groupedDinos = groups;
	}
</script>

<div class="container mx-auto min-h-screen px-4 py-8 md:px-20">
	<div class="mb-12 flex items-center justify-between">
		<div>
			<h1 class="flex items-center gap-2 text-4xl font-extrabold dark:text-white">
				Evolution Timeline ⏳
			</h1>
			<p class="mt-2 text-gray-500">Explore the Age of Dinosaurs through time.</p>
		</div>
		<Button href="/dinosaur" variant="outline">← Back to List</Button>
	</div>

	{#if loading}
		<div class="flex justify-center py-20">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600"></div>
		</div>
	{:else}
		<div
			class="relative ml-4 snap-x space-y-16 overflow-x-auto border-l-4 border-gray-200 pb-8 md:ml-0 md:mt-20 md:flex md:gap-8 md:space-y-0 md:border-l-0 md:border-t-4 md:pb-20 dark:border-gray-700"
		>
			{#each ERA_ORDER as era}
				{#if groupedDinos[era] && groupedDinos[era].length > 0}
					<!-- Era Section -->
					<div class="relative shrink-0 snap-start pl-8 md:w-[400px] md:pl-0 md:pt-8">
						<!-- Marker -->
						<div
							class="absolute -left-[11px] z-10 h-5 w-5 rounded-full border-4 border-white bg-teal-600 shadow-lg md:-top-[11px] md:left-1/2 md:-translate-x-1/2 dark:border-gray-900"
						></div>

						<!-- Era Title -->
						<div class="mb-6 md:text-center">
							<h2
								class="absolute -top-8 -z-10 select-none text-3xl font-black uppercase tracking-widest text-gray-200 md:left-1/2 md:w-full md:-translate-x-1/2 dark:text-gray-800"
							>
								{era}
							</h2>
							<div class="text-2xl font-bold text-teal-700 dark:text-teal-400">{era} Period</div>
							<div class="text-sm text-gray-500">
								{#if era === 'Triassic'}
									~252 - 201 MYA
								{:else if era === 'Jurassic'}
									~201 - 145 MYA
								{:else if era === 'Cretaceous'}
									~145 - 66 MYA
								{/if}
							</div>
						</div>

						<!-- Cards in this Era -->
						<div class="space-y-4">
							{#each groupedDinos[era] as dino}
								<a
									href="/dinosaur/{dino.name}"
									class="group relative block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-900"
								>
									<div class="flex items-center gap-4">
										<div
											class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
										>
											{#if dino.images && dino.images[0]}
												<!-- Note: This assumes image structure. In dinosaur list we used a helper or direct URL logic. 
                                                      To be safe we might want to just show name and small details first or fetch images smarter.
                                                      For now, let's use a reliable placeholder or just the text if image is complex. -->
												<div
													class="flex h-full w-full items-center justify-center text-xs text-gray-400"
												>
													IMG
												</div>
											{:else}
												<div
													class="flex h-full w-full items-center justify-center text-xs text-gray-400"
												>
													🦕
												</div>
											{/if}
										</div>
										<div>
											<h3
												class="font-bold text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white"
											>
												{dino.name}
											</h3>
											<p class="line-clamp-2 text-xs text-gray-500">{dino.description}</p>
										</div>
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
