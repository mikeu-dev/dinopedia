import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface DinoComparisonItem {
    name: string;
    description: string;
    image: string; // URL
    diet: string;
    era: string;
}

const STORAGE_KEY = 'dinopedia_compare';

function createComparisonStore() {
    const { subscribe, set, update } = writable<DinoComparisonItem[]>([]);

    // Load from localStorage on init
    if (browser) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                set(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse comparison store', e);
            }
        }
    }

    return {
        subscribe,
        add: (dino: DinoComparisonItem) => update(items => {
            if (items.length >= 2) return items; // Max 2
            if (items.find(i => i.name === dino.name)) return items; // No duplicates
            const newItems = [...items, dino];
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        }),
        remove: (name: string) => update(items => {
            const newItems = items.filter(i => i.name !== name);
            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        }),
        clear: () => {
            if (browser) localStorage.removeItem(STORAGE_KEY);
            set([]);
        }
    };
}

export const comparisonStore = createComparisonStore();
