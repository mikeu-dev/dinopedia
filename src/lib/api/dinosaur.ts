import { PUBLIC_RESTASAURUS_URL } from '$env/static/public';

export async function loadMoreDinos(endpoint: string) {
    // Check if endpoint is a full URL (from nextPage/prevPage) or relative
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${PUBLIC_RESTASAURUS_URL}${endpoint}`;

    const res = await fetch(fullUrl);
    if (!res.ok) {
        throw new Error(`Gagal fetch: ${res.status}`);
    }

    return await res.json();
}

export async function getDiets() {
    const fullUrl = `${PUBLIC_RESTASAURUS_URL}/diets`;
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error(`Failed to fetch diets: ${res.status}`);
    return await res.json();
}

export async function getLocomotions() {
    const fullUrl = `${PUBLIC_RESTASAURUS_URL}/locomotions`;
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error(`Failed to fetch locomotions: ${res.status}`);
    return await res.json();
}

export async function searchDinos(params: { diet?: string, locomotion?: string, limit?: number }) {
    const url = new URL(`${PUBLIC_RESTASAURUS_URL}/search`);
    if (params.diet && params.diet !== 'all') url.searchParams.append('diet', params.diet);
    if (params.locomotion && params.locomotion !== 'all') url.searchParams.append('locomotion', params.locomotion);
    if (params.limit) url.searchParams.append('limit', params.limit.toString());

    const res = await fetch(url.toString());
    if (!res.ok) {
        if (res.status === 404) return { data: [], count: 0 }; // Handle no results gracefully
        throw new Error(`Search failed: ${res.status}`);
    }
    return await res.json();
}

export async function getDinoByName(name: string) {
    const fullUrl = `${PUBLIC_RESTASAURUS_URL}/dinosaurs/name/${name}`;
    const res = await fetch(fullUrl);
    if (!res.ok) {
        throw new Error(`Gagal fetch dinosaur: ${res.status}`);
    }
    return await res.json();
}

export async function getRandomDino(count: number = 1) {
    const fullUrl = `${PUBLIC_RESTASAURUS_URL}/dinosaurs/random/${count}`;
    const res = await fetch(fullUrl);
    if (!res.ok) {
        throw new Error(`Gagal fetch random dinosaur: ${res.status}`);
    }
    return await res.json();
}