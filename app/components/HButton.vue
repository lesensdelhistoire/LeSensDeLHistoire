<script setup lang="ts">
	const props = defineProps<{
		to?: string;
		label?: string;
		icon?: string;
	}>();
</script>

<template>
	<NuxtLink
		v-if="to"
		:to="to"
		class="border-default bg-muted hover:bg-elevated hover:border-muted text-muted hover:text-default flex cursor-pointer items-center justify-center gap-1 border text-sm transition-colors select-none dark:border-[#303030]"
		:class="!label && icon ? 'p-1' : 'px-3 py-0.5'"
	>
		<UIcon v-if="icon" :name="icon" class="mt-px" />

		{{ label }}

		<template v-if="!label && !icon"> Button </template>
	</NuxtLink>

	<button
		v-else
		class="border-default bg-muted hover:bg-elevated hover:border-muted text-muted hover:text-default flex items-center justify-center gap-1 border text-sm transition-colors select-none dark:border-[#303030]"
		:class="!label && icon ? 'p-1' : 'px-3 py-0.5'"
	>
		<UIcon v-if="icon" :name="icon" />

		{{ label }}

		<template v-if="!label && !icon"> Button </template>
	</button>
</template>
