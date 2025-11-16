<script setup lang="ts">
	const { data: navigation } = await useAsyncData('navigation', () =>
		queryCollectionNavigation('articles'),
	);
	const { data: files } = useLazyAsyncData(
		'search',
		() => queryCollectionSearchSections('articles'),
		{
			server: false,
		},
	);

	const searchTerm = ref('');

	const router = useRouter();

	const { data: categories } = await useAsyncData('categories', () =>
		queryCollection('categories').all(),
	);

	const selectedCategory = computed(() => {
		const category = router.currentRoute.value.query.category;
		return Array.isArray(category) ? category[0] || '' : category || '';
	});

	const { data: articles } = await useAsyncData('articles', () =>
		queryCollection('articles')
			.where('archived', '=', false)
			.order('date', 'DESC')
			.all(),
	);

	const filteredArticles = computed(() => {
		const allArticles = articles.value;

		return selectedCategory.value
			? allArticles?.filter(
					(article) =>
						article.category
							.toLowerCase()
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/g, '')
							.trim() === selectedCategory.value,
				)
			: allArticles;
	});

	const { data: page } = await useAsyncData('page', () =>
		queryCollection('pages').first(),
	);

	useSeoMeta({
		title: page.value?.title,
		ogTitle: page.value?.title,
		twitterTitle: page.value?.title,

		description: page.value?.description,
		ogDescription: page.value?.description,
		twitterDescription: page.value?.description,

		ogImage: page.value?.seoImage,
		ogUrl: page.value?.seoImage,
		twitterImage: page.value?.seoImage,
		twitterCard: 'summary_large_image',
	});
</script>

<template>
	<UPage>
		<UContainer class="flex w-full max-w-212 flex-col gap-12">
			<UPageHeader>
				<UContentSearchButton :collapsed="false" class="w-full" />

				<ClientOnly>
					<LazyUContentSearch
						v-model:search-term="searchTerm"
						:files="files"
						shortcut="meta_k"
						:navigation="navigation"
						:fuse="{ resultLimit: 42 }"
					/>
				</ClientOnly>

				<ul class="mt-2.5 flex w-full gap-2.5 overflow-scroll">
					<li v-for="category in categories" :key="category.label">
						<CategorySelector
							:categoryLabel="category.label"
							:selected="selectedCategory"
						/>
					</li>
				</ul>
			</UPageHeader>

			<UPageBody>
				<section class="flex flex-col gap-2.5">
					<h2 class="text-3xl">Derniers articles</h2>
					<ul
						class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3"
					>
						<ArticleCard
							v-for="article in filteredArticles"
							:key="article.path"
							:article="article"
						/>
					</ul>
				</section>
			</UPageBody>
		</UContainer>
	</UPage>
</template>
