<script lang="ts" setup>
	const props = defineProps<{
		tag: string;
	}>();
</script>

<template>
	<li
		class="group text-muted hover:text-default text-xs transition-colors select-none"
	>
		<NuxtLink
			:to="`/articles?tag=${tag}`"
			class="flex flex-row items-center gap-1"
		>
			#
			<p class="group-hover:underline">
				{{ tag }}
			</p>
		</NuxtLink>
	</li>
</template>
