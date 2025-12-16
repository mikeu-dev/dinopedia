<script lang="ts">
	import { onMount } from 'svelte';
	import { DinosaurList } from '$lib/components/organisms';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { bdDinosaurs } from '$lib/data/images.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { DinosaurItem, imageInfo } from '$lib/types/clades';

	//types/clades.ts
	//   export interface DinosaurItem {
	//     prevPage: string;
	//     currentPage: number;
	//     nextPage: string;
	//     count: number;
	//     data: Array<any>;
	// }

	let { data } = $props();
	console.log('dinosaurs :', data.dinosaurs);

	let loading: boolean = $state(true);
	let aboutImage: imageInfo = bdDinosaurs;
	let searchForDinosaur = $state('');

	// Filter berdasarkan pencarian
	let filteredDinosaurs = $state<DinosaurItem>({
		prevPage: '',
		currentPage: 1,
		nextPage: '',
		count: 0,
		data: []
	});

	$effect(() => {
		if (Array.isArray(data?.dinosaurs?.data)) {
			const filteredData = data.dinosaurs.data.filter((dino: any) =>
				dino.name.toLowerCase().includes(searchForDinosaur.toLowerCase())
			);
			filteredDinosaurs = {
				...data.dinosaurs,
				data: filteredData,
				count: filteredData.length
			};
		} else {
			filteredDinosaurs = {
				prevPage: '',
				currentPage: 1,
				nextPage: '',
				count: 0,
				data: []
			};
		}
	});

	onMount(() => {
		// Simulasi loading
		setTimeout(() => {
			loading = false;
		}, 1000);
	});
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
			<div class="flex flex-col gap-6 md:flex-row md:items-start">
				<!-- Sidebar -->
				<aside
					class="w-full rounded-lg bg-gray-100 p-4 text-gray-700 md:w-1/4 dark:bg-gray-800 dark:text-gray-100"
				>
					<h3 class="mb-4 text-xl font-semibold">Menu</h3>
					<ul class="space-y-2">
						<li><a href="#" class="block hover:text-teal-500">Home</a></li>
						<li><a href="#" class="block hover:text-teal-500">Dinosaurus</a></li>
						<li><a href="#" class="block hover:text-teal-500">Favorit</a></li>
						<li><a href="#" class="block hover:text-teal-500">Tentang</a></li>
					</ul>
				</aside>

				<!-- Main Content -->
				<section class="w-full md:w-3/4">
					<h2
						class="mb-6 text-center text-4xl font-extrabold tracking-tight text-gray-700 underline decoration-yellow-500 md:text-left dark:text-yellow-400 dark:decoration-yellow-600"
					>
						{m.dino()}
					</h2>

					<input
						type="text"
						bind:value={searchForDinosaur}
						name="company"
						id="company"
						autocomplete="organization"
						placeholder="Search..."
						class="mb-4 block w-full rounded-md bg-transparent px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500"
					/>

					<DinosaurList dinosaurs={filteredDinosaurs} />
				</section>
			</div>
		</div>
	{/if}
</section>
