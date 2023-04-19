<script>
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(() => {
		import('@material-tailwind/html/scripts/ripple.js');
	});
</script>

<svelte:head>
	<title>Plumber</title>

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<div class="h-full bg-midnight-900 text-midnight-50">
	<slot />
</div>
