export default defineAppConfig({
	ui: {
		colors: {
			neutral: 'neutral',
			primary: 'neutral',
		},

		prose: {
			h1: {
				slots: {
					base: 'text-highlighted font-sans text-5xl font-medium',
				},
			},

			h2: {
				slots: {
					base: 'text-highlighted font-sans text-4xl font-medium',
				},
			},

			h3: {
				slots: {
					base: 'text-highlighted font-sans text-3xl font-normal',
				},
			},

			h4: {
				slots: {
					base: 'text-highlighted font-sans text-2xl font-normal',
				},
			},

			h5: {
				slots: {
					base: 'text-muted font-sans text-xl font-normal',
				},
			},

			h6: {
				slots: {
					base: 'text-muted font-sans text-lg font-normal',
				},
			},

			p: {
				base: 'text-default text-justify',
			},

			a: {
				base: [
					'text-red-800 dark:text-red-500 border-b border-transparent hover:border-red-800 dark:dark:border-red-500 font-medium focus-visible:outline-red-800 dark:focus-visible:outline-red-500 [&>code]:border-dashed hover:[&>code]:border-red-800 dark:hover:[&>code]:border-red-500 hover:[&>code]:text-red-800 dark:hover:[&>code]:text-red-500',
					'transition-colors [&>code]:transition-colors',
				],
			},
		},
	},
});
