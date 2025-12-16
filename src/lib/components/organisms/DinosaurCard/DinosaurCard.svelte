<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button';
	import CompareButton from '$lib/components/molecules/CompareButton/CompareButton.svelte';
	export let dinosaur;
	import { onMount } from 'svelte';

	interface DinosaurImage {
		title: string;
		description: string;
		imageURL: string;
		authorURL: string;
		author: string;
		licenseURL: string;
		license: string;
	}

	// DinosaurList.svelte
	let image: DinosaurImage = dinosaur.image || {
		title: '',
		description: '',
		imageURL: '',
		authorURL: '',
		author: '',
		licenseURL: '',
		license: ''
	};

	let directImageURL = '';

	// Ambil URL langsung dari Wikimedia API
	async function getDirectImageURL(filename: string) {
		if (!filename) return;
		if (filename.startsWith('http')) {
			directImageURL = filename;
			return;
		}
		const title = filename.replace('https://commons.wikimedia.org/wiki/File:', '');
		const apiURL = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`;

		try {
			const res = await fetch(apiURL);
			const data = await res.json();
			const pages = data.query.pages;
			const page: any = Object.values(pages)[0];

			if (page.imageinfo && page.imageinfo[0].url) {
				directImageURL = page.imageinfo[0].url;
			}
		} catch (e) {
			console.error('Error fetching image', e);
		}
	}
	onMount(() => {
		if (image.imageURL) {
			getDirectImageURL(image.imageURL);
		}
	});
</script>

<div
	class="mb-6 flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
>
	<!-- Header -->
	<div class="border-b border-gray-100 p-5 dark:border-gray-700">
		<div class="flex items-start justify-between">
			<h2
				class="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-teal-500 dark:text-gray-100"
			>
				<a href="/dinosaur/{dinosaur.name}">{dinosaur.name}</a>
			</h2>
			<Badge variant="secondary" class="text-xs">{dinosaur.temporalRange}</Badge>
		</div>
	</div>

	<div class="flex flex-1 flex-col gap-6 p-5 md:flex-row">
		<!-- Image Section -->
		<div class="w-full shrink-0 md:w-1/3">
			<div
				class="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
			>
				{#if directImageURL}
					<img
						src={directImageURL}
						alt={image.title}
						class="h-full w-full object-contain p-2"
						loading="lazy"
					/>
				{:else}
					<div class="text-xs text-gray-400">Loading...</div>
				{/if}
			</div>
		</div>

		<!-- Content Section -->
		<div class="flex flex-1 flex-col">
			<p class="mb-4 line-clamp-4 text-justify text-sm text-gray-600 dark:text-gray-300">
				{dinosaur.description}
			</p>

			<div class="mt-auto grid grid-cols-2 gap-4 text-sm">
				<div>
					<span class="block text-xs font-semibold uppercase text-gray-400">Diet</span>
					<span class="font-medium text-gray-700 dark:text-gray-200"
						>{dinosaur.diet || 'Unknown'}</span
					>
				</div>
				<div>
					<span class="block text-xs font-semibold uppercase text-gray-400">Locomotion</span>
					<span class="font-medium text-gray-700 dark:text-gray-200"
						>{dinosaur.locomotionType || 'Unknown'}</span
					>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer Action -->
	<div
		class="flex items-center justify-between rounded-b-xl border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
	>
		<CompareButton
			dino={{
				name: dinosaur.name,
				description: dinosaur.description,
				image: directImageURL,
				diet: dinosaur.diet,
				era: dinosaur.temporalRange
			}}
		/>
		<Button
			href="/dinosaur/{dinosaur.name}"
			variant="default"
			size="sm"
			class="ml-2 w-full md:w-auto"
		>
			View Details
		</Button>
	</div>
</div>
