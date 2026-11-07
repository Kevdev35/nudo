import { gsap } from './gsap';

interface TiltOptions {
	max?: number; // grados máximos
	ease?: number; // en GSAP ya no aplica: el lerp original (0.12/f) ≈ expo.out 0.45s
	rest?: { x: number; y: number };
}

/** Acción para el contenedor. Inclina el hijo con [data-tilt]. */
export function tilt(node: HTMLElement, { max = 7, rest = { x: 2.5, y: -3.5 } }: TiltOptions = {}) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const target = node.querySelector<HTMLElement>('[data-tilt]');
	if (!target) return;

	gsap.set(target, { transformPerspective: 1000, rotationX: rest.x, rotationY: rest.y });

	// quickTo reutiliza el tween: mismo "seguimiento al cursor" del lerp original
	const rotX = gsap.quickTo(target, 'rotationX', { duration: 0.45, ease: 'expo.out' });
	const rotY = gsap.quickTo(target, 'rotationY', { duration: 0.45, ease: 'expo.out' });

	const onMove = (e: PointerEvent) => {
		if (e.pointerType !== 'mouse') return;
		const r = node.getBoundingClientRect();
		const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
		const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
		rotX(-ny * max);
		rotY(nx * max);
	};
	const onLeave = () => {
		rotX(rest.x);
		rotY(rest.y);
	};

	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
			gsap.killTweensOf(target);
			gsap.set(target, { clearProps: 'transform' });
		}
	};
}
