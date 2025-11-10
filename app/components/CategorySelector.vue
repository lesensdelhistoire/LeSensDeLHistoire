<script lang="ts" setup>
	const props = defineProps<{
		categoryLabel: string;
		categoryValue: string;
		selected?: string;
	}>();

	const emits = defineEmits(['categorySelected', 'categoryUnselected']);

	const isCategorySelected = computed(() =>
		toRef(props.selected).value === props.categoryValue ? true : false,
	);

	const handleClick = () => {
		isCategorySelected.value
			? emits('categoryUnselected')
			: emits('categorySelected', props.categoryValue);
	};
</script>

<template>
	<div
		class="flex cursor-pointer items-center justify-center border px-2.5 py-1.5 transition-colors select-none"
		:class="
			isCategorySelected
				? 'bg-accented border-accented'
				: 'bg-muted hover:bg-elevated hover:border-muted border-neutral-200'
		"
		@click="handleClick"
	>
		{{ categoryLabel || 'Catégorie' }}
	</div>
</template>
