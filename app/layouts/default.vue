<script setup lang="ts"></script>

<template>
	<header
		class="flex h-138 items-end justify-start bg-[url(/img/header.png)] bg-cover bg-center bg-no-repeat p-4 md:h-96 md:bg-position-[0rem_-5rem]"
	>
		<NuxtLink to="/">
			<h1
				class="font-display text-xl font-semibold text-white uppercase sm:text-2xl md:text-3xl"
			>
				Le sens <br />
				de l'Histoire.
			</h1>
		</NuxtLink>
	</header>

	<UMain>
		<slot />
	</UMain>

	<footer>
		<p>Copyright 2025 Le Sens de l'Histoire</p>
	</footer>
</template>
