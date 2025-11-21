<script setup lang="ts">
	useHead({
		title: 'Le Sens de l’Histoire',

		htmlAttrs: { lang: 'fr-FR' },
		link: [
			{
				rel: 'icon',
				type: 'image/png',
				href: '/favicon.png',
			},
		],
	});
</script>

<template>
	<Head>
		<Html class="scroll-pt-30 scroll-smooth" />
	</Head>

	<div>
		<NuxtRouteAnnouncer />
		<NuxtLoadingIndicator />

		<UApp>
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</UApp>
	</div>
</template>
