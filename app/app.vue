<template>
	<Head>
		<Html class="scroll-pt-30 scroll-smooth" />
	</Head>

	<div>
		<NuxtRouteAnnouncer />
		<NuxtLoadingIndicator />

		<UApp>
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</UApp>
	</div>
</template>
