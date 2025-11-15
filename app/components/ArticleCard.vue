<script lang="ts" setup>
	export type ArticleCardItem = {
		title: string;
		description: string;
		category: string;
		tags: string[];
		illustration: string;
		illustrationDetails: string;
		date: string;
		archived: boolean;
		path: string;
	};

	const props = defineProps<{
		horizontal?: boolean;
		article: ArticleCardItem;
	}>();
</script>

<template>
	<li>
		<NuxtLink
			class="bg-muted border-muted group hover:bg-elevated h-fit w-full cursor-pointer gap-5 overflow-hidden border p-3 transition-colors sm:p-5"
			:class="
				horizontal
					? 'gridgrid-cols-1 sm:grid-cols-2 md:grid-cols-3'
					: 'flex flex-col sm:h-153'
			"
			:to="article.path"
		>
			<header
				class="flex h-fit w-full flex-col gap-2.5"
				:class="horizontal ? 'col-span-1' : ''"
			>
				<div
					class="flex aspect-square w-full items-center justify-center overflow-hidden border border-neutral-200"
				>
					<img
						:src="article.illustration"
						class="h-full scale-110 object-cover object-center transition-transform group-hover:scale-100"
						:alt="article.illustrationDetails"
					/>
				</div>

				<div
					class="bg-elevated group-hover:bg-accented flex h-fit w-full justify-center py-0.5 text-xs transition-colors"
				>
					{{ article.category }}
				</div>
			</header>

			<div
				class="flex h-fit flex-col justify-start gap-2.5 overflow-hidden"
				:class="horizontal ? 'col-span-1 md:col-span-2' : ''"
			>
				<h2
					class="text-xl font-medium"
					:class="horizontal ? 'line-clamp-3' : 'line-clamp-5'"
				>
					{{ article.title }}
				</h2>

				<p class="font-mono text-xs italic">
					<NuxtTime
						:datetime="article.date"
						year="numeric"
						month="long"
						day="numeric"
						locale="fr-FR"
					/>
				</p>

				<p
					class="text-sm"
					:class="
						horizontal
							? 'line-clamp-7'
							: 'line-clamp-10 sm:line-clamp-6'
					"
				>
					{{ article.description }}
				</p>
			</div>
		</NuxtLink>
	</li>
</template>
