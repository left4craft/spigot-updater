<script>
	import Alert from '../../components/Alert.svelte';
	import ServerCard from '../../components/ServerCard.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let downloadsInProgress = false;
</script>

<div class="my-6">
	<div class="grid grid-cols-1 xl:grid-cols-2 gap-16">
		<div id="left">
			{#if downloadsInProgress}
				<Alert type="warning">
					<span class="font-bold">Wait a few minutes before updating servers</span>
					to allow downloads to finish.
				</Alert>
			{/if}

			<h2 class="text-2xl">Servers</h2>

			{#if data.servers.find((s) => s.updatable)}
				<div id="controls" class="shadow-card rounded-xl bg-midnight-800/25 bg-clip-border border border-midnight-600/25 mt-4 mb-12">
					<div class="p-4">
						<div class="flex flex-row flex-wrap justify-center items-center gap-4">
							<button
								class="button bg-deep-orange-500/10 text-deep-orange-500 border border-deep-orange-500/20 hover:shadow-deep-orange-500/40"
								data-ripple-dark="true"
							>
								Update idle servers
							</button>
							{#if data.servers.find((s) => s.playerCount > 0)}
								<button
									class="button bg-deep-orange-500/10 text-deep-orange-500 border border-deep-orange-500/20 hover:shadow-deep-orange-500/40"
									data-ripple-dark="true"
								>
									Update all servers
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<div id="servers" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 mt-8">
				{#each data.servers as server}
					<ServerCard {server} />
				{/each}
			</div>
		</div>
		<div id="right">
			<div class="grid grid-cols-1 gap-8">
				<div id="server-software" class="bg-midnight-800/50 border border-midnight-600 rounded-xl">
					<div class="p-8">
						<h2 class="text-2xl">Server Software</h2>
						<div class="text-center my-12 text-midnight-100 text-lg">
							<!-- <img src="/undraw_my_answer_re_k4dv.svg" class="w-1/2 mx-auto p-8 my-8" alt="Choose" /> -->
							...
						</div>
					</div>
				</div>
				<div id="plugins" class="bg-midnight-800/50 border border-midnight-600 rounded-xl">
					<div class="p-8">
						<h2 class="text-2xl">Plugins</h2>
						<div class="text-center my-12 text-midnight-100 text-lg">
							<!-- <img src="/undraw_my_answer_re_k4dv.svg" class="w-1/2 mx-auto p-8 my-8" alt="Choose" /> -->
							...
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
