import { loadMoreDinos, getDiets, getLocomotions } from '$lib/api/dinosaur';
import {
    PUBLIC_GET_ALL_DINOSAURS
} from '$env/static/public';

export async function load() {
    const [allDinosaur, dietsData, locomotionsData] = await Promise.all([
        PUBLIC_GET_ALL_DINOSAURS ? loadMoreDinos(PUBLIC_GET_ALL_DINOSAURS) : null,
        getDiets().catch(() => ({ data: [] })),
        getLocomotions().catch(() => ({ data: [] }))
    ]);

    return {
        dinosaurs: allDinosaur,
        diets: dietsData.data || [],
        locomotions: locomotionsData.data || []
    };
}

