<script setup lang="ts">
	const props = defineProps<{
		categoryLabel: string;
		selected?: string;
	}>();

	const router = useRouter();

	const isCategorySelected = computed(
		() =>
			toRef(props.selected).value ===
			props.categoryLabel
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.trim(),
	);

	const handleClick = () => {
		isCategorySelected.value
			? router.push('')
			: router.push(
					`?category=${props.categoryLabel
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.trim()}`,
				);
	};
</script>

<template>
	<div
		class="flex cursor-pointer items-center justify-center border p-2.5 font-mono text-xs transition-colors select-none"
		:class="
			isCategorySelected
				? 'bg-accented border-accented'
				: 'bg-muted hover:bg-elevated hover:border-muted border-default dark:border-accented dark:hover:bg-[#303030]'
		"
		@click="handleClick"
	>
		{{ categoryLabel || 'Catégorie' }}
	</div>
</template>
