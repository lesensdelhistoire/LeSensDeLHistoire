<script setup lang="ts">
	definePageMeta({
		layout: 'article',
	});

	const route = useRoute();

	const { data: article } = await useAsyncData(
		`article-${route.params.slug}`,
		() =>
			queryCollection('articles')
				.path(route.path)
				.where('archived', '=', false)
				.first(),
	);

	if (!article.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Page not found',
			fatal: true,
		});
	}

	const readingTime = computed(() => {
		const averageWPM = 200;

		const wordsInArticle = ref(0);

		const bodyValue = article.value?.body.value;
		if (bodyValue !== undefined) {
			for (const paragraph of bodyValue) {
				const text = paragraph[2];
				if (typeof text === 'string') {
					wordsInArticle.value += text.split(' ').length;
				}
			}
		}

		return Math.ceil(wordsInArticle.value / averageWPM);
	});

	useSeoMeta({
		title: `${article.value?.title} • LeSensDeLHistoire`,
		ogTitle: `${article.value?.title} • LeSensDeLHistoire`,
		twitterTitle: `${article.value?.title} • LeSensDeLHistoire`,

		description:
			article.value?.tags && article.value.tags.length
				? `${article.value?.description} - #${article.value.tags.join(', #')}`
				: article.value?.description,
		ogDescription:
			article.value?.tags && article.value.tags.length
				? `${article.value?.description} - #${article.value.tags.join(', #')}`
				: article.value?.description,
		twitterDescription:
			article.value?.tags && article.value.tags.length
				? `${article.value?.description} - #${article.value.tags.join(', #')}`
				: article.value?.description,

		ogImage: article.value?.illustration,
		ogUrl: article.value?.illustration,
		twitterImage: article.value?.illustration,
		twitterCard: 'summary_large_image',
	});

	useHead({
		title: `${article.value?.title} • LeSensDeLHistoire`,
	});
</script>

<template>
	<UPage v-if="article">
		<template #left>
			<UPageAside></UPageAside>
		</template>

		<template #right>
			<UPageAside>
				<UContentToc
					:title="article.title"
					v-if="article?.body?.toc?.links?.length"
					:links="article.body.toc.links"
					color="neutral"
					highlight
					highlight-color="neutral"
				/>
			</UPageAside>
		</template>

		<UContainer class="w-full max-w-200">
			<UPageHeader class="border-b-0">
				<div class="flex flex-col gap-10">
					<div class="flex flex-col items-start gap-2.5">
						<HButton
							to="/"
							label="Retour"
							icon="lucide:chevron-left"
						/>

						<UModal
							:ui="{
								content: 'rounded-none',
							}"
						>
							<img
								class="h-90 w-full cursor-zoom-in border-2 border-neutral-200 object-cover object-center transition-all hover:border-4"
								:src="article.illustration"
								:alt="article.illustrationDetails"
							/>

							<template #content>
								<img
									:src="article.illustration"
									class="h-full w-full rounded-none"
								/>

								<p class="text-muted px-3 py-2 text-xs">
									{{ article.illustrationDetails }}
								</p>
							</template>
						</UModal>

						<NuxtLink
							:to="`/?category=${article.category
								.toLowerCase()
								.normalize('NFD')
								.replace(/[\u0300-\u036f]/g, '')
								.trim()}`"
							class="bg-muted hover:bg-elevated flex w-full items-center justify-center px-2.5 py-1 text-xs transition-colors"
						>
							{{ article.category }}
						</NuxtLink>

						<ul class="flex w-full flex-wrap gap-2.5">
							<ArticleTag
								v-for="tag in article.tags"
								:key="tag"
								:tag="tag"
							/>
						</ul>
					</div>

					<h1
						class="text-highlighted font-sans text-4xl font-medium sm:text-5xl"
					>
						{{ article.title }}
					</h1>
				</div>
			</UPageHeader>

			<UPageBody class="space-y-2.5">
				<ul
					class="text-muted flex w-full flex-wrap justify-between gap-2.5 text-xs"
				>
					<li>
						<NuxtTime
							:datetime="article.date"
							year="numeric"
							month="long"
							day="numeric"
							locale="fr-FR"
						/>
					</li>

					<li>Temps de lecture : {{ readingTime }} minutes</li>
				</ul>

				<div
					class="sm:bg-muted sm:border-muted p-0 sm:border sm:px-15 sm:py-10"
				>
					<ContentRenderer :value="article.body" />
				</div>
			</UPageBody>
		</UContainer>
	</UPage>
</template>
