<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '@ui/landingComponents/logic/reveal';

	import DevsImage from '@img/devs.png'

	interface Audience {
		icon: string;
		title: string;
		text: string;
		tags: string[];
		imgs?: string;
	}

	const audiences: Audience[] = [
		{
			icon: 'ri-code-s-slash-line',
			title: 'Para desarrolladores',
			text: 'Tus especificaciones en Markdown, tus tareas en un tablero y tus diagramas, en el mismo lugar que el proyecto. Sin saltar entre cinco pestañas para recordar qué estabas haciendo.',
			tags: ['Markdown con historial', 'Kanban', 'Diagramas', 'Archivos'],
			imgs: DevsImage
		},
		{
			icon: 'ri-quill-pen-line',
			title: 'Para creativos',
			text: 'Referencias, bocetos, PDFs y notas, cada cosa junto al proyecto al que pertenece, con su cliente y su presupuesto a la vista.',
			tags: ['Imágenes y PDFs', 'Notas', 'Clientes', 'Presupuesto']
		}
	];
</script>

<section id="para-quien" class="mx-auto max-w-[1140px] px-8 pt-5 pb-25 max-[960px]:px-[22px] max-[960px]:pb-18">
	<SectionHeader
		eyebrow="Para quién es"
		title="Hecho para quien construye cosas."
		sub="Si llevas varios proyectos a la vez y tu información vive en demasiados lugares, Nudo es para ti."
	/>

	<div class="mt-12 grid grid-cols-2 gap-6 max-[960px]:grid-cols-1">
		{#each audiences as a, i (a.title)}
			<article
				use:reveal={{ delay: i * 120 }}
				class="group relative isolate overflow-hidden rounded-[18px] border border-(--card-border) bg-(--card-bg) px-[30px] py-[34px]
					shadow-(--card-shadow-soft) transition-[translate,box-shadow,border-color] duration-250
					before:pointer-events-none before:absolute before:z-1 before:-top-[110px] before:-right-[90px] before:size-[260px]
					before:bg-[radial-gradient(circle,var(--accent-soft),transparent_70%)] before:content-['']
					hover:-translate-y-1 hover:border-(--accent-border) hover:shadow-(--card-shadow-accent)"
			>
				{#if a.imgs}
					<img
						src={a.imgs}
						alt=""
						aria-hidden="true"
						loading="lazy"
						decoding="async"
						class="pointer-events-none absolute inset-0 z-0 size-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
					/>
					<div
						class="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-(--card-bg)/40 via-(--card-bg)/75 to-(--card-bg)"
						aria-hidden="true"
					></div>
				{/if}

				<div class="relative z-[2]">
					<div class="mb-5 grid size-12 place-items-center rounded-[14px] border border-accent-border bg-accent-light text-accent">
						<i class="{a.icon} text-[23px]"></i>
					</div>

					<h3 class="text-[1.35rem] font-extrabold tracking-[-0.03em]">{a.title}</h3>
					<p class="mt-2.5 leading-[1.6] text-muted">{a.text}</p>

					<div class="mt-[22px] flex flex-wrap gap-2">
						{#each a.tags as tag}
							<span class="rounded-full border border-accent-border bg-accent-light px-3 py-1.5 text-[.78rem] font-semibold text-accent">
								{tag}
							</span>
						{/each}
					</div>
				</div>
			</article>
		{/each}
	</div>

	<p use:reveal class="mt-8 text-center text-[1.02rem] text-muted">
		Lo que tienen en común: varios proyectos activos y todo regado.
		<strong class="text-ink">Nudo los ata.</strong>
	</p>
</section>