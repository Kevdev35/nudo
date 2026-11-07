import { gsap, ScrollTrigger, registerGsap } from './gsap';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MOBILE_BP = 960;
const FADE_NEAR_TEXT = 0.22;

interface RingConfig {
	rx: number;
	ry: number;
	tilt: number; // grados
	secs: number; // segundos por vuelta
	dir: 1 | -1;
	stroke: string;
	dash?: string;
}

// El índice de cada anillo coincide con data-ring en los orbitantes
const RINGS: RingConfig[] = [
	{ rx: 0.42, ry: 0.31, tilt: -10, secs: 75, dir: 1, stroke: 'rgba(124,58,237,.24)' },
	{ rx: 0.25, ry: 0.19, tilt: -10, secs: 50, dir: -1, stroke: 'rgba(124,58,237,.32)', dash: '4 10' }
];

const smooth = (a: number, b: number, x: number) => {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

/** Acción para el <section> del hero. Busca sus piezas por data-attributes. */
export function orbit(node: HTMLElement) {
	const scene = node.querySelector<HTMLElement>('[data-scene]');
	const copy = node.querySelector<HTMLElement>('[data-copy]');
	const svg = node.querySelector<SVGSVGElement>('[data-rings]');
	const blob = node.querySelector<HTMLElement>('[data-blob]');
	if (!scene || !copy || !svg || !blob) return;

	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const rings = RINGS.map((cfg, i) => ({
		...cfg,
		items: [...node.querySelectorAll<HTMLElement>(`[data-orbiter][data-ring="${i}"]`)]
	}));

	let W = 0, H = 0, cx = 0, cy = 0, base = 0, m = 1;
	let txt = { l: 0, r: 0, t: 0, b: 0 };
	let elapsed = 0;

	function measure() {
		const hr = node.getBoundingClientRect();
		const sr = scene!.getBoundingClientRect();
		const cr = copy!.getBoundingClientRect();

		W = hr.width;
		H = hr.height;
		cx = sr.left - hr.left + sr.width / 2;
		cy = sr.top - hr.top + sr.height / 2;
		txt = { l: cr.left - hr.left, r: cr.right - hr.left, t: cr.top - hr.top, b: cr.bottom - hr.top };
		base = Math.min(W, H * 1.3);
		m = W < MOBILE_BP ? 1.4 : 1;

		svg!.setAttribute('viewBox', `0 0 ${W} ${H}`);
		svg!.replaceChildren(
			...rings.map((r) => {
				const e = document.createElementNS(SVG_NS, 'ellipse');
				e.setAttribute('cx', String(cx));
				e.setAttribute('cy', String(cy));
				e.setAttribute('rx', String(r.rx * W * m));
				e.setAttribute('ry', String(r.ry * base * m));
				e.setAttribute('transform', `rotate(${r.tilt} ${cx} ${cy})`);
				e.setAttribute('fill', 'none');
				e.setAttribute('stroke', r.stroke);
				e.setAttribute('stroke-width', '1.5');
				if (r.dash) e.setAttribute('stroke-dasharray', r.dash);
				return e;
			})
		);

		const bs = sr.width * 1.05;
		Object.assign(blob!.style, {
			width: `${bs}px`,
			height: `${bs}px`,
			left: `${cx - bs / 2}px`,
			top: `${cy - bs / 2}px`
		});
	}

	/** Misma matemática del original; las propiedades se aplican vía gsap.set. */
	function place(t: number) {
		for (const r of rings) {
			const tilt = (r.tilt * Math.PI) / 180;
			r.items.forEach((el, j) => {
				const a = (r.dir * t * 2 * Math.PI) / r.secs + (j * 2 * Math.PI) / r.items.length;
				const ex = Math.cos(a) * r.rx * W * m;
				const ey = Math.sin(a) * r.ry * base * m;
				const w = el.offsetWidth;
				const h = el.offsetHeight;
				const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt);
				const y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);

				const d = (Math.sin(a) + 1) / 2; // 0 = atrás, 1 = adelante
				const s = 0.8 + 0.3 * d;

				// se desvanece al acercarse al texto
				const dx = Math.max(txt.l - x, 0, x - txt.r);
				const dy = Math.max(txt.t - y, 0, y - txt.b);
				const near = FADE_NEAR_TEXT + (1 - FADE_NEAR_TEXT) * smooth(0, 160, Math.hypot(dx, dy));

				gsap.set(el, {
					x: x - w / 2,
					y: y - h / 2,
					scale: s,
					rotation: Math.cos(a) * 4,
					filter: `blur(${(1 - d) * 1.5 + (1 - near) * 1.8}px)`,
					opacity: (0.75 + 0.25 * d) * near
				});
			});
		}
	}

	const refresh = () => {
		measure();
		place(elapsed);
	};

	// Loop rotado a gsap.ticker (reemplaza el rAF manual); deltaTime viene en ms
	let running = false;
	const tick = (_time: number, deltaTime: number) => {
		elapsed += deltaTime / 1000;
		place(elapsed);
	};
	const start = () => {
		if (reduce || running) return;
		running = true;
		gsap.ticker.add(tick);
	};
	const stop = () => {
		if (!running) return;
		running = false;
		gsap.ticker.remove(tick);
	};

	refresh();
	const ro = new ResizeObserver(refresh);
	ro.observe(node);

	// Pausa/reanuda según visibilidad del hero en viewport (scroll-driven)
	registerGsap();
	const st = ScrollTrigger.create({
		trigger: node,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => (self.isActive ? start() : stop())
	});

	addEventListener('load', refresh);
	document.fonts?.ready.then(refresh);

	return {
		destroy() {
			stop();
			st.kill();
			ro.disconnect();
			removeEventListener('load', refresh);
		}
	};
}
