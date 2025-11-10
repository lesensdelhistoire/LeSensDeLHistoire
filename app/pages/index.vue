<script lang="ts" setup>
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
</script>

<template>
	<UPage>
		<UContainer class="w-full max-w-198">
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
					<li v-for="category in categories">
						<CategorySelector
							:categoryLabel="category.label"
							:categoryValue="category.value"
							:selected="categorySelected"
							@category-selected="selectCategory"
							@category-unselected="() => (categorySelected = '')"
						/>
					</li>
				</ul>
			</UPageHeader>
			<UPageBody> test </UPageBody>
		</UContainer>
	</UPage>
</template>
