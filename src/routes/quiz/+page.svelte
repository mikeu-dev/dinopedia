<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { searchDinos } from '$lib/api/dinosaur';
	import { Button } from '$lib/components/ui/button';
	import { fade, scale, fly } from 'svelte/transition';
	import confetti from 'canvas-confetti';

	// Game Constants
	const QUESTIONS_PER_GAME = 5;
	const OPTION_COUNT = 4;

	// Game State
	type GameState = 'start' | 'playing' | 'end';
	let currentState: GameState = 'start';
	let score = 0;
	let currentQuestionIndex = 0;
	let loading = false;
	let highScore = 0;

	// Define Dino interface based on usage
	interface Dino {
		name: string;
		images: (string | { imageURL: string })[];
		// Add other properties if known from the API response
	}

	// Data
	let allDinos: Dino[] = [];
	let currentQuestion: Dino | null = null;
	let currentOptions: Dino[] = [];
	let selectedAnswer: string | null = null;
	let isCorrect: boolean | null = null;

	onMount(async () => {
		const storedHigh = localStorage.getItem('dino_quiz_highscore');
		if (storedHigh) highScore = parseInt(storedHigh);

		loading = true;
		try {
			// Fetch pool of dinos
			const res = await searchDinos({ limit: 100 });
			allDinos = res.data.filter((d: any) => d.images && d.images.length > 0); // Only dinos with images
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	function startGame() {
		if (allDinos.length < OPTION_COUNT) {
			alert('Not enough dinosaurs loaded to play! Try refreshing.');
			return;
		}
		score = 0;
		currentQuestionIndex = 0;
		currentState = 'playing';
		nextQuestion();
	}

	function nextQuestion() {
		if (currentQuestionIndex >= QUESTIONS_PER_GAME) {
			endGame();
			return;
		}

		selectedAnswer = null;
		isCorrect = null;

		// Pick random dino for question
		const questionIdx = Math.floor(Math.random() * allDinos.length);
		currentQuestion = allDinos[questionIdx];

		// Pick 3 distractors
		const options = [currentQuestion];
		while (options.length < OPTION_COUNT) {
			const random = allDinos[Math.floor(Math.random() * allDinos.length)];
			if (!options.find((o) => o.name === random.name)) {
				options.push(random);
			}
		}

		// Shuffle options
		currentOptions = options.sort(() => Math.random() - 0.5);
	}

	function handleAnswer(dino: any) {
		if (selectedAnswer) return; // Prevent double click
		selectedAnswer = dino.name;

		if (dino.name === currentQuestion.name) {
			isCorrect = true;
			score++;
			triggerConfetti();
		} else {
			isCorrect = false;
		}

		// Delay before next question
		setTimeout(() => {
			currentQuestionIndex++;
			nextQuestion();
		}, 2000);
	}

	function endGame() {
		currentState = 'end';
		if (score > highScore) {
			highScore = score;
			localStorage.setItem('dino_quiz_highscore', highScore.toString());
			triggerConfetti();
		}
	}

	function triggerConfetti() {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 }
		});
	}

	function getImage(dino: any) {
		if (dino.images && dino.images[0]) {
			if (typeof dino.images[0] === 'string') return dino.images[0];
			return dino.images[0].imageURL || '';
		}
		return '';
	}
</script>

<div
	class="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8 md:px-20"
>
	{#if currentState === 'start'}
		<div
			in:fade={{ duration: 300 }}
			class="w-full max-w-lg rounded-3xl border-4 border-teal-100 bg-white p-10 text-center shadow-2xl dark:border-teal-900 dark:bg-gray-800"
		>
			<div class="mb-6 text-6xl">🎮</div>
			<h1 class="mb-4 text-4xl font-black dark:text-white">Dino Quiz</h1>
			<p class="mb-8 text-lg text-gray-500 dark:text-gray-300">
				Test your knowledge! Guess the dinosaur from its picture.
			</p>

			{#if highScore > 0}
				<div
					class="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20"
				>
					<span
						class="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400"
						>High Score</span
					>
					<div class="text-3xl font-black text-yellow-700 dark:text-yellow-300">
						{highScore} / {QUESTIONS_PER_GAME}
					</div>
				</div>
			{/if}

			<Button
				size="lg"
				onclick={startGame}
				disabled={loading || allDinos.length === 0}
				class="h-14 w-full bg-teal-600 text-lg text-white shadow-lg shadow-teal-200 transition-transform hover:bg-teal-700 active:scale-95 dark:shadow-none"
			>
				{loading ? 'Loading...' : 'Start Game'}
			</Button>
		</div>
	{:else if currentState === 'playing'}
		<div class="mx-auto w-full max-w-2xl">
			<!-- Header -->
			<div class="mb-8 flex items-center justify-between px-4">
				<div class="text-sm font-bold uppercase tracking-widest text-gray-400">
					Question {currentQuestionIndex + 1} / {QUESTIONS_PER_GAME}
				</div>
				<div
					class="rounded-full bg-teal-100 px-4 py-1 font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300"
				>
					Score: {score}
				</div>
			</div>

			{#key currentQuestion}
				<div
					in:scale={{ start: 0.95, duration: 300 }}
					class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
				>
					<!-- Image -->
					<div
						class="relative flex aspect-video items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900"
					>
						{#if getImage(currentQuestion)}
							<img
								src={getImage(currentQuestion)}
								alt="Who is this?"
								class="h-full w-full object-cover transition-all duration-1000 {selectedAnswer
									? 'filter-none'
									: 'blur-md hover:blur-sm'}"
							/>
						{:else}
							<div class="text-6xl">🦕</div>
						{/if}

						{#if selectedAnswer !== null}
							<div
								class="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"
							>
								<div class="scale-110 transform">
									{#if isCorrect}
										<div class="mb-2 text-6xl">✅</div>
										<div class="text-center text-4xl font-black text-white drop-shadow-md">
											CORRECT!
										</div>
									{:else}
										<div class="mb-2 text-6xl">❌</div>
										<div class="text-center text-4xl font-black text-white drop-shadow-md">
											WRONG!
										</div>
										<div class="mt-2 text-center text-xl font-medium text-white/80">
											It was {currentQuestion?.name}
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>

					<!-- Options -->
					<div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
						{#each currentOptions as opt}
							<button
								onclick={() => handleAnswer(opt)}
								disabled={selectedAnswer !== null}
								class="h-16 rounded-xl border-2 text-lg font-bold transition-all
                                {selectedAnswer === null
									? 'border-gray-200 hover:border-teal-500 hover:bg-teal-50 dark:border-gray-700 dark:text-white dark:hover:bg-teal-900/30'
									: opt.name === currentQuestion?.name
										? 'translate-y-0 border-green-500 bg-green-50 text-green-700 shadow-none dark:bg-green-900/30 dark:text-green-400'
										: opt.name === selectedAnswer
											? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
											: 'border-gray-100 text-gray-400 opacity-50'}"
							>
								{opt.name}
							</button>
						{/each}
					</div>
				</div>
			{/key}
		</div>
	{:else if currentState === 'end'}
		<div
			in:fly={{ y: 20, duration: 400 }}
			class="w-full max-w-lg rounded-3xl border-4 border-teal-100 bg-white p-10 text-center shadow-2xl dark:border-teal-900 dark:bg-gray-800"
		>
			<h2 class="mb-2 text-3xl font-black dark:text-white">
				{score === QUESTIONS_PER_GAME ? 'PERFECT! 🏆' : 'Game Over!'}
			</h2>
			<p class="mb-8 text-gray-500 dark:text-gray-400">
				You got {score} out of {QUESTIONS_PER_GAME} correct.
			</p>

			<div class="flex flex-col gap-4">
				<Button
					size="lg"
					onclick={startGame}
					class="w-full bg-teal-600 text-white hover:bg-teal-700"
				>
					Play Again 🔄
				</Button>
				<Button size="lg" variant="outline" href="/dinosaur" class="w-full">
					Back to Encyclopedia
				</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Prevent image dragging/cheating */
	img {
		pointer-events: none;
		user-select: none;
	}
</style>
