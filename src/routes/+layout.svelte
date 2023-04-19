<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	console.log($page.data.session);
	onMount(() => {
		import('@material-tailwind/html/scripts/ripple.js');
	});
</script>

<svelte:head>
	<title>Plumber</title>

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<div class="h-full bg-blue-gray-800 text-blue-gray-50">
	<img
			class="relative inline-block h-12 w-12 rounded-full object-cover object-center"
			alt="Avatar"
			src={$page.data.session.user.image}
		/>
	{$page.data.session.user.name}

	<slot />
</div>
