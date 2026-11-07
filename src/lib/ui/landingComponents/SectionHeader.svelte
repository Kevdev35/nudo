<script lang="ts">
	import { reveal } from '@ui/landingComponents/logic/reveal';

	interface Props {
		eyebrow: string;
		title: string;
		sub?: string;
	}

	let { eyebrow, title, sub }: Props = $props();
</script>

<span
	use:reveal
	class="mb-3 inline-block text-[.8rem] font-bold tracking-[.08em] text-accent uppercase"
>
	{eyebrow}
</span>

<h2
	use:reveal={{ delay: 90 }}
	class="max-w-[20ch] text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink"
>
	{title}
</h2>

{#if sub}
	<p use:reveal={{ delay: 180 }} class="mt-4 max-w-[58ch] text-[1.08rem] text-muted">
		{sub}
	</p>
{/if}