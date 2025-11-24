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

	const countWordsInNode = (node: unknown): number => {
		if (typeof node === 'string') {
			const words = node.trim().split(/\s+/u).filter(Boolean);
			return words.length;
		}

		if (Array.isArray(node)) {
			let startIndex = 1;

			if (
				typeof node[1] === 'object' &&
				!Array.isArray(node[1]) &&
				node[1] !== null
			) {
				startIndex = 2;
			}

			let total = 0;
			for (let i = startIndex; i < node.length; i += 1) {
				total += countWordsInNode(node[i]);
			}

			return total;
		}

		return 0;
	};

	const readingTime = computed(() => {
		const averageWPM = 200;

		const bodyValue = article.value?.body.value ?? [];

		const totalWords = bodyValue.reduce(
			(acc, paragraph) => acc + countWordsInNode(paragraph),
			0,
		);

		return Math.max(1, Math.ceil(totalWords / averageWPM));
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

		articleAuthor: ['Le Sens de l’Histoire'],
		articleSection: article.value.category,
		articleTag: article.value.tags?.map((tag) => tag),
		articlePublishedTime: article.value.date,
		articleModifiedTime: article.value.date,

		// slack unfurling
		twitterData1: 'Le Sens de l’Histoire',
		twitterLabel1: 'Author',
		twitterData2: `${readingTime.value} minutes`,
		twitterLabel2: 'Read Time',
	});

	useSchemaOrg([
		defineArticle({
			headline: () => article.value?.title,
			description: () => article.value?.description,

			datePublished: () => article.value?.date,
			dateModified: () => article.value?.date,

			image: () => article.value?.illustration,
			thumbnailUrl: () => article.value?.illustration,
			wordCount: () =>
				article.value?.body.value.reduce(
					(acc, paragraph) => acc + countWordsInNode(paragraph),
					0,
				),
		}),
	]);

	useHead({
		title: `${article.value?.title} • LeSensDeLHistoire`,
	});
</script>

<template>
	<UPage v-if="article">
		<ClientOnly>
			<UContentSearch />
		</ClientOnly>

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
						<div class="flex w-full justify-between gap-2.5">
							<HButton
								to="/"
								label="Retour"
								icon="lucide:chevron-left"
							/>

							<UColorModeButton
								variant="subtle"
								class="bg-muted hover:bg-elevated border-muted rounded-none dark:hover:bg-[#303030]"
							/>
						</div>

						<img
							@click="open = true"
							class="border-muted h-90 w-full cursor-zoom-in border-2 object-cover object-center transition-all select-none hover:border-4"
							:src="article.illustration"
							:alt="article.illustrationDetails"
						/>

						<Teleport to="#teleports">
							<div
								v-show="open"
								@click.self="open = false"
								class="modal bg-accented/80 fixed top-0 z-10 flex h-dvh w-full flex-col items-center justify-center gap-1.5 p-2.5 backdrop-blur-lg transition-all select-none sm:p-5 md:p-10"
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
							class="bg-muted hover:bg-elevated flex w-full items-center justify-center px-2.5 py-1 text-xs transition-colors dark:hover:bg-[#303030]"
						>
							{{ article.category }}
						</NuxtLink>

						<ul class="flex w-full flex-wrap gap-2.5">
							<HArticleTag
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

					<ClientOnly>
						<li>Temps de lecture : {{ readingTime }} minutes</li>
					</ClientOnly>
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
