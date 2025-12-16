import { getDinoByName } from '$lib/api/dinosaur';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const dinosaur = await getDinoByName(params.name);
        return {
            dinosaur
        };
    } catch (err) {
        console.error('Error loading dinosaur:', err);
        throw error(404, 'Dinosaur not found');
    }
}
