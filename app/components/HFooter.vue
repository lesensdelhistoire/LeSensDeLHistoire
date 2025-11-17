<script setup lang="ts">
	const { data: page } = await useAsyncData('page', () =>
		queryCollection('pages').first(),
	);

	import type { FooterColumn } from '@nuxt/ui';

	const columns: FooterColumn[] = [
		{
			label: 'Sur ce site',
			children: [
				{
					label: 'Nuxt 4',
					to: 'https://nuxt.com',
					target: '_blank',
				},
				{
					label: 'Nuxt UI',
					to: 'https://ui.nuxt.com',
					target: '_blank',
				},
				{
					label: 'Nuxt content',
					to: 'https://content.nuxt.com',
					target: '_blank',
				},
				{
					label: 'Nuxt studio',
					to: 'https://nuxt.studio',
					target: '_blank',
				},
				{
					label: 'Tailwind CSS',
					to: 'https://tailwindcss.com',
					target: '_blank',
				},
			],
		},
	];
</script>

<template>
	<div class="bg-muted text-dimmed flex w-full justify-center py-5 text-xs">
		<UFooter class="w-full max-w-200">
			<template #top>
				<p>{{ page?.description }}</p>
			</template>

			<template #left>
				<UFooterColumns :columns="columns" />
			</template>
		</UFooter>
	</div>
</template>
