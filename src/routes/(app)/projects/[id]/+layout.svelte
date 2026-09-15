<script lang="ts">
    import "../../../layout.css"
    import type { LayoutData } from './$types';
    import { goto, afterNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    let { data, children }: { data: LayoutData; children: any } = $props();

    let query = $state('');
    let results = $state<any[]>([]);
    let open = $state(false);
    let timer: ReturnType<typeof setTimeout>;

    function onInput() {
        clearTimeout(timer);
        if (query.trim().length < 2) {
            results = [];
            open = false;
            return;
        }
        timer = setTimeout(async () => {
            const res = await fetch(`/projects/${data.project.id}/search?q=${encodeURIComponent(query)}`);
            const json = await res.json();
            results = json.results ?? [];
            open = results.length > 0;
        }, 250);
    }

    function close() {
        open = false;
    }

    function select(href: string, id: string) {
        query = '';
        open = false;
        goto(href + '?highlight=' + id);
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') close();
    }

    function applyHighlight() {
        const id = $page.url.searchParams.get('highlight');
        if (!id) return;
        requestAnimationFrame(() => {
            const el = document.querySelector(`[data-highlight-id="${id}"]`);
            if (el) {
                el.setAttribute('data-highlight', '');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => el.removeAttribute('data-highlight'), 3500);
            }
            const url = new URL($page.url);
            url.searchParams.delete('highlight');
            history.replaceState(history.state, '', url.pathname + url.search);
        });
    }

    afterNavigate(() => applyHighlight());

    const typeIcon: Record<string, string> = {
        nota: 'ri-file-text-line',
        tarea: 'ri-checkbox-circle-line',
        doc: 'ri-booklet-line',
        archivo: 'ri-attachment-2',
    };
</script>

<svelte:head>
	<title>{data.project.name} — Nudo</title>
</svelte:head>

<section>
    <header>
        <div class="flex justify-between gap-5 px-6 py-10 h-4 items-center">
            <div class="flex gap-7 items-center">
                <a href="/dashboard" class="font-bold text-xl">
                    <i class="ri-arrow-left-s-line"></i>
                    Mis proyectos
                </a>
            </div>

            <div class="relative">
                <input
                    type="search"
                    placeholder="Buscar notas, markdowns, archivos, etc..."
                    bind:value={query}
                    oninput={onInput}
                    onfocus={() => { if (results.length > 0) open = true; }}
                    onblur={() => setTimeout(close, 200)}
                    onkeydown={onKeydown}
                    class="rounded-full border px-4 py-2 text-sm w-80"
                />
                {#if open && results.length > 0}
                    <div class="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-[var(--border-default)] overflow-hidden z-50">
                        {#each results as r}
                            <button
                                onmousedown={() => select(r.href, r.id)}
                                class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
                            >
                                <i class="{typeIcon[r.type]} text-lg opacity-50"></i>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold truncate">{r.title}</p>
                                    {#if r.excerpt}
                                        <p class="text-xs opacity-50 truncate">{r.excerpt}</p>
                                    {/if}
                                </div>
                                <span class="text-xs opacity-30 shrink-0">{r.type}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <div>
                <a href="http://" class="text-xl">
                    <i class="ri-settings-line"></i>
                    Configuracion
                </a>
            </div>
        </div>

        <div class="grid grid-cols-3 px-5 gap-3">
            <div class="flex items-center text-left justify-start uppercase">
                <h1 class="text-7xl font-bold">{data.project.name}</h1>
            </div>
            <div>
                <h2 class="text-2xl font-bold">Detalles: </h2>
                <div>
                    <p class="text-lg font-semibold">Descripcion: </p>
                    <p>{data.project.description}</p>
                </div>
                <p><span class="text-lg font-semibold">Estado: </span> {data.project.status}</p>
                {#if data.project.budget}
                    <p><span class="text-lg font-semibold">Presupuesto: </span> ${data.project.budget}</p>
                {/if}
            </div>

            <div>
                <h2 class="text-2xl font-bold">Más detalles: </h2>
                <div>
                    <p class="text-lg font-semibold">Fecha de creación: </p>
                    <p>{data.project.createdAt}</p>
                </div>
                {#if data.client?.name}
                    <p><span class="text-lg font-semibold">Cliente: </span> {data.client?.name ?? 'Proyecto propio'}</p>
                {:else}
                    <p><span class="text-lg font-semibold">Cliente: </span>Proyecto propio</p>
                {/if}
            </div>
        </div>

    </header>

</section>

<nav class="sticky top-0 z-10 bg-white border-b-[.5px] rounded-b-3xl shadow-md border-[#e6e6e6] flex gap-8 py-6 px-10">
    <a href="/projects/{data.project.id}">General</a>
    <a href="/projects/{data.project.id}/notes">Notas</a>
    <a href="/projects/{data.project.id}/markdown">Markdown</a>
    <a href="/projects/{data.project.id}/kanban">Kanban</a>
    <a href="/projects/{data.project.id}/files">Archivos</a>
</nav>
<main class="mt-5">
    {@render children()}
</main>
