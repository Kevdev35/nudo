<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '@ui/landingComponents/logic/reveal';

	interface RoadItem {
		title: string;
		text: string;
	}

	const items: RoadItem[] = [
		{
			title: 'Línea de tiempo',
			text: 'Diagramas de Gantt para ver cómo evoluciona un proyecto complejo en el tiempo.'
		},
		{
			title: 'Capa de inteligencia artificial',
			text: 'Búsqueda semántica, resúmenes automáticos y consultas sobre el contexto de cada proyecto.'
		}
	];
</script>

<section class="mx-auto max-w-[1140px] px-8 py-25 max-[960px]:px-[22px] max-[960px]:py-18">
	<SectionHeader eyebrow="Próximamente" title="Lo que viene para Nudo." />

	<div class="mt-12 grid grid-cols-2 gap-[22px] max-[960px]:grid-cols-1">
		{#each items as item, i (item.title)}
			<div
				use:reveal={{ delay: i * 110 }}
				class="rounded-[18px] border border-(--card-border) bg-(--card-bg) px-[26px] py-7
				       shadow-(--card-shadow-soft)"
			>
				<span class="mb-3.5 inline-block rounded-full border border-accent-border bg-accent-light px-2.5 py-[3px] text-[.7rem] font-bold text-accent">
					Próximamente
				</span>
				<h3 class="mb-2 text-[1.1rem] font-bold text-ink">{item.title}</h3>
				<p class="text-[.92rem] text-muted">{item.text}</p>
			</div>
		{/each}
	</div>
</section>