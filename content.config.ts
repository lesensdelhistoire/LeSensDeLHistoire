import { defineContentConfig, defineCollection, property } from '@nuxt/content';
import { date, z } from 'zod';

export default defineContentConfig({
	collections: {
		pages: defineCollection({
			type: 'page',
			source: 'pages/*.md',
			schema: z.object({
				title: z.string(),
				description: z.string(),
				seoImage: z.string(),
			}),
		}),

		articles: defineCollection({
			type: 'page',
			source: 'articles/*.md',
			schema: z.object({
				title: z.string(),
				description: z.string(),
				category: z.string(),
				tags: z.array(z.string()).optional(),
				illustration: z.string(),
				illustrationDetails: z.string(),
				date: z.date(),
				archived: z.boolean(),
			}),
		}),

		categories: defineCollection({
			type: 'data',
			source: 'categories/*.yml',
			schema: z.object({
				label: z.string().optional(),
			}),
		}),
	},
});
