<script lang="ts">
	import { onMount } from 'svelte';
	import { DinosaurList } from '$lib/components/organisms';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { bdDinosaurs } from '$lib/data/images.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { DinosaurItem, imageInfo } from '$lib/types/clades';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { searchDinos, getRandomDino } from '$lib/api/dinosaur';
	import { goto } from '$app/navigation';
	import ComparisonBar from '$lib/components/organisms/ComparisonBar/ComparisonBar.svelte';

	//types/clades.ts
	//   export interface DinosaurItem {
	//     prevPage: string;
	//     currentPage: number;
	//     nextPage: string;
	//     count: number;
	//     data: Array<any>;
	// }

	let { data } = $props();

	let loading: boolean = $state(true);
	let aboutImage: imageInfo = bdDinosaurs;
	let searchForDinosaur = $state('');

	// Filter States
	let selectedDiet = $state('all');
	let selectedLocomotion = $state('all');

	// Data from server
	const diets = data.diets || [];
	const locomotions = data.locomotions || [];

	// Filter berdasarkan pencarian
	let filteredDinosaurs = $state<DinosaurItem>({
		prevPage: '',
		currentPage: 1,
		nextPage: '',
		count: 0,
		data: []
	});

	// Base data from API (either all or filtered by backend)
	let apiData = $state<any[]>([]);

	async function applyFilters() {
		loading = true;
		try {
			if (selectedDiet === 'all' && selectedLocomotion === 'all') {
				// Reset to initial data
				if (data.dinosaurs) {
					apiData = data.dinosaurs.data;
					filteredDinosaurs = { ...data.dinosaurs };
				}
			} else {
				// Call API with filters
				const result = await searchDinos({
					diet: selectedDiet,
					locomotion: selectedLocomotion
				});
				apiData = result.data || [];
				filteredDinosaurs = {
					...filteredDinosaurs,
					data: apiData,
					count: apiData.length
				};
			}
		} catch (e) {
			console.error('Filter error', e);
			apiData = [];
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		// Client-side text search on top of Current API Data
		if (Array.isArray(apiData)) {
			const filteredData = apiData.filter((dino: any) =>
				dino.name.toLowerCase().includes(searchForDinosaur.toLowerCase())
			);
			filteredDinosaurs = {
				...filteredDinosaurs,
				data: filteredData,
				count: filteredData.length
			};
		}
	});

	onMount(() => {
		if (data.dinosaurs?.data) {
			apiData = data.dinosaurs.data;
		}
		// Simulasi loading
		setTimeout(() => {
			loading = false;
		}, 1000);
	});

	function handleFilterChange() {
		applyFilters();
	}

	async function handleRandomDiscovery() {
		loading = true;
		try {
			const res = await getRandomDino(1);
			if (res.data && res.data.length > 0) {
				await goto(`/dinosaur/${res.data[0].name}`);
			}
		} catch (e) {
			console.error('Random discovery failed', e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
	<img
		src={aboutImage.src}
		alt={aboutImage.alt}
		class="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
	/>

	<!-- Decorative blob -->
	<div
		class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
		aria-hidden="true"
	>
		<div
			class="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		></div>
	</div>

	<!-- Main content -->
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:mx-0">
			<h2 class="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
				Selamat Datang di Dinopedia
			</h2>
			<p class="mt-8 text-pretty text-lg font-medium text-gray-300 sm:text-xl/8">
				Dinopedia adalah ensiklopedia digital yang menghadirkan informasi lengkap, menarik, dan
				akurat tentang berbagai jenis dinosaurus yang pernah hidup di bumi. Temukan fakta ilmiah,
				gambar ilustratif, serta klasifikasi berdasarkan era dan jenisnya.
			</p>
		</div>

		<div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
			<div
				class="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10"
			>
				<a href="#">Jenis Dinosaurus <span aria-hidden="true">&rarr;</span></a>
				<a href="#">Klasifikasi Ilmiah <span aria-hidden="true">&rarr;</span></a>
				<a href="#">Era Geologi <span aria-hidden="true">&rarr;</span></a>
				<a href="#">Galeri Visual <span aria-hidden="true">&rarr;</span></a>
			</div>

			<dl class="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
				<div class="flex flex-col-reverse gap-1">
					<dt class="text-base/7 text-gray-300">Spesies Tercatat</dt>
					<dd class="text-4xl font-semibold tracking-tight text-white">50+</dd>
				</div>
				<div class="flex flex-col-reverse gap-1">
					<dt class="text-base/7 text-gray-300">Periode Geologi</dt>
					<dd class="text-4xl font-semibold tracking-tight text-white">3</dd>
				</div>
				<div class="flex flex-col-reverse gap-1">
					<dt class="text-base/7 text-gray-300">Klasifikasi Famili</dt>
					<dd class="text-4xl font-semibold tracking-tight text-white">15+</dd>
				</div>
				<div class="flex flex-col-reverse gap-1">
					<dt class="text-base/7 text-gray-300">Gambar Ilustrasi</dt>
					<dd class="text-4xl font-semibold tracking-tight text-white">100+</dd>
				</div>
			</dl>
		</div>
	</div>
</div>

<section class="bg-white py-12 dark:bg-black">
	{#if filteredDinosaurs.data.length === 0 && loading}
		<div class="container mx-auto px-4 md:px-10 lg:px-20">
			<div class="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _}
					<Skeleton class="h-[100px] w-full rounded-2xl" />
				{/each}
			</div>

			<div class="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Skeleton class="h-[300px] w-full rounded-2xl lg:col-span-2" />
				<Skeleton class="h-[300px] w-full rounded-2xl" />
			</div>
		</div>
	{:else}
		<div class="container mx-auto px-6">
			<div class="flex flex-col gap-8 md:flex-row md:items-start">
				<!-- Sidebar Filters -->
				<aside
					class="sticky top-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-6 md:w-1/4 dark:border-gray-700 dark:bg-gray-800"
				>
					<h3 class="mb-6 flex items-center gap-2 text-xl font-bold dark:text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-filter"
							><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg
						>
						Filters
					</h3>

					<div class="space-y-6">
						<!-- Search Name -->
						<div class="space-y-2">
							<Label for="search" class="text-sm font-semibold text-gray-700 dark:text-gray-300"
								>Search Name</Label
							>
							<input
								type="text"
								bind:value={searchForDinosaur}
								name="search"
								id="search"
								placeholder="Type dinosaur name..."
								class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
							/>
						</div>

						<!-- Filter Diet -->
						<div class="space-y-2">
							<Label for="diet" class="text-sm font-semibold text-gray-700 dark:text-gray-300"
								>Diet</Label
							>
							<select
								id="diet"
								bind:value={selectedDiet}
								onchange={handleFilterChange}
								class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
							>
								<option value="all">All Diets</option>
								{#each diets as diet}
									<option value={diet._id.diet}>{diet._id.diet}</option>
								{/each}
							</select>
						</div>

						<!-- Filter Locomotion -->
						<div class="space-y-2">
							<Label for="locomotion" class="text-sm font-semibold text-gray-700 dark:text-gray-300"
								>Locomotion</Label
							>
							<select
								id="locomotion"
								bind:value={selectedLocomotion}
								onchange={handleFilterChange}
								class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
							>
								<option value="all">All Locomotions</option>
								{#each locomotions as loc}
									<option value={loc._id.locomotionType}>{loc._id.locomotionType}</option>
								{/each}
							</select>
						</div>

						<div class="pt-2">
							<Button
								variant="outline"
								class="w-full"
								onclick={() => {
									selectedDiet = 'all';
									selectedLocomotion = 'all';
									searchForDinosaur = '';
									handleFilterChange();
								}}
							>
								Reset Filters
							</Button>
						</div>
					</div>

					<div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
						<ul class="space-y-2 text-sm">
							<li><a href="/" class="block py-1 hover:text-teal-500">Home</a></li>
							<li><a href="#" class="block py-1 hover:text-teal-500">Tentang Kami</a></li>
							<li>
								<button
									onclick={handleRandomDiscovery}
									class="flex w-full items-center gap-2 py-1 text-left font-semibold text-teal-600 hover:text-teal-700 hover:underline"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-sparkles"
										><path
											d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"
										/></svg
									>
									Surprise Me!
								</button>
							</li>
						</ul>
					</div>
				</aside>

				<!-- Main Content -->
				<section class="w-full md:w-3/4">
					<div class="mb-6 flex items-center justify-between">
						<h2
							class="text-3xl font-extrabold tracking-tight text-gray-800 underline decoration-yellow-500 dark:text-yellow-400 dark:decoration-yellow-600"
						>
							{m.dino()}
						</h2>
						<span class="text-sm font-medium text-gray-500">
							Showing {filteredDinosaurs.count} results
						</span>
					</div>

					{#if filteredDinosaurs.data.length === 0}
						<div
							class="rounded-xl border border-gray-100 bg-gray-50 py-20 text-center dark:border-gray-700 dark:bg-gray-800"
						>
							<p class="text-lg text-gray-500 dark:text-gray-400">
								No dinosaurs found matching your criteria.
							</p>
							<Button
								variant="link"
								onclick={() => {
									selectedDiet = 'all';
									selectedLocomotion = 'all';
									searchForDinosaur = '';
									handleFilterChange();
								}}>Clear all filters</Button
							>
						</div>
					{:else}
						<DinosaurList dinosaurs={filteredDinosaurs} />
					{/if}
				</section>
			</div>
		</div>
	{/if}
</section>

<ComparisonBar />
