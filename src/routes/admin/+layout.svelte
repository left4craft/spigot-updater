<script>
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
</script>

<nav class="p-8 mb-8 text-center">
	<span class="text-2xl font-bold font-mono tracking-wide">
		<a href="/"> Plumber </a>
	</span>
	<span class="mx-6 text-2xl text-midnight-400">|</span>
	{#if Object.keys($page.data.session || {}).length}
		<button on:click={() => signOut()} title="Logout">
			<img
				class="relative inline-block h-8 w-8 rounded-full object-cover object-center"
				alt="Avatar"
				src={$page.data.session.user.image}
			/>
			{$page.data.session.user.name}
		</button>
	{/if}
</nav>

<main class="m-2 sm:m-4 lg:mx-8 xl:mx-16">
	<slot />
</main>
