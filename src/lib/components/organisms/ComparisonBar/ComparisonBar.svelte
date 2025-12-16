<script lang="ts">
	import { comparisonStore, type DinoComparisonItem } from '$lib/stores/comparison';
	import { Button } from '$lib/components/ui/button';
	import { fade, fly } from 'svelte/transition';

	let items: DinoComparisonItem[] = [];
	comparisonStore.subscribe((val) => (items = val));
</script>

{#if items.length > 0}
	<div
		transition:fly={{ y: 200, duration: 300 }}
		class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 p-4 shadow-2xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90"
	>
		<div class="container mx-auto flex items-center justify-between">
			<div class="flex items-center gap-4">
				{#each items as item}
					<div
						class="flex items-center gap-2 rounded-full bg-gray-100 py-1 pl-1 pr-3 dark:bg-gray-800"
					>
						<img src={item.image} alt={item.name} class="h-8 w-8 rounded-full object-cover" />
						<span class="text-sm font-medium dark:text-gray-200">{item.name}</span>
						<button
							onclick={() => comparisonStore.remove(item.name)}
							class="ml-1 text-gray-400 hover:text-red-500">×</button
						>
					</div>
				{/each}
				{#if items.length < 2}
					<div class="text-sm italic text-gray-400">Select 1 more to compare</div>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<Button
					variant="ghost"
					size="sm"
					onclick={() => comparisonStore.clear()}
					class="text-gray-500 hover:text-red-500"
				>
					Clear
				</Button>
				<Button
					href="/compare"
					disabled={items.length < 2}
					class="bg-teal-600 text-white hover:bg-teal-700"
				>
					Compare Now ({items.length}/2)
				</Button>
			</div>
		</div>
	</div>
{/if}
