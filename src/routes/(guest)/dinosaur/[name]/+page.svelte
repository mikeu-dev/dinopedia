<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { DinosaurClasification, DinosaurSource } from '$lib/components/molecules';
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
        } catch(e) {
            console.error('Failed to load image from wiki', e);
        }
	}

	onMount(() => {
		if (image.imageURL) {
			getDirectImageURL(image.imageURL);
		}
	});

</script>

<div class="container mx-auto px-4 py-8 md:px-20 min-h-screen">
    <Button href="/dinosaur" variant="outline" class="mb-6">
        ← Back to List
    </Button>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Image & Basic Info -->
		<div class="lg:col-span-1 space-y-6">
            <div class="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div class="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative">
                    {#if directImageURL}
                        <img src={directImageURL} alt={image.title} class="w-full h-full object-contain p-4" />
                    {:else}
                         <span class="text-gray-400">Loading image...</span>
                    {/if}
                </div>
                 <div class="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <p class="font-semibold text-gray-800 dark:text-gray-100 text-sm">{image.title}</p>
                     <div class="text-xs text-gray-500 mt-1">
                        {@html image.description}
                     </div>
                     <div class="mt-2 text-xs flex flex-wrap gap-2 text-gray-500">
                        {#if image.author}
                            <span>By {image.author}</span>
                        {/if}
                        {#if image.license}
                             <span>• {image.license}</span>
                        {/if}
                     </div>
                </div>
            </div>

             <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4 underline decoration-teal-500">Quick Facts</h3>
                <ul class="space-y-3">
                    <li class="flex flex-col">
                        <span class="text-xs text-gray-500 uppercase font-semibold">Diet</span>
                        <span class="font-medium text-gray-800 dark:text-gray-200">{dinosaur.diet || 'Unknown'}</span>
                    </li>
                    <li class="flex flex-col">
                        <span class="text-xs text-gray-500 uppercase font-semibold">Locomotion</span>
                        <span class="font-medium text-gray-800 dark:text-gray-200">{dinosaur.locomotionType || 'Unknown'}</span>
                    </li>
                    <li class="flex flex-col">
                        <span class="text-xs text-gray-500 uppercase font-semibold">Temporal Range</span>
                        <span class="font-medium text-gray-800 dark:text-gray-200">{dinosaur.temporalRange || 'Unknown'}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Right Column: Details & Taxonomy -->
        <div class="lg:col-span-2 space-y-8">
            <div>
                <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">{dinosaur.name}</h1>
                <Badge variant="secondary" class="text-lg px-3 py-1">{dinosaur.temporalRange}</Badge>
            </div>

            <div class="prose dark:prose-invert max-w-none">
                <h3 class="text-2xl font-semibold text-teal-600 dark:text-teal-400">Description</h3>
                <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-justify">
                    {dinosaur.description}
                </p>
            </div>

             <Separator />

             <DinosaurClasification classification={dinosaur.classificationInfo} />

             <DinosaurSource source={dinosaur.source} />
        </div>
	</div>
</div>
