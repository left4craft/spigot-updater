<script>
	import ExclamationTriangleSolid from './svg/ExclamationTriangleSolid.svelte';

	export let type;

	const colours = {
		info: 'bg-blue-500/25 border-blue-500',
		error: 'bg-red-500/25 border-red-500',
		success: 'bg-green-500/25 border-green-500',
		warning: 'bg-orange-500/25 border-orange-500'
	};
</script>

<div
	class={`mb-6 block w-full rounded-lg p-4 text-base leading-5 text-white border ${colours[type]}`}
>
	<div class="flex flex-row items-center gap-2">
		{#if type === 'warning'}
			<span class="text-orange-800">
				<ExclamationTriangleSolid />
			</span>
		{/if}
		<div>
			<slot />
		</div>
	</div>
</div>
