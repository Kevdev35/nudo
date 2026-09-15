<script lang="ts">
	import './layout.css';
	import 'remixicon/fonts/remixicon.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Dashboard — Nudo</title>
</svelte:head>

{@render children()}
