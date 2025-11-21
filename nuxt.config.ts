// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	app: {
		head: {
			title: 'Le Sens de l’Histoire',

			htmlAttrs: {
				lang: 'fr-FR',
			},

			link: [
				{
					rel: 'icon',
					type: 'image/png',
					href: '/favicon.png',
				},
			],
		},
	},

	modules: [
		'@nuxtjs/seo',
		'@nuxt/ui',
		'@nuxt/content',
		'nuxt-studio',
		'@compodium/nuxt',
	],
	css: ['~/assets/css/main.css'],

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
