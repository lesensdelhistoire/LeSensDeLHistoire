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

	const seoDescription = computed(() => {
		const categoryList = categories.value
			?.slice(0, 5)
			.map((cat) => `"${cat.label || cat.meta?.title}"`)
			.join(', ');

		const articleList = articles.value
			?.slice(0, 5)
			.map((a) => `"${a.title}"`)
			.join(', ');

		return [
			page.value?.description,
			articles.value?.length
				? `Parmi les derniers articles publiés : ${articleList}, etc.`
				: '',
			categories.value?.length
				? `\nRetrouvez ces thématiques : ${categoryList}, etc.`
				: '',
		]
			.filter(Boolean)
			.join('\n\n');
	});

	useSeoMeta({
		title: page.value?.title,
		ogTitle: page.value?.title,
		twitterTitle: page.value?.title,

		description: seoDescription.value,
		ogDescription: seoDescription.value,
		twitterDescription: seoDescription.value,

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
				<div class="flex w-full gap-2.5">
					<UContentSearchButton :collapsed="false" class="w-full" />

					<UColorModeButton variant="outline" />
				</div>

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
						<HCategorySelector
							:categoryLabel="
								category.label ||
								(category.meta.title as string)
							"
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
						<HArticleCard
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
