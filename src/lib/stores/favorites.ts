import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface DinoFavoriteItem {
    name: string;
    description: string;
    image: string; // URL
    diet: string;
    era: string;
}

const STORAGE_KEY = 'dinopedia_favorites';

function createFavoritesStore() {
    const { subscribe, set, update } = writable<DinoFavoriteItem[]>([]);

    // Load from localStorage on init
    if (browser) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                set(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse favorites store', e);
            }
        }
    }

    return {
        subscribe,
        toggle: (dino: DinoFavoriteItem) => update(items => {
            const exists = items.find(i => i.name === dino.name);
            let newItems;
            if (exists) {
                newItems = items.filter(i => i.name !== dino.name);
            } else {
                newItems = [...items, dino];
            }

            if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        }),
        clear: () => {
            if (browser) localStorage.removeItem(STORAGE_KEY);
            set([]);
        }
    };
}

export const favoritesStore = createFavoritesStore();
