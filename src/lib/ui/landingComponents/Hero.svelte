<script lang="ts">
	import ProductWindow from './ProductWindow.svelte';
	import { orbit } from '@ui/landingComponents/logic/hero-orbit';
	import { tilt } from '@ui/landingComponents/logic/tilt';

	type OrbiterKind = 'txt' | 'fig' | 'uml' | 'note' | 'md' | 'pdf' | 'kanban' | 'client';

	interface Orbiter {
		kind: OrbiterKind;
		title: string;
		ring: 0 | 1; // 0 = anillo grande, 1 = anillo chico
		icon?: string;
		tag?: string;
	}

	const orbiters: Orbiter[] = [
		{ kind: 'txt', title: '.txt', ring: 0, icon: 'T' },
		{ kind: 'fig', title: '.fig', ring: 0, tag: 'UI' },
		{ kind: 'uml', title: '.uml', ring: 0, icon: '❖' },
		{ kind: 'note', title: 'note', ring: 0, icon: '✎' },
		{ kind: 'md', title: '.md', ring: 0, icon: '↓' },
		{ kind: 'pdf', title: '.pdf', ring: 1, tag: 'archivo' },
		{ kind: 'kanban', title: 'kanban', ring: 1, icon: '☷' },
		{ kind: 'client', title: 'cliente', ring: 1 }
	];

	// Entrada escalonada del copy
	const delay = (i: number) => `${0.04 + i * 0.08}s`;
</script>

{#snippet bar(w: string = 'w-full')}
	<span class="mt-[5px] block h-[5px] rounded-[3px] bg-(--bar) {w}"></span>
{/snippet}

<section
	id="hero"
	use:orbit
	class="relative flex min-h-screen items-center overflow-hidden bg-(image:--bg-gradient)
	       after:pointer-events-none after:absolute after:inset-0 after:z-1 after:bg-noise
	       after:opacity-(--noise-opacity) after:mix-blend-multiply after:content-['']
	       dark:after:mix-blend-screen"
>
	<!-- Patrón de puntos -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 z-0
		       bg-[radial-gradient(var(--dot)_1px,transparent_1px)] bg-size-[32px_32px]
		       mask-[radial-gradient(ellipse_at_65%_50%,black_20%,transparent_75%)]"
	></div>

	<!-- Capa orbital -->
	<div aria-hidden="true" class="pointer-events-none absolute inset-0 z-2">
		<div
			data-blob
			class="pointer-events-none absolute rounded-full opacity-85 blur-[50px]
			       bg-[radial-gradient(circle,var(--blob-glow)_0%,var(--blob-fade)_70%,transparent_100%)]"
		></div>
		<svg data-rings class="absolute inset-0 size-full"></svg>

		{#each orbiters as o}
			<div
				data-orbiter
				data-ring={o.ring}
				class="absolute top-0 left-0 w-[124px] select-none rounded-[14px] border border-(--card-border)
				       bg-(--card-bg-soft) px-[13px] py-[11px] text-[.75rem] opacity-0 backdrop-blur-[10px]
				       shadow-(--orbiter-shadow)
				       will-change-[transform,filter,opacity]
				       max-[960px]:w-[95px] max-[960px]:px-2.5 max-[960px]:py-2"
			>
				<div class="mb-1.5 flex items-center justify-between">
					{#if o.kind === 'client'}
						<div class="flex items-center gap-1.5">
							<span class="grid size-[22px] place-items-center rounded-full bg-linear-to-br from-[#a855f7] to-[#6366f1] text-[.65rem] font-extrabold text-white">CL</span>
							<b class="font-mono text-[.85rem] font-bold text-ink max-[960px]:text-[.75rem]">{o.title}</b>
						</div>
					{:else}
						<b class="block font-mono text-[.85rem] font-bold text-ink max-[960px]:text-[.75rem]">{o.title}</b>
						{#if o.tag}
							<span class="inline-block rounded-full bg-accent px-[7px] py-0.5 text-[.62rem] font-bold text-(color:--accent-fg)">{o.tag}</span>
						{:else}
							<span class="grid size-[18px] place-items-center rounded-[5px] bg-(--accent-light) text-[.65rem] text-accent">{o.icon}</span>
						{/if}
					{/if}
				</div>

				{#if o.kind === 'txt'}
					{@render bar()}{@render bar()}{@render bar('w-[65%]')}
				{:else if o.kind === 'fig'}
					<div class="mt-1 flex items-center gap-1.5">
						<span class="block size-[18px] rounded-full bg-(--accent)"></span>
						<span class="block size-[18px] rounded-[4px] bg-ink"></span>
					</div>
				{:else if o.kind === 'uml'}
					<div class="mt-1 flex items-center gap-1">
						<span class="block h-[18px] w-[26px] rounded-[4px] border-[1.5px] border-ink"></span>
						<span class="block h-[1.5px] w-2.5 bg-accent"></span>
						<span class="block h-[18px] w-[26px] rounded-[4px] border-[1.5px] border-ink"></span>
					</div>
				{:else if o.kind === 'note'}
					<div class="mt-0.5 flex items-center gap-[7px]">
						<span class="grid size-[13px] place-items-center rounded-[4px] border-[1.5px] border-accent bg-(--card-bg) after:size-[5px] after:rounded-[1px] after:bg-accent after:content-['']"></span>
						<span class="h-[5px] flex-1 rounded-[3px] bg-(--bar)"></span>
					</div>
					{@render bar()}
				{:else if o.kind === 'md'}
					{@render bar('w-[55%]')}{@render bar()}{@render bar('w-[65%]')}
				{:else if o.kind === 'pdf'}
					{@render bar()}
				{:else if o.kind === 'kanban'}
					<div class="mt-1 grid grid-cols-3 gap-1">
						{#each ['h-[26px]', 'h-[18px]', 'h-[26px]'] as h}
							<span class="block rounded-[4px] border border-(--accent-border) bg-(--accent-light) {h}"></span>
						{/each}
					</div>
				{:else if o.kind === 'client'}
					{@render bar('w-[65%]')}
				{/if}
			</div>
		{/each}
	</div>

	<!-- Contenido -->
	<div
		class="relative z-3 mx-auto grid min-h-screen w-full max-w-[1180px] grid-cols-[1.05fr_1fr] items-center gap-12
		       px-8 pt-[calc(var(--nav-h)+36px)] pb-[90px]
		       max-[960px]:grid-cols-1 max-[960px]:gap-[50px] max-[960px]:pt-[calc(var(--nav-h)+24px)]
		       max-[960px]:pb-18 max-[960px]:text-center"
	>
		<div data-copy class="max-w-[540px] max-[960px]:mx-auto max-[960px]:max-w-full">
			<div
				style:animation-delay={delay(0)}
				class="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-border bg-(--card-bg-soft) px-3.5 py-1.5
				       text-[.82rem] font-bold text-accent shadow-[0_2px_8px_rgba(124,58,237,.08)] motion-safe:animate-reveal"
			>
				<i class="ri-sparkling-2-line text-sm"></i>
				<span>Tu proyecto es más que una lista de tareas</span>
			</div>

			<h1
				style:animation-delay={delay(1)}
				class="text-[clamp(2.8rem,5.5vw,4.2rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-ink motion-safe:animate-reveal"
			>
				Concentra todo en un
				<span class="relative inline-block bg-linear-to-br from-(--accent) from-10% to-(--accent-hover) to-90% bg-clip-text text-transparent">
					NUDO.
					<svg
						aria-hidden="true"
						class="pointer-events-none absolute inset-x-0 -bottom-1.5 h-2.5 w-full"
						fill="none"
						preserveAspectRatio="none"
						viewBox="0 0 240 16"
					>
						<path d="M2 12C70 4 170 4 238 10" stroke="var(--accent)" stroke-linecap="round" stroke-width="4.5" />
					</svg>
				</span>
			</h1>

			<p
				style:animation-delay={delay(2)}
				class="mt-6 mb-[34px] text-[1.08rem] leading-[1.6] font-[450] text-muted max-[960px]:mx-auto motion-safe:animate-reveal"
			>
				Un proyecto. Un contexto. Nudo mantiene tus ideas, documentación, archivos, tareas y la relación con tus
				clientes interconectados en un solo lugar.
			</p>

			<div
				style:animation-delay={delay(3)}
				class="flex flex-wrap items-center gap-5 max-[960px]:justify-center motion-safe:animate-reveal"
			>
				<a
					href="/register"
					class="group inline-flex items-center gap-2.5 rounded-full bg-(--cta-bg) px-6.5 py-3.5 text-[.98rem] font-bold text-(color:--cta-fg)
					       shadow-(--cta-shadow) transition-all duration-250
					       hover:-translate-y-0.5 hover:bg-(--cta-bg-hover) hover:shadow-(--cta-shadow-hover)"
				>
					<span>Prueba Nudo</span>
					<i class="ri-arrow-right-line text-[17px] transition-transform duration-200 group-hover:translate-x-1"></i>
				</a>
				<a
					href="#funciones"
					class="inline-flex items-center gap-1.5 rounded-full border border-(--card-border) bg-(--ghost-bg) px-4.5 py-3
					       text-[.95rem] font-bold text-ink-soft transition-all duration-200
					       hover:-translate-y-px hover:border-accent hover:bg-(--ghost-bg-hover) hover:text-accent
					       hover:shadow-(--ghost-shadow-hover)"
				>
					<span>Ver cómo funciona</span>
					<i class="ri-play-circle-line text-[15px]"></i>
				</a>
			</div>

			<div
				style:animation-delay={delay(4)}
				class="mt-8 inline-flex items-center gap-[9px] rounded-full border border-accent-border bg-(--card-bg-soft) px-3.5 py-1.5
				       text-[.82rem] font-semibold text-muted backdrop-blur-sm motion-safe:animate-reveal"
			>
				<span
					class="relative size-2 rounded-full bg-[#10b981] before:absolute before:-inset-[3px] before:rounded-full
					       before:bg-[rgba(16,185,129,.35)] before:content-[''] motion-safe:before:animate-pulse-ring"
				></span>
				<span>Beta abierta — Acceso inmediato sin lista de espera</span>
			</div>
		</div>

		<div
			data-scene
			use:tilt
			class="relative grid w-full max-w-[620px] place-items-center justify-self-center [perspective:1200px] max-[960px]:max-w-[440px]"
		>
			<ProductWindow />
		</div>
	</div>
</section>