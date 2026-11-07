<script lang="ts">
	import { reveal } from '@ui/landingComponents/logic/reveal';
	import { parallax } from '@ui/landingComponents/logic/parallax';
	import { gsap, registerGsap } from '@ui/landingComponents/logic/gsap';

	interface FooterLink {
		name: string;
		href: string;
	}
	interface FooterGroup {
		title: string;
		links: FooterLink[];
	}

	const groups: FooterGroup[] = [
		{
			title: 'Producto',
			links: [
				{ name: 'Funciones', href: '#funciones' },
				{ name: 'FAQ', href: '#faq' },
				{ name: 'Iniciar sesión', href: '/login' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ name: 'Privacidad', href: '/privacy' },
				{ name: 'Términos', href: '/terms' },
				{ name: 'Cookies', href: '/cookies' },
				{ name: 'Seguridad', href: '/security' }
			]
		}
	];

	const year = new Date().getFullYear();

	/*
	 * La O del wordmark "rueda" hacia la derecha sincronizada con el reveal
	 * (mismo trigger 'top 88%', ~1.3s) y al terminar la aparición regresa
	 * rodando a su posición inicial. transform-only, GPU.
	 */
	let wordmark = $state<HTMLElement>();
	let rollingO = $state<HTMLElement>();

$effect(() => {
	if (!wordmark || !rollingO) return;
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	registerGsap();

	const word: HTMLElement = wordmark;
	const o: HTMLElement = rollingO;

	// Rueda sin resbalar: ángulo (rad) = distancia / radio
	const radius = 0.37; // radio de la O en em (ajústalo a tu fuente)
	const dist = 0.45; // em que se aleja de la D
	const deg = (dist / radius) * (180 / Math.PI); // positivo = horario = rueda a la derecha

	gsap.set(o, { transformOrigin: '50% 56%', x: 0, y: 0, rotation: 0 });

	const tl = gsap.timeline({
		scrollTrigger: { trigger: word, start: 'top 88%', once: true }
	});

	// nudo → nud····o  (durante el reveal, frenando como una bola que rueda)
	tl.to(o, { x: `${dist}em`, rotation: deg, duration: 1.3, ease: 'power2.out' }, 0);

	// nud····o → nudo  (de regreso rodando, a la inversa)
	tl.to(o, { x: '0em', rotation: 0, duration: 0.9, ease: 'power2.inOut' }, 1.3);

	return () => {
		tl.scrollTrigger?.kill();
		tl.kill();
		gsap.set(o, { clearProps: 'all' });
	};
});
</script>

<footer
	class="relative mt-10 overflow-hidden rounded-t-[36px] bg-(--invert-bg) text-(color:--invert-fg) max-[720px]:rounded-t-[26px]
	       after:pointer-events-none after:absolute after:inset-0 after:bg-noise after:opacity-10
	       after:mix-blend-overlay after:content-['']"
>
	<!-- Glow decorativo (antes was before:) con deriva parallax durante el scroll -->
	<div
		aria-hidden="true"
		use:parallax={{ factor: 0.12 }}
		class="pointer-events-none absolute -top-85 -right-40 size-[720px]
		       bg-[radial-gradient(circle,var(--invert-glow),transparent_68%)]"
	></div>
	<div class="relative z-1 mx-auto max-w-[1140px] px-8 pt-21 max-[720px]:px-[22px] max-[720px]:pt-15">
		<!-- CTA -->
		<div use:reveal class="flex flex-wrap items-end justify-between gap-8">
			<div>
				<h2 class="max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
					Concentra tu próximo proyecto en un nudo.
				</h2>
				<p class="mt-3.5 max-w-[44ch] text-(color:--invert-text)">
					Crea tu cuenta y reúne ideas, documentos, tareas, archivos y clientes en un solo lugar.
				</p>
			</div>
			<a
				href="/register"
				class="group inline-flex items-center gap-2.5 rounded-full bg-(--invert-fg) px-7 py-[15px] font-bold text-(color:--invert-bg)
				       transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-(--cta-shadow-hover)"
			>
				Probar NUDO
				<i class="ri-arrow-right-line text-base transition-transform duration-200 group-hover:translate-x-1"></i>
			</a>
		</div>

		<!-- Links -->
		<div
			use:reveal={{ delay: 110 }}
			class="mt-18 flex gap-18 border-t border-(--invert-border) pt-9 max-[720px]:mt-13 max-[720px]:gap-12"
		>
			{#each groups as g (g.title)}
				<nav aria-label={g.title}>
					<h4 class="mb-4 font-mono text-[.72rem] font-medium tracking-widest text-(color:--invert-muted) uppercase">{g.title}</h4>
					<ul class="grid gap-[11px] text-[.95rem] text-(color:--invert-link)">
						{#each g.links as l (l.href)}
							<li><a href={l.href} class="transition-colors duration-200 hover:text-(color:--invert-fg)">{l.name}</a></li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<!-- Meta -->
		<div use:reveal={{ delay: 220 }} class="mt-11 flex flex-wrap items-center justify-between gap-4 text-[.82rem] text-(color:--invert-muted)">
			<span class="inline-flex items-center gap-[9px] font-semibold text-(color:--invert-link)">
				<i class="size-2 rounded-full bg-[#10b981] shadow-[0_0_0_4px_rgba(16,185,129,.22)]"></i>
				Beta abierta
			</span>
			<span>© {year} Nudo. Un producto de SheloraLabs.</span>
		</div>
	</div>

	<!-- Wordmark gigante, recortado por abajo (la O rueda con el reveal) -->
	<!-- Importante: NUD y la O son siblings — si la O anidara dentro del span con
	     bg-clip-text del padre, el recorte del padre la pinta fija en su slot
	     (doble O); como hermana, cada span recorta su propio gradiente. -->
	<span
		aria-hidden="true"
		bind:this={wordmark}
		use:reveal={{ variant: 'word' }}
		class="relative z-1 mt-7 -mb-[.13em] block text-center text-[clamp(5rem,32vw,24rem)] leading-[.94]
		       font-extrabold select-none"
	>
		<span class="bg-linear-to-b from-[rgba(205,170,255,.95)] via-[rgba(124,58,237,.38)]
		             via-58% to-[rgba(124,58,237,0)] bg-clip-text text-transparent" aria-hidden="true">NUD</span><span
			data-rolling-o
			bind:this={rollingO}
			class="inline-block will-change-transform bg-linear-to-b from-[rgba(205,170,255,.95)] via-[rgba(124,58,237,.38)]
			       via-58% to-[rgba(124,58,237,0)] bg-clip-text text-transparent">O</span>
	</span>
</footer>