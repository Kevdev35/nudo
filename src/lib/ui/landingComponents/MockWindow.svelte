<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		path: string;
		children: Snippet;
	}

	let { path, children }: Props = $props();
</script>

<div
	aria-hidden="true"
	class="flex min-h-[310px] flex-col gap-3 rounded-[18px] border border-(--mock-border) bg-(--mock-bg) px-[18px] py-4
	       shadow-(--mock-shadow)"
>
	<div class="flex items-center justify-between border-b border-(--mock-line) pb-3">
		<div class="flex gap-1.5">
			<span class="block size-[9px] rounded-full bg-[#ff5f56]"></span>
			<span class="block size-[9px] rounded-full bg-[#ffbd2e]"></span>
			<span class="block size-[9px] rounded-full bg-[#27c93f]"></span>
		</div>
		<span class="font-mono text-[.72rem] font-bold text-muted">{path}</span>
	</div>
	{@render children()}
</div>