<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '@ui/landingComponents/logic/reveal';

	const sin = [
		'Ideas perdidas en borradores y notas sueltas.',
		'Tareas desconectadas de la documentación.',
		'Diagramas y diseños dispersos entre enlaces.',
		'Clientes y presupuestos en hojas separadas.'
	];

	const con = [
		'Ideas, notas e investigación en un solo lugar.',
		'Documentos Markdown con historial de versiones.',
		'Tableros Kanban dentro de cada proyecto.',
		'Clientes como entidad propia, con sus proyectos.'
	];

	// Clases completas (estáticas) para que Tailwind las detecte
	const li =
		'relative pl-7 text-[.95rem] before:absolute before:top-px before:left-0 before:grid before:size-[18px] ' +
		'before:place-items-center before:rounded-full before:text-[.68rem] before:font-extrabold';
	const liBad = `${li} text-muted before:bg-(--bad-bg) before:text-(--bad-fg) before:content-['✕']`;
	const liGood = `${li} text-ink-soft before:bg-accent before:text-(color:--accent-fg) before:content-['✓']`;

	const card =
		'rounded-[18px] border bg-(--card-bg) px-7 py-[30px]';
</script>

<section id="problema" class="mx-auto max-w-[1140px] px-8 py-25 max-[960px]:px-[22px] max-[960px]:py-18">
	<SectionHeader
		eyebrow="El problema"
		title="Deja de repartir tu proyecto en cinco herramientas."
		sub="Las ideas quedan en una app, las tareas en otra, los documentos en otra y los clientes en una hoja de cálculo. Nudo reúne todo en el mismo lugar."
	/>

	<div class="mt-12 grid grid-cols-2 gap-6 max-[960px]:grid-cols-1">
		<div
			use:reveal={{ variant: 'left' }}
			class="{card} border-(--card-border) shadow-(--card-shadow-soft)"
		>
			<h3 class="mb-[18px] text-[1.05rem] font-extrabold">Sin Nudo</h3>
			<ul class="grid gap-3.5">
				{#each sin as item}
					<li class={liBad}>{item}</li>
				{/each}
			</ul>
		</div>

		<div
			use:reveal={{ variant: 'right', delay: 120 }}
			class="{card} border-accent-border shadow-(--card-shadow-accent)"
		>
			<h3 class="mb-[18px] text-[1.05rem] font-extrabold">Con Nudo: un proyecto, un contexto</h3>
			<ul class="grid gap-3.5">
				{#each con as item}
					<li class={liGood}>{item}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>