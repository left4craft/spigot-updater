<script>
	import { signIn } from '@auth/sveltekit/client';
</script>

<div class="text-center mb-12">
	<p class="text-lg">Log in to</p>
	<h1 class="text-5xl my-6 font-bold font-mono tracking-wide">
		Plumber
		<p class="m-0 text-sm text-gray-400">by Left4Craft</p>
	</h1>
</div>

<div>
	<button
		class="mx-auto group relative flex select-none items-center gap-3 overflow-hidden rounded-lg bg-blurple py-3.5 px-7 pr-[72px] text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-blurple/20 transition-all hover:shadow-lg hover:shadow-blurple/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
		type="button"
		data-ripple-dark="true"
		on:click={() => signIn('discord')}
	>
		Continue with Discord
		<span class="absolute right-0 grid h-full w-12 place-items-center bg-[#4954CC]">
			<img src="/icons/discord-mark-white.svg" alt="metamask" class="h-6 w-6" />
		</span>
	</button>
</div>
