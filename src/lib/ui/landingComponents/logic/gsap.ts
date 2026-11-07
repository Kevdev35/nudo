import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Punto único de import de GSAP para landingComponents.
 * Importar el plugin es SSR-safe (chequea window); el registro se hace
 * lazy para garantizar cero acceso a window durante el SSR de SvelteKit.
 */
let registered = false;
export function registerGsap() {
	if (!registered) {
		gsap.registerPlugin(ScrollTrigger);
		registered = true;
	}
}

export { gsap, ScrollTrigger };
