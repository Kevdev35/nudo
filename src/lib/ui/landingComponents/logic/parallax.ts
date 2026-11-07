import { gsap, registerGsap } from './gsap';

interface ParallaxOptions {
	/**
	 * Intensidad: fracción de la altura del elemento que se desplaza al cruzar
	 * el viewport. 0.12 ≈ deriva sutil de un fondo decorativo.
	 */
	factor?: number;
}

/**
 * Parallax scroll-driven con scrub. Transform-only (GPU): cuando el elemento
 * está fuera de pantalla el ScrollTrigger no hace trabajo.
 */
export function parallax(node: HTMLElement, { factor = 0.12 }: ParallaxOptions = {}) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	registerGsap();

	const tween = gsap.fromTo(
		node,
		{ yPercent: -(factor * 40) },
		{
			yPercent: factor * 40,
			ease: 'none',
			scrollTrigger: {
				trigger: node,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true
			}
		}
	);

	return {
		destroy() {
			tween.scrollTrigger?.kill();
			tween.kill();
			gsap.set(node, { clearProps: 'all' });
		}
	};
}
