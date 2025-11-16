<script lang="ts" setup>
	const props = defineProps<{
		tag: string;
	}>();
</script>

<template>
	<li
		class="group text-muted hover:text-default flex flex-row items-center gap-1 text-xs transition-colors select-none"
	>
		#
		<p>
			{{ tag }}
		</p>
	</li>
</template>
