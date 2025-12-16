<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { DinosaurClasification, DinosaurSource } from '$lib/components/molecules';
	import CompareButton from '$lib/components/molecules/CompareButton/CompareButton.svelte';
	import FavoriteButton from '$lib/components/molecules/FavoriteButton/FavoriteButton.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { dinosaur } = data;

	let image = dinosaur.image || {
		title: '',
		description: '',
		imageURL: '',
		authorURL: '',
		author: '',
		licenseURL: '',
		license: ''
	};

	let directImageURL = '';

	// Reuse info fetching logic - ideally this should be a shared utility or component
	async function getDirectImageURL(filename: string) {
		if (!filename) return;
		if (filename.startsWith('http')) {
			directImageURL = filename; // Already a URL
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
			console.error('Failed to load image from wiki', e);
		}
	}

	onMount(() => {
		if (image.imageURL) {
			getDirectImageURL(image.imageURL);
		}
	});
</script>

<div class="container mx-auto min-h-screen px-4 py-8 md:px-20">
	<Button href="/dinosaur" variant="outline" class="mb-6">← Back to List</Button>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Left Column: Image & Basic Info -->
		<div class="space-y-6 lg:col-span-1">
			<div
				class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<div
					class="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900"
				>
					{#if directImageURL}
						<img src={directImageURL} alt={image.title} class="h-full w-full object-contain p-4" />
					{:else}
						<span class="text-gray-400">Loading image...</span>
					{/if}
				</div>
				<div class="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
					<p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{image.title}</p>
					<div class="mt-1 text-xs text-gray-500">
						{@html image.description}
					</div>
					<div class="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
						{#if image.author}
							<span>By {image.author}</span>
						{/if}
						{#if image.license}
							<span>• {image.license}</span>
						{/if}
					</div>
				</div>
			</div>

			<div
				class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="mb-4 font-bold text-gray-800 underline decoration-teal-500 dark:text-gray-100">
					Quick Facts
				</h3>
				<ul class="space-y-3">
					<li class="flex flex-col">
						<span class="text-xs font-semibold uppercase text-gray-500">Diet</span>
						<span class="font-medium text-gray-800 dark:text-gray-200"
							>{dinosaur.diet || 'Unknown'}</span
						>
					</li>
					<li class="flex flex-col">
						<span class="text-xs font-semibold uppercase text-gray-500">Locomotion</span>
						<span class="font-medium text-gray-800 dark:text-gray-200"
							>{dinosaur.locomotionType || 'Unknown'}</span
						>
					</li>
					<li class="flex flex-col">
						<span class="text-xs font-semibold uppercase text-gray-500">Temporal Range</span>
						<span class="font-medium text-gray-800 dark:text-gray-200"
							>{dinosaur.temporalRange || 'Unknown'}</span
						>
					</li>
				</ul>
			</div>
		</div>

		<!-- Right Column: Details & Taxonomy -->
		<div class="space-y-8 lg:col-span-2">
			<div class="flex items-center justify-between">
				<div class="flex flex-col">
					<h1
						class="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white"
					>
						{dinosaur.name}
					</h1>
					<Badge variant="secondary" class="w-fit px-3 py-1 text-lg">{dinosaur.temporalRange}</Badge
					>
				</div>
				<div class="flex items-center gap-2">
					<FavoriteButton
						dino={{
							name: dinosaur.name,
							description: dinosaur.description,
							image: directImageURL || image.imageURL,
							diet: dinosaur.diet,
							era: dinosaur.temporalRange
						}}
					/>
					<CompareButton
						dino={{
							name: dinosaur.name,
							description: dinosaur.description,
							image: directImageURL || image.imageURL, // Fallback to initial URL
							diet: dinosaur.diet,
							era: dinosaur.temporalRange
						}}
					/>
				</div>
			</div>

			<div class="prose dark:prose-invert max-w-none">
				<h3 class="text-2xl font-semibold text-teal-600 dark:text-teal-400">Description</h3>
				<p class="text-justify text-lg leading-relaxed text-gray-700 dark:text-gray-300">
					{dinosaur.description}
				</p>
			</div>

			<Separator />

			<DinosaurClasification classification={dinosaur.classificationInfo} />

			<DinosaurSource source={dinosaur.source} />
		</div>
	</div>
</div>
