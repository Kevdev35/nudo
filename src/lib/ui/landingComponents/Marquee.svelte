<script lang="ts">
	interface Props {
		items?: string[];
		/** Veces que se repite la lista dentro de cada mitad (súbelo si la cinta no cubre pantallas muy anchas) */
		repeat?: number;
	}

	let {
		items = ['Proyectos', 'Clientes', 'Notas', 'Markdown', 'Kanban', 'Archivos'],
		repeat = 2
	}: Props = $props();

	// La pista tiene 2 mitades idénticas: al animar -50% el loop es continuo
	const halves = [0, 1];
	const half = $derived(Array.from({ length: repeat }, () => items).flat());
</script>

<div
	aria-hidden="true"
	class="group/strip overflow-hidden border-y border-(--card-border)
	       bg-(image:--strip)
	       shadow-(--strip-shadow)"
>
	<div
		class="flex w-max motion-safe:animate-marquee
		       group-hover/strip:[animation-play-state:paused]"
	>
		{#each halves as h (h)}
			<div class="flex">
				{#each half as label}
					<span
						class="flex items-center gap-6 py-[15px] pr-3 text-[.9rem] font-bold tracking-[-0.01em] text-ink-soft
						       after:text-[.75rem] after:text-accent after:opacity-75 after:content-['✦']"
					>
						{label}
					</span>
				{/each}
			</div>
		{/each}
	</div>
</div>