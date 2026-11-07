<script lang="ts">
    import '../landing/landing.css';
    import { slide } from 'svelte/transition';
    import { gsap } from 'gsap';
    import { CustomEase } from 'gsap/CustomEase';

    import Logo from '@lib/assets/logotipo.svg'

    interface NavLink {
        name: string;
        href: string;
    }

    const sections: NavLink[] = [
        { name: 'El problema', href: '#problema' },
        { name: 'Funciones', href: '#funciones' },
        { name: 'FAQ', href: '#faq' }
    ];

    const signin: NavLink = { name: 'Iniciar sesión', href: '/login' };
    const cta: NavLink = { name: 'Probar NUDO', href: '/register' };

    let menuOpen = $state(false);
    const closeMenu = () => (menuOpen = false);
    const toggleMenu = () => (menuOpen = !menuOpen);

    const sectionLink =
        'relative py-1.5 transition-colors hover:text-(color:--ink) ' +
        'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 ' +
        'after:rounded-sm after:bg-linear-to-r after:from-(--accent) after:to-[#a855f7] ' +
        'after:transition-transform after:duration-250 hover:after:scale-x-100';

    const menuLink =
        'rounded-xl px-4 py-3 font-semibold text-(color:--ink-soft) hover:bg-(--accent-light) hover:text-(color:--accent)';

    let bar = $state<HTMLElement>();

    /*
     * Entrada de la navbar con GSAP (reemplaza los keyframes bar-* que estaban
     * en el @theme de layout.css). replica las mismas curvas y timings:
     * pop   = cubic-bezier(.2,.8,.2,1)  0.6s
     * open  = cubic-bezier(.77,0,.18,1) 1s @ 0.95s (desktop)
     * fades = css ease, 0.55s @ 1.7s / 1.78s / 1.86s (links), 1.8s / 1.9s (signin / CTA)
     * El bloque de estilos de abajo fija los estados iniciales pre-hidratación.
     */
    $effect(() => {
        if (!bar) return;
        gsap.registerPlugin(CustomEase);
        const popEase = CustomEase.create('nudo-nav-pop', 'M0,0 C0.2,0.8 0.2,1 1,1');
        const openEase = CustomEase.create('nudo-nav-open', 'M0,0 C0.77,0 0.18,1 1,1');
        const cssEase = CustomEase.create('nudo-nav-fade', 'M0,0 C0.25,0.1 0.25,1 1,1');

        const barEl: HTMLElement = bar;
        const fades = barEl.querySelectorAll<HTMLElement>('[data-nav-fade]');

        const mm = gsap.matchMedia();
        mm.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', () => {
            const tl = gsap.timeline();
            /*
             * fromTo con estado final explícito: el CSS pre-hidratación deja los valores
             * computados en 0, así que gsap.from() solo animaría 0 → 0. Los end values
             * replican las clases de Tailwind (opacity 1, max-w-[1140px], gap-5, pl-6, pr-2.5).
             */
            tl.fromTo(
                barEl,
                { y: -12, scale: 0.85, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: popEase }
            ).fromTo(
                barEl,
                { maxWidth: 140, gap: 0, padding: '0 24px' },
                {
                    maxWidth: 1140,
                    gap: 20,
                    padding: '0px 10px 0px 24px',
                    duration: 1,
                    ease: openEase
                },
                0.95
            );
            fades.forEach((el, i) =>
                tl.fromTo(
                    el,
                    { y: -5, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.55, ease: cssEase },
                    [1.7, 1.78, 1.86, 1.8, 1.9][i]
                )
            );
        });
        mm.add('(max-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(
                barEl,
                { y: -12, scale: 0.85, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: popEase
                }
            );
        });

        return () => mm.revert();
    });
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && closeMenu()} />

<header class="pointer-events-none sticky top-0 z-50 -mb-22 h-22 px-6 pt-4">
    <div
        class="bar pointer-events-auto mx-auto grid h-15 max-w-[1140px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
               items-center gap-5 rounded-(--radius-pill) border border-(--nav-border) bg-(--nav-bg) pr-2.5 pl-6
               backdrop-blur-[18px] backdrop-saturate-[180%]
               max-[960px]:grid-cols-[auto_1fr] max-[960px]:pl-5"
        bind:this={bar}
    >
        <nav
            aria-label="Principal"
            class="flex items-center gap-7 text-[0.92rem] font-semibold text-(color:--muted)
                   max-[960px]:hidden"
        >
            {#each sections as { name, href }, i}
                <a {href} data-nav-fade class={sectionLink}>{name}</a>
            {/each}
        </nav>

        <a
            aria-label="NUDO, inicio"
            href="/"
            class="inline-flex items-center gap-2 text-[1.45rem] font-extrabold tracking-[-0.04em] text-(color:--ink) max-[960px]:-order-1"
        >
            <img src={Logo} alt="Logotipo de NUDO" class="h-7 w-auto -translate-y-[3px]" />
        </a>

        <div
            class="flex items-center justify-end gap-4 text-[0.92rem] font-semibold"
        >
            <a
                href={signin.href}
                data-nav-fade
                class="rounded-full px-3.5 py-2 text-(color:--muted)  transition-colors duration-200
                       hover:bg-(--accent-soft) hover:text-(color:--ink) max-[960px]:hidden"
            >
                {signin.name}
            </a>

            <a
                href={cta.href}
                data-nav-fade
                class="inline-flex items-center gap-2 rounded-(--radius-pill) bg-(--cta-bg) px-5.5 py-2.5
                       text-[0.9rem] font-bold tracking-[-0.01em] text-(color:--cta-fg)
                       shadow-(--cta-shadow)
                       transition-[translate,box-shadow,background-color] duration-200
                       hover:-translate-y-0.5 hover:bg-(--cta-bg-hover) hover:shadow-(--cta-shadow-hover)"
            >
                <span>{cta.name}</span>
                <i class="ri-arrow-right-line"></i>
            </a>

            <button
                type="button"
                aria-controls="menu"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onclick={toggleMenu}
                class="hidden size-10 cursor-pointer items-center justify-center rounded-full border-0
                       bg-(--accent-light) text-[1.2rem] text-(color:--ink) transition-colors duration-200
                       hover:bg-(--accent-soft) max-[960px]:inline-flex"
            >
                <i class={menuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
            </button>
        </div>
    </div>

    {#if menuOpen}
        <nav
            id="menu"
            aria-label="Menú móvil"
            transition:slide={{ duration: 200 }}
            class="pointer-events-auto mx-auto mt-2.5 flex max-w-[1140px] flex-col rounded-[20px] border
                   border-(--nav-border) bg-(--nav-bg-strong) p-3.5 backdrop-blur-[18px]
                   shadow-(--nav-shadow)"
        >
            {#each sections as { name, href }}
                <a {href} onclick={closeMenu} class={menuLink}>{name}</a>
            {/each}
            <a href={signin.href} onclick={closeMenu} class={menuLink}>{signin.name}</a>
        </nav>
    {/if}
</header>

<style>
    @media (prefers-reduced-motion: no-preference) {
        .bar {
            opacity: 0;
        }
        @media (min-width: 961px) {
            .bar {
                max-width: 140px;
            }
            [data-nav-fade] {
                opacity: 0;
            }
        }
    }
</style>