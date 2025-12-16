<script lang="ts">
	import { comparisonStore, type DinoComparisonItem } from '$lib/stores/comparison';
	import { Button } from '$lib/components/ui/button';

	export let dino: DinoComparisonItem; // Pass minimal data needed for store

	let isSelected = false;
	let isFull = false;

	// Subscribe to check status
	comparisonStore.subscribe((items) => {
		isSelected = !!items.find((i) => i.name === dino.name);
		isFull = items.length >= 2;
	});

	function toggle() {
		if (isSelected) {
			comparisonStore.remove(dino.name);
		} else {
			if (!isFull) comparisonStore.add(dino);
		}
	}
</script>

<Button
	variant={isSelected ? 'default' : 'outline'}
	size="sm"
	onclick={toggle}
	disabled={!isSelected && isFull}
	class={isSelected ? 'bg-teal-600 text-white hover:bg-teal-700' : ''}
>
	{#if isSelected}
		✓ Added
	{:else}
		+ Compare
	{/if}
</Button>
