<script lang="ts">
	import { comparisonStore, type DinoComparisonItem } from '$lib/stores/comparison';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { DinosaurClasification } from '$lib/components/molecules';
	import { getDinoByName } from '$lib/api/dinosaur';

	let items: DinoComparisonItem[] = [];
	let dinoData: any[] = [];
	let loading = true;

	comparisonStore.subscribe((val) => (items = val));

	onMount(async () => {
		if (items.length === 0) {
			goto('/dinosaur');
			return;
		}

		// Fetch full data for each selected dinosaur
		try {
			const promises = items.map((item) => getDinoByName(item.name));
			dinoData = await Promise.all(promises);
		} catch (e) {
			console.error('Failed to load comparison data', e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto min-h-screen px-4 py-8 md:px-20">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold dark:text-white">Dinosaur Comparison</h1>
		<Button href="/dinosaur" variant="outline">← Back to List</Button>
	</div>

	{#if loading}
		<div class="py-20 text-center">Loading comparisons...</div>
	{:else if dinoData.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<th class="w-1/4 p-4 text-left">Attribute</th>
						{#each dinoData as dino}
							<th
								class="w-1/3 min-w-[250px] rounded-t-xl border-b border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800"
							>
								<div class="flex flex-col items-center gap-3">
									<div
										class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-sm"
									>
										<!-- Use thumbnail from store or default -->
										<img
											src={items.find((i) => i.name === dino.name)?.image || '/placeholder.png'}
											alt={dino.name}
											class="h-full w-full object-contain"
										/>
									</div>
									<a
										href="/dinosaur/{dino.name}"
										class="text-xl font-bold text-teal-600 hover:underline">{dino.name}</a
									>
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
					<!-- Taxonomy -->
					<tr class="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<td class="p-4 text-xs font-semibold uppercase text-gray-500">Taxonomy</td>
						{#each dinoData as dino}
							<td class="p-4 align-top">
								<DinosaurClasification classification={dino.classificationInfo} />
							</td>
						{/each}
					</tr>

					<!-- Diet -->
					<tr class="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<td class="p-4 text-xs font-semibold uppercase text-gray-500">Diet</td>
						{#each dinoData as dino}
							<td class="p-4 font-medium">{dino.diet}</td>
						{/each}
					</tr>

					<!-- Era -->
					<tr class="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<td class="p-4 text-xs font-semibold uppercase text-gray-500">Temporal Range</td>
						{#each dinoData as dino}
							<td class="p-4 font-medium">{dino.temporalRange}</td>
						{/each}
					</tr>

					<!-- Locomotion -->
					<tr class="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<td class="p-4 text-xs font-semibold uppercase text-gray-500">Locomotion</td>
						{#each dinoData as dino}
							<td class="p-4 font-medium">{dino.locomotionType}</td>
						{/each}
					</tr>

					<!-- Description -->
					<tr class="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<td class="p-4 text-xs font-semibold uppercase text-gray-500">Description</td>
						{#each dinoData as dino}
							<td class="p-4 text-justify text-sm leading-relaxed text-gray-600 dark:text-gray-400">
								{dino.description.substring(0, 300)}...
							</td>
						{/each}
					</tr>
				</tbody>
			</table>
		</div>
	{/if}
</div>
