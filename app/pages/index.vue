<script lang="ts" setup>
	import ArticleCard from '~/components/ArticleCard.vue';

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

	const { data: categories } = await useAsyncData('categories', () =>
		queryCollection('categories').all(),
	);

	const categorySelected = ref('');

	const selectCategory = (categoryEmited: string) => {
		categorySelected.value = categoryEmited;
	};

	const { data: articles } = await useAsyncData('articles', () =>
		queryCollection('articles')
			.where('archived', '=', false)
			.order('date', 'DESC')
			.all(),
	);

	const filteredArticles = computed(() => {
		const allArticles = articles.value;

		if (!categorySelected.value) {
			return allArticles;
		}

		return allArticles?.filter(
			(article) =>
				article.category
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.trim() ===
				categorySelected.value
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.trim(),
		);
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
							:selected="categorySelected"
							@category-selected="selectCategory"
							@category-unselected="() => (categorySelected = '')"
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
