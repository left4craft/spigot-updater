<script>
	import Puzzle from './svg/Puzzle.svelte';
	import ServerStack from './svg/ServerStack.svelte';
	import User from './svg/User.svelte';

	export let server;

	const bg =
		server.state === 'updating'
			? 'from-cyan-500 to-blue-500'
			: server.state === 'online'
			? 'from-green-500 to-light-green-500'
			: 'from-red-500 to-pink-500';
	const fg =
		server.state === 'updating'
			? 'text-light-blue-500'
			: server.state === 'online'
			? 'text-light-green-500'
			: 'text-red-500';
	const icons = [];
</script>

<div class="shadow-card flex flex-col rounded-xl bg-midnight-800 bg-clip-border">
	<div class="mx-4 -mt-4 translate-y-0">
		<div
			class={`flex items-center justify-center h-16 w-16 rounded-lg font-bold text-3xl select-none bg-gradient-to-br ${bg}`}
		>
			{server.name
				.replace(/\b(\w)\w+/g, '$1')
				.replace(/\s/g, '')
				.toUpperCase()}
		</div>
	</div>
	<div class="flex-1 -mt-2 p-6">
		<div>
			<h4 class="m-0">
				<span class="font-bold text-lg">{server.name}</span>
				<span class="float-right">
					<div class={`mr-1 inline-block h-2 w-2 rounded-full bg-gradient-to-br ${bg}`} />
					<span class={`font-medium ${fg}`}>{server.state}</span>
				</span>
			</h4>
			<p class="text-xs text-midnight-300">
				<span class="capitalize">{server.software.type}</span>
				<span class="float-right">{server.plugins.installedCount} plugins</span>
			</p>
		</div>

		<div class="my-4 text-midnight-100">
			<ul>
				<li>
					<span
						class={`mr-1 ${
							server.software.versionsBehind > 0 ? 'text-light-blue-500' : 'text-midnight-300'
						}`}><ServerStack /></span
					>
					<span class={server.software.versionsBehind > 0 ? 'text-light-blue-500' : ''}
						>{server.software.versionsBehind} versions behind</span
					>
				</li>
				<li>
					<span
						class={`mr-1 ${
							server.plugins.updatableCount > 0 ? 'text-light-blue-500' : 'text-midnight-300'
						}`}><Puzzle /></span
					>
					<span class={server.plugins.updatableCount > 0 ? 'text-light-blue-500' : ''}
						>{server.plugins.updatableCount} plugins updatable</span
					>
				</li>
				<li>
					<span class={`mr-1 ${server.playerCount > 0 ? 'text-orange-500' : 'text-midnight-300'}`}
						><User /></span
					>
					<span class={server.playerCount > 0 ? 'text-orange-500' : ''}
						>{server.playerCount} playing</span
					>
				</li>
			</ul>
		</div>
		<button
			class="middle none center rounded-lg bg-primary py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
			data-ripple-dark="true"
		>
			Button
		</button>
	</div>
</div>
