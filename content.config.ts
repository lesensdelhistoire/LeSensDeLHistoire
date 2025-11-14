import { defineContentConfig, defineCollection, property } from '@nuxt/content';
import { date, z } from 'zod';

export default defineContentConfig({
	collections: {
		articles: defineCollection({
			type: 'page',
			source: 'articles/*.md',
			schema: z.object({
				title: z.string(),
				slug: z.string(),
				description: z.string(),
				category: z.string(),
				tags: z.array(z.string()),
				illustration: z.string(),
				date: z.date(),
				archived: z.boolean(),
			}),
		}),

		categories: defineCollection({
			type: 'data',
			source: 'categories/*.yml',
			schema: z.object({
				label: z.string(),
			}),
		}),
	},
});
