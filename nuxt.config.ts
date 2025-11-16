// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	nitro: {
		prerender: {
			// Pre-render the homepage
			routes: ['/', '/articles', '/articles/[slug]'],
			// Then crawl all the links on the page
			crawlLinks: true,
		},
	},

	modules: ['@nuxt/ui', '@nuxt/content', 'nuxt-studio', '@compodium/nuxt'],
	css: ['~/assets/css/main.css'],
	ui: {
		colorMode: false,
	},

	content: {
		build: {
			markdown: {
				toc: {
					depth: 5,
					searchDepth: 5,
				},
			},
		},

		renderer: {
			anchorLinks: {
				h1: true,
				h2: true,
				h3: true,
				h4: true,
				h5: false,
				h6: false,
			},
		},

		preview: {
			api: 'https://api.nuxt.studio',
			dev: true,
		},
	},

	studio: {
		route: '/_studio',

		repository: {
			provider: 'github',
			owner: 'banedPowell',
			repo: 'LeSensDeLHistoire',
		},
	},
});
