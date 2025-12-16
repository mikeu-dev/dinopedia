<script lang="ts">
	import { favoritesStore, type DinoFavoriteItem } from '$lib/stores/favorites';
	import { Button } from '$lib/components/ui/button';
	import DinosaurCard from '$lib/components/organisms/DinosaurCard/DinosaurCard.svelte';
	import { fade } from 'svelte/transition';

	let items: DinoFavoriteItem[] = [];

	favoritesStore.subscribe((val) => (items = val));
</script>

<div class="container mx-auto min-h-screen px-4 py-8 md:px-20">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="flex items-center gap-2 text-3xl font-bold dark:text-white">
				My Favorites <span class="text-red-500">❤️</span>
			</h1>
			<p class="mt-2 text-gray-500">Your personal collection of favorite dinosaurs.</p>
		</div>
		<Button href="/dinosaur" variant="outline">← Back to List</Button>
	</div>

	{#if items.length === 0}
		<div
			class="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center dark:border-gray-700 dark:bg-gray-800/50"
		>
			<div class="mb-4 text-4xl">🦖</div>
			<h2 class="mb-2 text-xl font-semibold dark:text-gray-200">No favorites yet</h2>
			<p class="mb-6 text-gray-500">
				Start exploring and calculating which dinosaurs are worthy of your collection!
			</p>
			<Button href="/dinosaur" variant="default" class="bg-teal-600 text-white hover:bg-teal-700">
				Explore Dinosaurs
			</Button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each items as item (item.name)}
				<div transition:fade>
					<!-- Reuse DinosaurCard but we need to map the flat item back to the structure expected by the card if needed. 
                         However, looking at DinosaurCard usage, it expects a dinosaur object. 
                         Our stored item has flattened properties. We'll reconstruct a minimal object. -->
					<DinosaurCard
						dinosaur={{
							name: item.name,
							description: item.description,
							diet: item.diet,
							temporalRange: item.era,
							image: item.image ? { imageURL: item.image } : null
						}}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
