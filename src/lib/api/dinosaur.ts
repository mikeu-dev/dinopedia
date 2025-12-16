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

export async function getDinoByName(name: string) {
    const fullUrl = `${PUBLIC_RESTASAURUS_URL}/dinosaurs/name/${name}`;
    const res = await fetch(fullUrl);
    if (!res.ok) {
        throw new Error(`Gagal fetch dinosaur: ${res.status}`);
    }
    return await res.json();
}