import posthog from 'posthog-js';

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig();

	// Skip PostHog initialization in development
	if (import.meta.dev) {
		console.log('PostHog disabled in development mode');
		return;
	}

	const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
		api_host: runtimeConfig.public.posthogHost,
		defaults: '2025-05-24',
	});

	return {
		provide: {
			posthog: () => posthogClient,
		},
	};
});
