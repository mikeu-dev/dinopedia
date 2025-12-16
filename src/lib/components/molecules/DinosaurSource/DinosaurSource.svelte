<script lang="ts">
	interface DinosaurSource {
		wikipediaURL: string;
		pageTitle: string;
		publisher: string;
		citation: string;
        author?: string;
        license?: string;
        licenseURL?: string;
        permalink?: string;
        lastRevision?: string;
	}

	// DinosaurList.svelte
	export let source: DinosaurSource = {
		wikipediaURL: '',
		pageTitle: '',
		publisher: '',
		citation: '',
        author: '',
        license: '',
        licenseURL: '',
        permalink: '',
        lastRevision: ''
	};
</script>

<div class="mt-8 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300">
    <h5 class="font-bold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Reference & Attribution
    </h5>
    
    <div class="space-y-2">
        <p>
            <span class="font-semibold">Source:</span> 
            <a href={source.wikipediaURL} target="_blank" class="text-teal-600 dark:text-teal-400 hover:underline hover:decoration-yellow-500 font-medium"
                >{source.pageTitle}</a
            >
            — {source.publisher}
        </p>
        
        {#if source.author}
            <p><span class="font-semibold">Author:</span> {source.author}</p>
        {/if}

        {#if source.license}
             <p>
                <span class="font-semibold">License:</span> 
                {#if source.licenseURL}
                    <a href={source.licenseURL} target="_blank" class="text-teal-600 dark:text-teal-400 hover:underline">{source.license}</a>
                {:else}
                    {source.license}
                {/if}
            </p>
        {/if}

        <div class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 italic">
            <p class="mb-1">{source.citation}</p>
            {#if source.lastRevision}
                <p>Last Revision: {source.lastRevision}</p>
            {/if}
            {#if source.permalink}
                <p class="truncate mt-1">Permalink: <a href={source.permalink} class="hover:underline">{source.permalink}</a></p>
            {/if}
        </div>
    </div>
</div>
