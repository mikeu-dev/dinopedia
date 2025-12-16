<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	interface DinosaurClasification {
		domain: string;
		kingdom: string;
		phylum: string;
		clade: Array<any>;
		classInfo: Array<any>;
		orderInfo: Array<any>;
		familyInfo: Array<any>;
		tribeInfo: Array<any>;
		genusInfo: Array<any>;
		speciesInfo: Array<any>;
	}

	// DinosaurList.svelte
	export let classification: DinosaurClasification = {
		domain: '',
		kingdom: '',
		phylum: '',
		clade: [],
		classInfo: [],
		orderInfo: [],
		familyInfo: [],
		tribeInfo: [],
		genusInfo: [],
		speciesInfo: []
	};

	let family = classification.familyInfo?.find((f) => f.familyType === 'Family');
	let subfamily = classification.familyInfo?.find((f) => f.familyType === 'Subfamily');
    // Helper to get primary value if array exists
</script>

<div
	class="rounded border-r border-b border-gray-200 bg-white p-4 dark:border-gray-400 dark:bg-linear-to-tl dark:from-gray-700 dark:to-gray-400"
>
	<h4 class="mb-4 font-bold text-gray-800 underline decoration-yellow-500 text-lg">Detailed Taxonomy</h4>
	<div class="relative overflow-x-auto">
        <ul class="space-y-2 text-sm text-gray-800">
            <!-- Domain -->
            <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                <span class="font-semibold text-teal-600 dark:text-teal-400">Domain</span>
                <span class="justify-self-end">:</span>
                <span class="dark:text-gray-300 font-medium">
                    {#if classification.domain}
                        {classification.domain}
                    {:else}
                        <span class="text-gray-400 italic">unrecognized</span>
                    {/if}
                </span>
            </li>
            
            <!-- Kingdom -->
            <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                <span class="font-semibold text-teal-600 dark:text-teal-400">Kingdom</span>
                <span class="justify-self-end">:</span>
                <span class="dark:text-gray-300 font-medium">
                    {#if classification.kingdom}
                        {classification.kingdom}
                    {:else}
                         <span class="text-gray-400 italic">unrecognized</span>
                    {/if}
                </span>
            </li>

            <!-- Phylum -->
            <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                <span class="font-semibold text-teal-600 dark:text-teal-400">Phylum</span>
                <span class="justify-self-end">:</span>
                <span class="dark:text-gray-300 font-medium">
                    {#if classification.phylum}
                        {classification.phylum}
                    {:else}
                         <span class="text-gray-400 italic">unrecognized</span>
                    {/if}
                </span>
            </li>

            <!-- Class (NEW) -->
             {#if classification.classInfo?.length}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Class</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300">
                         {#each classification.classInfo as item}
                            <span class="mr-2">{item.value} <span class="text-xs text-gray-500">({item.classType})</span></span>
                         {/each}
                    </span>
                </li>
             {/if}

            <!-- Order (NEW) -->
            {#if classification.orderInfo?.length}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Order</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300">
                         {#each classification.orderInfo as item}
                            <span class="mr-2">{item.value} <span class="text-xs text-gray-500">({item.orderType})</span></span>
                         {/each}
                    </span>
                </li>
             {/if}

            <!-- Clade -->
            <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                <span class="font-semibold text-teal-600 dark:text-teal-400">Clade</span>
                <span class="justify-self-end">:</span>
                <span class="dark:text-gray-300">
                    {#if classification.clade && classification.clade.length}
                        <div class="flex flex-wrap gap-1">
                            {#each classification.clade as c}
                                <Badge variant="outline" class="text-xs border-teal-200 dark:border-teal-700">{c}</Badge>
                            {/each}
                        </div>
                    {:else}
                         <span class="text-gray-400 italic">unrecognized</span>
                    {/if}
                </span>
            </li>

            <!-- Family -->
            {#if family}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Family</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300 font-medium">
                        {family.value}
                    </span>
                </li>
            {/if}

            {#if subfamily}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Subfamily</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300">
                        {subfamily.value}
                    </span>
                </li>
            {/if}
            
            <!-- Tribe (NEW) -->
             {#if classification.tribeInfo?.length}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Tribe</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300">
                         {#each classification.tribeInfo as item}
                            <span class="mr-2">{item.value} <span class="text-xs text-gray-500">({item.tribeType})</span></span>
                         {/each}
                    </span>
                </li>
             {/if}

            <!-- Genus -->
            {#if classification.genusInfo?.length}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Genus</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300 italic">
                         {#each classification.genusInfo as genus}
                            {genus.value}
                        {/each}
                    </span>
                </li>
            {/if}

            <!-- Species -->
            {#if classification.speciesInfo?.length}
                <li class="grid grid-cols-[100px_4px_1fr] items-start gap-2">
                    <span class="font-semibold text-teal-600 dark:text-teal-400">Species</span>
                    <span class="justify-self-end">:</span>
                    <span class="dark:text-gray-300 italic">
                        {#each classification.speciesInfo as species}
                            {species.value}
                        {/each}
                    </span>
                </li>
            {/if}
        </ul>
    </div>
</div>
