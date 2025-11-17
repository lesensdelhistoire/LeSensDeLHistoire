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

	const { data: surround } = await useAsyncData(
		`${route.path}-surround`,
		() =>
			queryCollectionItemSurroundings('articles', route.path, {
				fields: ['title', 'description', 'date'],
			})
				.where('archived', '=', false)
				// .where('category', '=', article.value?.category)
				.order('date', 'DESC'),
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

	const open = ref(false);

	const handleScroll = () => {
		if (open.value) {
			open.value = false;
		}
	};

	onMounted(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
	});

	onBeforeUnmount(() => {
		window.removeEventListener('scroll', handleScroll);
	});

	const seoDescription = computed(() => {
		if (article.value?.tags && article.value.tags.length) {
			return `${article.value?.description} - #${article.value.tags.join(', #')}`;
		}
		return article.value?.description;
	});

	useSeoMeta({
		title: `${article.value?.title} • LeSensDeLHistoire`,
		ogTitle: `${article.value?.title} • LeSensDeLHistoire`,
		twitterTitle: `${article.value?.title} • LeSensDeLHistoire`,

		description: seoDescription.value,
		ogDescription: seoDescription.value,
		twitterDescription: seoDescription.value,

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

						<img
							@click="open = true"
							class="h-90 w-full cursor-zoom-in border-2 border-neutral-200 object-cover object-center transition-all hover:border-4"
							:src="article.illustration"
							:alt="article.illustrationDetails"
						/>

						<Teleport to="#teleports">
							<div
								v-show="open"
								@click.self="open = false"
								class="modal bg-accented/80 fixed top-0 z-10 flex h-dvh w-full flex-col items-center justify-center gap-1.5 p-2.5 backdrop-blur-lg transition-all sm:p-5 md:p-10"
							>
								<img
									@click="open = false"
									class="h-fit w-full cursor-zoom-out object-contain object-center transition-all sm:max-h-9/10"
									:class="open ? 'scale-100' : 'scale-90'"
									:src="article.illustration"
									:alt="article.illustrationDetails"
								/>
								<p class="text-muted px-3 text-xs">
									{{ article.illustrationDetails }}
								</p>
							</div>
						</Teleport>


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

			<USeparator v-if="surround && surround.some(Boolean)" />

			<UContentSurround
				class="mt-15 mb-10"
				v-if="surround && surround.some(Boolean)"
				:surround="surround"
			/>
		</UContainer>
	</UPage>
</template>
