<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '@ui/landingComponents/logic/reveal';
	import { gsap } from '@ui/landingComponents/logic/gsap';

	interface Question {
		q: string;
		a: string;
	}

	const questions: Question[] = [
		{
			q: '¿Cuánto cuesta usar Nudo?',
			a: 'Durante la beta puedes usarlo sin costo. Si esto cambia, lo avisaremos con anticipación.'
		},
		{
			q: '¿Mis proyectos son privados?',
			a: 'Sí. Cada proyecto pertenece a tu cuenta y solo tú puedes verlo.'
		},
		{
			q: '¿Puedo exportar mis datos?',
			a: 'Todavía no, pero es una función que estamos desarrollando. Cuando esté lista, podrás descargar tu información personal.'
		},
		{
			q: '¿Puedo separar mis proyectos personales de los de clientes?',
			a: 'Sí. Los clientes son una entidad aparte: puedes asignarles proyectos y dejar los personales sin cliente.'
		},
		{
			q: '¿Qué pasa con las versiones anteriores de mis documentos?',
			a: 'Cada vez que editas un documento Markdown se guarda la versión anterior, y puedes consultarla cuando la necesites.'
		}
	];

	const DUR = 0.3;
	let openStates = $state(questions.map(() => false));

	const answers: (HTMLDivElement | undefined)[] = [];
	const bindPanel = (node: HTMLDivElement, index: number) => {
		answers[index] = node;
	};

	/**
	 * El contenido del FAQ está siempre en el DOM (SEO / sin JS). Al hidratar
	 * colapsa todo al instante (gsap.set, sin tween — seguro para reduced-motion).
	 */
	const faqInit = (node: HTMLElement) => {
		node.querySelectorAll<HTMLDivElement>('.faq-answer').forEach((panel) => {
			gsap.set(panel, { height: 0, autoAlpha: 0 });
		});
	};

	function toggle(index: number) {
		const panel = answers[index];
		if (!panel) return;

		const opening = !openStates[index];
		openStates[index] = opening; // aria-expanded e icono giran al instante

		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(panel, { height: opening ? 'auto' : 0, autoAlpha: opening ? 1 : 0 });
			return;
		}

		if (opening) {
			gsap.to(panel, {
				overwrite: 'auto',
				height: panel.scrollHeight,
				autoAlpha: 1,
				duration: DUR,
				ease: 'power2.out',
				onComplete: () => gsap.set(panel, { height: 'auto' }) // tolera resizes
			});
		} else {
			gsap.to(panel, {
				overwrite: 'auto',
				height: 0,
				autoAlpha: 0,
				duration: DUR,
				ease: 'power2.in',
				onComplete: () => gsap.set(panel, { height: 0, autoAlpha: 0 })
			});
		}
	}
</script>

<section id="faq" class="mx-auto max-w-[1140px] px-8 py-25 max-[960px]:px-[22px] max-[960px]:py-18">
	<SectionHeader eyebrow="FAQ" title="Preguntas frecuentes." />

	<div class="mt-11 grid max-w-[760px] gap-3" use:faqInit>
		{#each questions as { q, a }, i (q)}
			<div use:reveal={{ delay: i * 80 }} class="rounded-2xl border border-(--card-border) bg-(--card-bg) px-[22px]">
				<button
					type="button"
					aria-expanded={openStates[i]}
					onclick={() => toggle(i)}
					class="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-bold"
				>
					{q}
					<span
						aria-hidden="true"
						class="text-[1.4rem] font-medium text-accent transition-transform duration-200
						       {openStates[i] ? 'rotate-45' : ''}"
					>
						+
					</span>
				</button>
				<div use:bindPanel={i} class="faq-answer overflow-hidden">
					<p class="max-w-[62ch] pb-5 text-[.95rem] text-muted">{a}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
