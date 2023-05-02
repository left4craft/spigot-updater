<script>
	import ServerCard from '../../components/ServerCard.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="my-6">
	<div class="grid grid-cols-1 xl:grid-cols-2 gap-16">
		<div id="left">
			<div id="servers" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
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
