<script lang="ts">
	import './layout.css';
	import 'remixicon/fonts/remixicon.css';
	import favicon from '$lib/assets/favicon.svg';

	import FloatBtn from '@ui/components/FloatBtn.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach(el => {
			el.setAttribute('autocomplete', 'off');
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Dashboard — Nudo</title>
</svelte:head>

<section class="bg-nudo-bg min-h-screen">
	{@render children()}
	<FloatBtn />
</section>
