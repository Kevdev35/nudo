<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';

	import { reveal } from '@ui/landingComponents/logic/reveal';

    import GeneralImage from '@img/General.png'
    import NotesImage from '@img/Notes.png'
    import MarkdownImage from '@img/Markdown.png'
    import KanbanImage from '@img/Kanban.png'
    import FilesImage from '@img/Files.png'
	import ClientImage from '@img/Clients.png'

	type TabId = 'general' | 'notas' | 'markdown' | 'kanban' | 'archivos' | 'clientes';

	interface Tab {
		id: TabId;
		label: string;
		icon: string;
		title: string;
		text: string;
		bullets: string[];
        src?: string;
        alt?: string;
	}

	const tabs: Tab[] = [
		{
			id: 'general',
			label: 'General',
			icon: 'ri-layout-grid-line',
			title: 'Información y presupuesto',
			text: 'Cada proyecto empieza con su ficha: qué es, para quién y en qué estado va.',
			bullets: [
				'Proyecto propio o de un cliente',
                'Descripción, presupuesto y estado siempre visibles',
                'Ve de un vistazo lo que pasó en tu proyecto'
			],
            src: GeneralImage
		},
		{
			id: 'notas',
			label: 'Notas',
			icon: 'ri-checkbox-line',
			title: 'Notas y captura de ideas',
			text: 'Anota ideas y pendientes antes de que se pierdan, sin salir del proyecto.',
			bullets: ['Bloques de texto y listas con casillas', 'Lo completado se agrupa aparte', 'Edita y elimina en un clic'],
            src: NotesImage
        },
		{
			id: 'markdown',
			label: 'Markdown',
			icon: 'ri-markdown-line',
			title: 'Markdown con historial',
			text: 'Escribe especificaciones y documentación con vista previa en vivo.',
			bullets: [
				'Editor a dos columnas: escribes y ves el resultado',
				'Cada edición guarda la versión anterior',
				'Consulta el historial cuando lo necesites'
			],
            src: MarkdownImage
		},
		{
			id: 'kanban',
			label: 'Kanban',
			icon: 'ri-kanban-view',
			title: 'Tableros Kanban',
			text: 'Sigue el trabajo en columnas y tarjetas, dentro del contexto de cada proyecto.',
			bullets: ['Columnas a tu medida', 'Tarjetas con nombre y descripción', 'Un tablero por proyecto, sin herramientas aparte'],
            src: KanbanImage
		},
		{
			id: 'archivos',
			label: 'Archivos',
			icon: 'ri-folder-3-line',
			title: 'Archivos y diagramas',
			text: 'Guarda lo que necesita el proyecto junto al proyecto, no en una carpeta lejana.',
			bullets: ['PDFs, imágenes, diagramas y prototipos', 'Almacenados en la nube', 'Siempre junto a sus notas y tareas'],
            src: FilesImage
		},
		{
			id: 'clientes',
			label: 'Clientes',
			icon: 'ri-group-line',
			title: 'Gestión de clientes',
			text: 'Los clientes son una entidad aparte, no un campo de texto en cada proyecto.',
			bullets: [
				'Datos de contacto de cada cliente',
				'Asígnalos a un proyecto al crearlo',
				'Separa lo personal del trabajo para terceros'
			],
			src: ClientImage
		}
	];

	// ---- Datos de los mockups ----
	const pendientes = ['Definir alcance con el cliente', 'Preparar propuesta de diseño'];
	const completadas = ['Reunión de arranque'];

	const kanban: { title: string; cards: { tag?: string; lines: string[] }[] }[] = [
		{ title: 'Pendientes', cards: [{ lines: ['w-4/5', 'w-3/5'] }, { lines: ['w-full'] }] },
		{ title: 'En proceso', cards: [{ tag: 'Diseño', lines: ['w-full', 'w-3/5'] }] },
		{ title: 'Listo', cards: [{ lines: ['w-4/5'] }, { lines: ['w-3/5'] }] }
	];

	const files = [
		{ ext: 'PDF', name: 'brief.pdf' },
		{ ext: 'PNG', name: 'moodboard.png' },
		{ ext: 'FIG', name: 'interfaz.fig' },
		{ ext: 'UML', name: 'modelo.uml' }
	];

	const clients = [
		{ initials: 'EA', name: 'Estudio Aurora', email: 'hola@aurora.mx' },
		{ initials: 'MR', name: 'Marco Ríos', email: 'marco@correo.com' },
		{ initials: 'TL', name: 'Taller Lumen', email: 'info@lumen.mx' }
	];

	// ---- Estado y teclado (patrón WAI-ARIA tabs) ----
	let active = $state<TabId>('general');
	const current = $derived(tabs.find((t) => t.id === active)!);
	let buttons: HTMLButtonElement[] = [];

	function onKeydown(e: KeyboardEvent, i: number) {
		const last = tabs.length - 1;
		const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[
			e.key
		];
		if (next === undefined) return;
		e.preventDefault();
		active = tabs[next].id;
		buttons[next].focus();
	}

	// ---- Clases compartidas ----
	const row =
		'flex items-center justify-between gap-3 rounded-[10px] border border-(--pane-border) bg-(--pane-bg) px-3 py-[11px] text-[.82rem]';
	const label = 'text-[.66rem] font-bold tracking-[.06em] text-(color:--subtle) uppercase';
	const check =
		'flex items-center gap-2.5 rounded-[10px] border border-(--pane-border) bg-(--pane-inset) px-3 py-2.5 text-[.82rem]';
	const box = 'grid size-[15px] flex-none place-items-center rounded-[5px] border-[1.5px] border-accent';
	const avatar =
		'grid size-[22px] place-items-center rounded-full bg-linear-to-br from-[#a855f7] to-[#6366f1] text-[.65rem] font-extrabold text-white';
	const pane = 'rounded-[10px] border border-(--pane-border) bg-(--pane-bg) p-3 text-[.76rem] leading-[1.8]';
</script>

<section id="funciones" class="mx-auto max-w-[1140px] px-8 pt-5 pb-25 max-[960px]:px-[22px] max-[960px]:pb-18">
	<SectionHeader
		eyebrow="Funciones"
		title="Todo tu proyecto, en pestañas."
		sub="Cada proyecto tiene las mismas secciones, sin cambiar de página. Elige una para ver cómo funciona."
	/>

	<div use:reveal={{ variant: 'scale' }}>
		<div
			role="tablist"
			aria-label="Secciones de un proyecto"
			class="mt-11 flex gap-2 overflow-x-auto px-0.5 pt-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each tabs as t, i (t.id)}
				{@const on = active === t.id}
				<button
					bind:this={buttons[i]}
					type="button"
					role="tab"
					id="tab-{t.id}"
					aria-controls="tp"
					aria-selected={on}
					tabindex={on ? 0 : -1}
					onclick={() => (active = t.id)}
					onkeydown={(e) => onKeydown(e, i)}
					class={[
						'inline-flex flex-none cursor-pointer items-center gap-2 rounded-full border px-[18px] py-[11px] text-[.92rem] font-semibold transition-all duration-200',
						on
							? 'border-(--cta-bg) bg-(--cta-bg) text-(color:--cta-fg) shadow-(--cta-shadow)'
							: 'border-(--accent-border) bg-(--ghost-btn-bg) text-(color:--muted) hover:border-accent hover:text-(color:--ink)'
					]}
				>
					<i class="{t.icon} text-[17px]"></i>
					{t.label}
				</button>
			{/each}
		</div>

		<div
			class="mt-3.5 rounded-3xl border border-accent-border p-11
			       bg-(image:--panel-gradient)
			       max-[960px]:px-[18px] max-[960px]:py-[26px]"
		>
			{#key active}
				<div
					id="tp"
					role="tabpanel"
					aria-labelledby="tab-{active}"
					class="grid grid-cols-[.9fr_1.1fr] items-center gap-12 motion-safe:animate-panel-in max-[960px]:grid-cols-1 max-[960px]:gap-7"
				>
					<div>
						<h3 class="text-[1.7rem] leading-[1.15] font-extrabold tracking-[-0.03em]">{current.title}</h3>
						<p class="mt-3 text-muted">{current.text}</p>
						<ul class="mt-[22px] grid gap-3">
							{#each current.bullets as b}
								<li
									class="relative pl-7 text-[.95rem] text-ink-soft before:absolute before:top-px before:left-0 before:grid
									       before:size-[18px] before:place-items-center before:rounded-full before:bg-accent
									       before:text-[.68rem] before:font-extrabold before:text-(color:--accent-fg) before:content-['✓']"
								>
									{b}
								</li>
							{/each}
						</ul>
					</div>

					<div class="overflow-hidden rounded-[18px] border border-(--accent-border) bg-(--card-bg) shadow-[0_28px_60px_-18px_rgba(88,28,135,.3)]">
                        <img
                            src={current.src}
                            alt={current.alt}
                            width="1440"
                            height="900"
                            loading="lazy"
                            decoding="async"
                            class="block h-auto w-full"
                        />
                    </div>
				</div>
			{/key}
		</div>
	</div>
</section>