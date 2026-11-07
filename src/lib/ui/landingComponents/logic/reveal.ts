import { gsap, ScrollTrigger, registerGsap } from './gsap';
import { CustomEase } from 'gsap/CustomEase';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'word';

interface RevealOptions {
	variant?: Variant;
	/** ms de retraso (para escalonar elementos hermanos) */
	delay?: number;
	/** ms de duración */
	duration?: number;
}

/** Estado inicial ("from") por variante — los end values son siempre neutros. */
const FROM: Record<Variant, gsap.TweenVars> = {
	up: { y: 28 },
	left: { x: -36 },
	right: { x: 36 },
	scale: { scale: 0.95, y: 18 },
	word: { yPercent: 38 }
};

/* cubic-bezier(.2,.8,.2,1) del original, como path de CustomEase */
let revealEase: ReturnType<typeof CustomEase.create> | undefined;
function getEase() {
	return (revealEase ??= CustomEase.create('nudo-reveal', 'M0,0 C0.2,0.8 0.2,1 1,1'));
}

const SEC = (ms: number) => ms / 1000;

export function reveal(
	node: HTMLElement,
	{ variant = 'up', delay = 0, duration = variant === 'word' ? 1300 : 850 }: RevealOptions = {}
) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	registerGsap();

	/**
	 * fromTo con estado final explícito (lección de la navbar): el trigger
	 * dispara una vez cuando el nodo entra por viewport — equivalente al
	 * IntersectionObserver original (threshold 0.15 + rootMargin bottom -6%
	 * ≈ 'top 88%').
	 */
	const tween = gsap.fromTo(
		node,
		{ opacity: 0, ...FROM[variant] },
		{
			opacity: 1,
			x: 0,
			y: 0,
			yPercent: 0,
			scale: 1,
			delay: SEC(delay),
			duration: SEC(duration),
			ease: getEase(),
			scrollTrigger: {
				trigger: node,
				start: 'top 88%',
				once: true
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
