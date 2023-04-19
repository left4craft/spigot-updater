<script>
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
</script>

<nav>
	{#if Object.keys($page.data.session || {}).length}
		<button on:click={() => signOut()} title="Logout">
			<img
				class="relative inline-block h-12 w-12 rounded-full object-cover object-center"
				alt="Avatar"
				src={$page.data.session.user.image}
			/>
			{$page.data.session.user.name}
		</button>
	{/if}
</nav>

<main>
	<slot />
</main>
