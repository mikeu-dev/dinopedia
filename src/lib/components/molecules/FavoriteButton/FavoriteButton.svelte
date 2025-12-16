<script lang="ts">
	import { favoritesStore, type DinoFavoriteItem } from '$lib/stores/favorites';
	import { Button } from '$lib/components/ui/button';
	import { fly } from 'svelte/transition';

	export let dino: DinoFavoriteItem;
	export let size: 'sm' | 'icon' = 'icon';

	let isFavorite = false;

	favoritesStore.subscribe((items) => {
		isFavorite = !!items.find((i) => i.name === dino.name);
	});

	function toggle() {
		favoritesStore.toggle(dino);
	}
</script>

<Button
	variant="ghost"
	{size}
	onclick={toggle}
	class={isFavorite
		? 'text-red-500 hover:bg-red-50 hover:text-red-600'
		: 'text-gray-400 hover:bg-red-50 hover:text-red-500'}
	title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
>
	{#if isFavorite}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-heart"
			><path
				d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
			/></svg
		>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-heart"
			><path
				d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
			/></svg
		>
	{/if}
</Button>
