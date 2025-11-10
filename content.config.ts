import { defineContentConfig, defineCollection, property } from '@nuxt/content';
import { z } from 'zod';

export default defineContentConfig({
	collections: {
		articles: defineCollection({
			type: 'page',
			source: 'articles/*.md',
		}),

		categories: defineCollection({
			type: 'data',
			source: 'categories/*.yml',
			schema: z.object({
				label: z.string(),
				value: z.string(),
			}),
		}),
	},
});
