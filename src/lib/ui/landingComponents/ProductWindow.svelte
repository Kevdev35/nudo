<script lang="ts">
	type TabId = 'general' | 'notas' | 'markdown' | 'kanban' | 'archivos';

	interface Tab { id: TabId; label: string; icon: string }
	interface Note { text: string; tag: string; done: boolean }
	interface KCard { title: string; tag: string; tagClass: string }
	interface Column { title: string; cards: KCard[] }
	interface FileItem { ext: string; name: string; meta: string; tone: string }
	interface Activity { text: string; kind: string; when: string; icon: string; iconTone: string; statusTone: string; dim?: boolean }

	const tabs: Tab[] = [
		{ id: 'general', label: 'General', icon: 'ri-home-4-line' },
		{ id: 'notas', label: 'Notas', icon: 'ri-sticky-note-line' },
		{ id: 'markdown', label: 'Markdown', icon: 'ri-markdown-line' },
		{ id: 'kanban', label: 'Kanban', icon: 'ri-kanban-view' },
		{ id: 'archivos', label: 'Archivos', icon: 'ri-attachment-2' }
	];

	let active = $state<TabId>('general');

	let notes = $state<Note[]>([
		{ text: 'arreglar el fallo de las cardas, se cierran solas cuando le das clic rápido', tag: 'Bug', done: true },
		{ text: 'agregar pins a las notas para mostrar prioridad en el dashboard', tag: 'Mejora', done: true },
		{ text: 'Sincronización en tiempo real de tableros Kanban con base PostgreSQL', tag: 'Dev', done: true },
		{ text: 'Preparar release notes de la versión beta v2.4', tag: 'Release', done: false }
	]);

	const columns: Column[] = [
		{
			title: 'Backlog',
			cards: [
				{ title: 'Integrar webhook de facturas', tag: 'Backend', tagClass: 'bg-indigo-900 text-indigo-300' },
				{ title: 'Gantt preview', tag: 'Roadmap', tagClass: 'bg-purple-900 text-purple-300' }
			]
		},
		{ title: 'En curso', cards: [{ title: 'Editor de notas con Markdown', tag: 'En proceso', tagClass: 'bg-emerald-800 text-emerald-300' }] },
		{
			title: 'Listo',
			cards: [
				{ title: 'Diseño UI Dark Surface', tag: 'Completado', tagClass: 'bg-green-900 text-green-300' },
				{ title: 'Relación cliente/proyecto', tag: 'Completado', tagClass: 'bg-green-900 text-green-300' }
			]
		}
	];

	const files: FileItem[] = [
		{ ext: 'MD', name: 'arquitectura-nudo.md', meta: '14.2 KB • Hace 2 horas', tone: 'bg-violet-600/20 text-violet-300' },
		{ ext: 'PDF', name: 'presupuesto-v1.pdf', meta: '185.0 KB • Hace 3 días', tone: 'bg-blue-400/20 text-blue-400' },
		{ ext: 'FIG', name: 'nudo-wireframes.fig', meta: '4.8 MB • Hace 5 días', tone: 'bg-pink-400/20 text-pink-400' },
		{ ext: 'PNG', name: 'flowchart-context.png', meta: '720 KB • Hace 1 semana', tone: 'bg-emerald-400/20 text-emerald-400' }
	];

	const activity: Activity[] = [
		{
			text: 'arreglar el fallo de las cardas, se cierran solas cuando le...',
			kind: 'Nota',
			when: 'hace 1d',
			icon: 'ri-file-text-line',
			iconTone: 'bg-yellow-500/10 text-yellow-500',
			statusTone: 'bg-green-500/10 text-green-500'
		},
		{
			text: 'agregar pins a las notas para mostrar prioridad en los mismos',
			kind: 'Tarea en Kanban',
			when: 'hace 2d',
			icon: 'ri-pushpin-2-line',
			iconTone: 'bg-purple-500/10 text-purple-500',
			statusTone: 'bg-sky-400/10 text-sky-400',
			dim: true
		}
	];

	const mdLines = [
		{ cls: 'text-[.85rem] font-bold text-purple-400', text: '# Arquitectura de Contexto Unificado' },
		{ cls: 'border-l-2 border-accent pl-2 text-slate-400', text: '> Especificaciones de estado reactivo y vinculación de clientes' },
		{ cls: 'text-slate-300', text: '- Base relacional optimizada para consultas en menos de 15ms.' },
		{ cls: 'text-slate-300', text: '- Cada documento tiene historial incremental inmutable.' },
		{ cls: 'w-fit rounded bg-[#201e26] px-1.5 py-0.5 text-sky-400', text: "const nudoWorkspace = await initContext({ projectId: 'nudo-core' });" },
		{ cls: 'text-slate-300', text: '- Integración directa con storage S3 y exportación instantánea en PDF.' }
	];

	// Las métricas salen de los datos: al marcar una nota, el General se actualiza
	const doneCount = $derived(notes.filter((n) => n.done).length);
	const metrics = $derived([
		{ label: 'Notas', value: notes.length, sub: `${doneCount} completadas`, icon: 'ri-file-text-line' },
		{ label: 'Tareas', value: 0, sub: '0 completadas', icon: 'ri-checkbox-circle-line' },
		{ label: 'Documentos', value: 1, sub: 'markdown', icon: 'ri-book-2-line' },
		{ label: 'Archivos', value: files.length, sub: 'adjuntos', icon: 'ri-attachment-2' }
	]);

	const card = 'rounded-[10px] border border-white/5 bg-[#17161b]';
	const viewTitle = 'text-[.95rem] font-extrabold tracking-[-0.01em] text-white';
</script>

<div
	data-tilt
	class="relative flex min-h-[485px] w-full flex-col gap-3.5 overflow-hidden rounded-[18px] border border-white/8 bg-[#121114]
	       px-5 pt-4 pb-5 text-[#f3f3f5] will-change-transform select-text
	       shadow-[0_32px_70px_-16px_rgba(15,8,28,.75),inset_0_0_0_1px_rgba(255,255,255,.05)]
	       [transform-style:preserve-3d] [transform:perspective(1000px)_rotateX(2.5deg)_rotateY(-3.5deg)]
	       motion-reduce:transform-none"
>
	<!-- Barra superior -->
	<div class="flex items-center justify-between gap-3 pb-1">
		<button type="button" class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[.8rem] font-semibold text-[#e4e2e8] transition-colors hover:bg-white/6">
			<i class="ri-arrow-left-s-line text-sm"></i>
			Mis proyectos
		</button>
		<label class="flex max-w-80 flex-1 items-center gap-2 rounded-full border border-white/6 bg-[#1b191e] px-3.5 py-1.25 text-[.73rem]">
			<i class="ri-search-line text-[13px] text-[#6e6a78]"></i>
			<input
				type="text"
				placeholder="Buscar notas, markdowns, archivos..."
				class="w-full bg-transparent text-[.73rem] text-[#e4e2e8] outline-none placeholder:text-[#6e6a78]"
			/>
		</label>
		<button type="button" class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[.78rem] font-medium text-[#a9a4b2] transition-colors hover:bg-white/6 hover:text-white">
			<i class="ri-settings-3-line text-sm"></i>
			Configuración
		</button>
	</div>

	<!-- Encabezado del proyecto -->
	<div class="flex items-start justify-between gap-4 pt-1">
		<div>
			<div class="flex items-center gap-2.5">
				<span class="text-[1.35rem] font-extrabold tracking-[-0.02em] text-white">NUDO</span>
				<span class="inline-flex items-center gap-[5px] text-[.7rem] font-semibold text-green-500 before:size-1.5 before:rounded-full before:bg-green-500 before:content-['']">Activo</span>
			</div>
			<p class="mt-0.5 text-[.76rem] text-[#8e8998]">Desarrollo de NUDO y su ecosistema</p>
		</div>
		<div class="flex items-start gap-5 rounded-lg border border-white/4 bg-white/2 px-3 py-1.5 text-left">
			<div class="flex flex-col">
				<span class="text-[.62rem] font-medium text-[#767180]">Creado</span>
				<span class="font-mono text-[.65rem] font-semibold text-[#e4e2e8]">15 sep 2026</span>
			</div>
			<div class="flex flex-col">
				<span class="text-[.62rem] font-medium text-[#767180]">Cliente</span>
				<span class="text-[.68rem] font-semibold text-[#e4e2e8]">Proyecto propio</span>
			</div>
		</div>
	</div>

	<!-- Pestañas -->
	<div role="tablist" class="mt-1 flex items-center gap-2 overflow-x-auto border-b border-white/6 pb-2.5">
		{#each tabs as t}
			<button
				type="button"
				role="tab"
				aria-selected={active === t.id}
				onclick={() => (active = t.id)}
				class={[
					'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[.76rem] font-semibold whitespace-nowrap transition-all duration-150',
					active === t.id
						? 'border-purple-500/40 bg-[#25222b] text-white ring-1 ring-purple-500/25'
						: 'border-white/5 bg-[#1b191e] text-[#9c97a6] hover:bg-[#242229] hover:text-white'
				]}
			>
				<i class="{t.icon} text-[13px]"></i>
				{t.label}
			</button>
		{/each}
	</div>

	<!-- Vistas -->
	{#key active}
		<div role="tabpanel" class="flex flex-1 flex-col gap-3.5 motion-safe:animate-view-in">
			{#if active === 'general'}
				<h3 class="text-[1.05rem] font-extrabold tracking-[-0.01em] text-white">Resumen de nudo</h3>

				<div class="grid grid-cols-4 gap-2.5">
					{#each metrics as m}
						<div class="flex flex-col gap-1 rounded-xl border border-white/5 bg-[#17161b] px-3.5 py-3 shadow-[0_4px_14px_rgba(0,0,0,.2)]">
							<i class="{m.icon} text-[15px] text-[#8e8998]"></i>
							<span class="mt-0.5 text-[.68rem] font-medium text-[#8e8998]">{m.label}</span>
							<span class="text-[1.3rem] leading-[1.1] font-extrabold text-white">{m.value}</span>
							<span class="text-[.62rem] text-[#64606e]">{m.sub}</span>
						</div>
					{/each}
				</div>

				<div class="mt-0.5 flex flex-col gap-2">
					<span class="text-[.72rem] font-bold text-[#9a95a4]">Actividad reciente</span>
					{#each activity as a}
						<div class="{card} flex items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-[#1e1d23] {a.dim ? 'opacity-85' : ''}">
							<div class="flex items-center gap-2.5 overflow-hidden">
								<span class="grid size-6 shrink-0 place-items-center rounded-md text-[13px] {a.iconTone}"><i class={a.icon}></i></span>
								<div class="flex flex-col overflow-hidden">
									<span class="truncate text-[.73rem] font-semibold text-[#e2dfeb]">{a.text}</span>
									<span class="text-[.62rem] text-[#6b6676]">{a.kind}</span>
								</div>
							</div>
							<span class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-[3px] text-[.65rem] font-semibold {a.statusTone}">
								<i class="ri-check-line text-[11px]"></i>{a.when}
							</span>
						</div>
					{/each}
				</div>
			{:else if active === 'notas'}
				<div class="flex items-center justify-between">
					<h3 class={viewTitle}>Notas del proyecto</h3>
					<span class="rounded-full bg-purple-500/12 px-2 py-0.5 text-[.65rem] font-semibold text-purple-500">Interactiva — Clic para marcar</span>
				</div>
				<div class="flex flex-col gap-2">
					{#each notes as n}
						<button
							type="button"
							role="checkbox"
							aria-checked={n.done}
							onclick={() => (n.done = !n.done)}
							class="{card} flex cursor-pointer items-center gap-2.5 border-white/6 px-3.5 py-2.5 text-left transition-all duration-150 hover:border-purple-500/30 hover:bg-[#1e1c22]"
						>
							<span class={['grid size-4 shrink-0 place-items-center rounded border-[1.5px] border-accent text-[10px] text-(color:--accent-fg) transition-all duration-150', n.done && 'bg-accent']}>
								{#if n.done}<i class="ri-check-line"></i>{/if}
							</span>
							<span class={['flex-1 text-[.78rem] font-medium', n.done ? 'text-[#6c6778] line-through' : 'text-[#dedbe6]']}>{n.text}</span>
							<span class="rounded bg-accent/18 px-[7px] py-0.5 text-[.62rem] font-semibold text-violet-300">{n.tag}</span>
						</button>
					{/each}
				</div>
			{:else if active === 'markdown'}
				<div class="flex items-center justify-between">
					<h3 class={viewTitle}>Documento: arquitectura-nudo.md</h3>
					<span class="font-mono text-[.62rem] text-emerald-400">● Guardado en la nube</span>
				</div>
				<div class="{card} flex flex-col gap-2 border-white/6 p-3.5 font-mono text-[.72rem] leading-[1.55]">
					{#each mdLines as l}
						<div class={l.cls}>{l.text}</div>
					{/each}
				</div>
			{:else if active === 'kanban'}
				<h3 class={viewTitle}>Tablero de entregables</h3>
				<div class="grid grid-cols-3 gap-2.5">
					{#each columns as col}
						<div class="flex flex-col gap-2 rounded-[10px] border border-white/4 bg-[#16151a] p-2.5">
							<div class="flex justify-between text-[.68rem] font-bold text-gray-400">
								<span>{col.title}</span><span>{col.cards.length}</span>
							</div>
							{#each col.cards as c}
								<div class="flex flex-col gap-1.5 rounded-lg border border-white/6 bg-[#1e1d23] px-2.5 py-2 text-[.72rem] text-[#f1f0f4]">
									<span>{c.title}</span>
									<span class="w-fit rounded px-[5px] py-0.5 text-[.58rem] font-bold {c.tagClass}">{c.tag}</span>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{:else if active === 'archivos'}
				<h3 class={viewTitle}>Archivos y assets</h3>
				<div class="grid grid-cols-2 gap-2.5">
					{#each files as f}
						<div class="{card} flex items-center gap-2.5 border-white/6 px-3 py-2.5">
							<span class="grid size-7 place-items-center rounded-md text-[.65rem] font-extrabold {f.tone}">{f.ext}</span>
							<div class="flex flex-col">
								<span class="text-[.73rem] font-semibold text-[#e4e2e8]">{f.name}</span>
								<span class="text-[.62rem] text-[#767180]">{f.meta}</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/key}
</div>