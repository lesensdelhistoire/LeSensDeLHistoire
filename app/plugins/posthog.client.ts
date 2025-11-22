import posthog from 'posthog-js';

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig();

	// Skip PostHog initialization in development
	if (import.meta.dev) {
		console.log('PostHog disabled in development mode');
		return;
	}

	const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
		api_host: '/ingest',
		ui_host: runtimeConfig.public.posthogHost,
		person_profiles: 'always', // 'identified_only' or 'always' to create profiles for anonymous users as well
	});

	nuxtApp.hook('vue:error', (error) => {
		posthogClient.captureException(error);
	});

	return {
		provide: {
			posthog: () => posthogClient,
		},
	};
});
