<script lang="ts">
    import "../../../layout.css"
    import type { LayoutData } from './$types';
    import { goto, afterNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount, tick } from 'svelte';
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

    afterNavigate(() => {
        applyHighlight();
        updateIndicator();
    });

    const typeIcon: Record<string, string> = {
        nota: 'ri-file-text-line',
        tarea: 'ri-checkbox-circle-line',
        doc: 'ri-booklet-line',
        archivo: 'ri-attachment-2',
    };

    const statusStyles: Record<string, { pill: string; dot: string }> = {
        pendiente: { pill: 'status-pendiente', dot: 'dot-pendiente' },
        'en progreso': { pill: 'status-progreso', dot: 'dot-progreso' },
        completado: { pill: 'status-completado', dot: 'dot-completado' },
    };

    const tabs = $derived([
        { href: `/projects/${data.project.id}`, label: 'General', icon: 'ri-home-4-line' },
        { href: `/projects/${data.project.id}/notes`, label: 'Notas', icon: 'ri-file-text-line' },
        { href: `/projects/${data.project.id}/markdown`, label: 'Markdown', icon: 'ri-booklet-line' },
        { href: `/projects/${data.project.id}/kanban`, label: 'Kanban', icon: 'ri-kanban-view' },
        { href: `/projects/${data.project.id}/files`, label: 'Archivos', icon: 'ri-attachment-2' },
    ]);

    function isActive(href: string) {
        // Coincidencia exacta para "General" (evita que quede activo en subrutas ajenas),
        // y por prefijo para el resto de secciones.
        if (href === `/projects/${data.project.id}`) return $page.url.pathname === href;
        return $page.url.pathname.startsWith(href);
    }

    // --- Indicador deslizante del nav segmentado ---
    let tabRefs: Record<string, HTMLAnchorElement> = {};
    let indicatorStyle = $state('width:0px; transform:translateX(0px); transition:none;');

    async function updateIndicator() {
        await tick();
        const active = tabs.find((t) => isActive(t.href));
        const el = active ? tabRefs[active.href] : null;
        if (!el) return;
        indicatorStyle = `width:${el.offsetWidth}px; transform:translateX(${el.offsetLeft - 4}px);`;
    }

    onMount(() => {
        updateIndicator();
        const onResize = () => updateIndicator();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
</script>

<svelte:head>
	<title>{data.project.name} — Nudo</title>
</svelte:head>

<section>
    <header>
        <div class="topbar">
            <a href="/dashboard" class="back-link">
                <i class="ri-arrow-left-s-line" aria-hidden="true"></i>
                Mis proyectos
            </a>

            <div class="search-wrap">
                <div class="search-field">
                    <i class="ri-search-line" aria-hidden="true"></i>
                    <input
                        type="search"
                        role="combobox"
                        aria-expanded={open}
                        aria-controls="search-results"
                        aria-autocomplete="list"
                        aria-label="Buscar notas, markdowns, archivos y más en este proyecto"
                        placeholder="Buscar notas, markdowns, archivos..."
                        bind:value={query}
                        oninput={onInput}
                        onfocus={() => { if (results.length > 0) open = true; }}
                        onblur={() => setTimeout(close, 200)}
                        onkeydown={onKeydown}
                    />
                </div>
                {#if open && results.length > 0}
                    <div class="search-results" id="search-results" role="listbox">
                        {#each results as r}
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                onmousedown={() => select(r.href, r.id)}
                                class="search-result"
                            >
                                <i class="{typeIcon[r.type]}" aria-hidden="true"></i>
                                <div class="result-text">
                                    <p class="r-title">{r.title}</p>
                                    {#if r.excerpt}
                                        <p class="r-excerpt">{r.excerpt}</p>
                                    {/if}
                                </div>
                                <span class="r-type">{r.type}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <a href="http://" class="settings-link">
                <i class="ri-settings-3-line" aria-hidden="true"></i>
                Configuración
            </a>
        </div>

        <div class="hero">
            <div class="hero-left">
                <div class="title-row">
                    <h1>{data.project.name}</h1>
                    {#if data.project.status}
                        {@const s = statusStyles[data.project.status] ?? { pill: 'status-pendiente', dot: 'dot-pendiente' }}
                        <span class="pill {s.pill}">
                            <span class="pill-dot {s.dot}"></span>
                            {data.project.status}
                        </span>
                    {/if}
                </div>
                {#if data.project.description}
                    <p class="meta-line">{data.project.description}</p>
                {/if}
            </div>

            <div class="info-bar" role="list" aria-label="Detalles del proyecto">
                {#if data.project.budget}
                    <div class="info-item" role="listitem">
                        <span class="label">Presupuesto</span>
                        <span class="value">${data.project.budget}</span>
                    </div>
                    <span class="divider" aria-hidden="true"></span>
                {/if}
                <div class="info-item" role="listitem">
                    <span class="label">Creado</span>
                    <span class="value">{data.project.createdAt}</span>
                </div>
                <span class="divider" aria-hidden="true"></span>
                <div class="info-item" role="listitem">
                    <span class="label">Cliente</span>
                    <span class="value" class:muted={!data.client?.name}>
                        {data.client?.name ?? 'Proyecto propio'}
                    </span>
                </div>
            </div>
        </div>
    </header>
</section>

<nav class="tabs-wrap" aria-label="Secciones del proyecto">
    <div class="tabs">
        <div class="tab-indicator" style={indicatorStyle}></div>
        {#each tabs as tab}
            <a
                href={tab.href}
                class="tab"
                aria-current={isActive(tab.href) ? 'page' : undefined}
                bind:this={tabRefs[tab.href]}
            >
                <i class={tab.icon} aria-hidden="true"></i>
                {tab.label}
            </a>
        {/each}
    </div>
</nav>

<main class="mt-5">
    {@render children()}
</main>

<style>
    :global(:root) {
        --nudo-bg: #ffffff;
        --nudo-surface: #f7f7f8;
        --nudo-border: #e5e5ea;
        --nudo-text-primary: #1d1d1f;
        --nudo-text-secondary: #6e6e73;
        --nudo-text-tertiary: #aeaeb2;
        --nudo-accent: #0a84ff;
        --nudo-success: #248a3d;
        --nudo-success-soft: #e6f6ea;
        --nudo-warning: #b5590a;
        --nudo-warning-soft: #fef1e3;
        --nudo-radius-lg: 18px;
        --nudo-radius-md: 14px;
        --nudo-font: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    section, nav.tabs-wrap {
        font-family: var(--nudo-font);
    }

    :global(a):focus-visible,
    :global(button):focus-visible,
    :global(input):focus-visible {
        outline: 2px solid var(--nudo-accent);
        outline-offset: 2px;
        border-radius: 8px;
    }

    .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 14px 32px 4px;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        font-size: 15px;
        color: var(--nudo-text-primary);
        padding: 8px 10px;
        margin-left: -10px;
        border-radius: 10px;
        min-height: 40px;
    }
    .back-link:hover { background: var(--nudo-surface); }
    .back-link i { font-size: 18px; }

    .settings-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        font-size: 15px;
        color: var(--nudo-text-secondary);
        padding: 8px 10px;
        border-radius: 10px;
        min-height: 40px;
    }
    .settings-link:hover { background: var(--nudo-surface); color: var(--nudo-text-primary); }

    .search-wrap {
        position: relative;
        width: 100%;
        max-width: 420px;
    }
    .search-field {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--nudo-surface);
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0 16px;
        height: 44px;
        transition: border-color .15s ease, background .15s ease;
    }
    .search-field:focus-within {
        background: var(--nudo-bg);
        border-color: var(--nudo-accent);
    }
    .search-field i { color: var(--nudo-text-tertiary); font-size: 18px; }
    .search-field input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 14.5px;
        color: var(--nudo-text-primary);
        width: 100%;
        height: 100%;
    }
    .search-field input::placeholder { color: var(--nudo-text-tertiary); }

    .search-results {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background: var(--nudo-bg);
        border: 1px solid var(--nudo-border);
        border-radius: var(--nudo-radius-md);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        z-index: 50;
    }
    .search-result {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        text-align: left;
        padding: 12px 14px;
        background: none;
        border: none;
        cursor: pointer;
        min-height: 44px;
    }
    .search-result:hover { background: var(--nudo-surface); }
    .search-result i { font-size: 17px; color: var(--nudo-text-tertiary); flex-shrink: 0; }
    .result-text { flex: 1; min-width: 0; }
    .r-title { font-size: 14px; font-weight: 600; color: var(--nudo-text-primary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .r-excerpt { font-size: 12.5px; color: var(--nudo-text-secondary); margin: 1px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .r-type { font-size: 11.5px; color: var(--nudo-text-tertiary); margin-left: auto; flex-shrink: 0; }

    .hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 20px;
        padding: 14px 32px 18px;
    }

    .hero-left {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .title-row {
        display: flex;
        align-items: baseline;
        gap: 12px;
        flex-wrap: wrap;
    }

    .hero-left h1 {
        font-weight: 800;
        font-size: clamp(22px, 2.6vw, 30px);
        letter-spacing: -0.01em;
        margin: 0;
        text-transform: uppercase;
        line-height: 1;
        color: var(--nudo-text-primary);
    }

    .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12.5px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
    }
    .pill-dot { width: 6px; height: 6px; border-radius: 50%; }

    .status-pendiente { background: var(--nudo-warning-soft); color: var(--nudo-warning); }
    .dot-pendiente { background: var(--nudo-warning); }

    .status-completado { background: var(--nudo-success-soft); color: var(--nudo-success); }
    .dot-completado { background: var(--nudo-success); }

    .status-progreso { background: #e8f1ff; color: var(--nudo-accent); }
    .dot-progreso { background: var(--nudo-accent); }

    .meta-line {
        color: var(--nudo-text-secondary);
        font-size: 12.5px;
        margin: 2px 0 0;
        max-width: 480px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .info-bar {
        display: flex;
        align-items: center;
        gap: 18px;
        background: var(--nudo-surface);
        border-radius: 999px;
        padding: 9px 20px;
        flex-shrink: 0;
    }
    .info-item {
        display: flex;
        flex-direction: column;
        gap: 1px;
        white-space: nowrap;
    }
    .info-item .label { font-size: 10.5px; color: var(--nudo-text-secondary); font-weight: 500; }
    .info-item .value { font-size: 13px; font-weight: 700; color: var(--nudo-text-primary); }
    .info-item .value.muted { font-weight: 400; color: var(--nudo-text-secondary); }
    .divider { width: 1px; height: 22px; background: var(--nudo-border); flex-shrink: 0; }

    .tabs-wrap {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--nudo-border);
        padding: 14px 32px;
    }

    .tabs {
        position: relative;
        display: inline-flex;
        gap: 2px;
        background: var(--nudo-surface);
        padding: 4px;
        border-radius: 999px;
        max-width: 100%;
        overflow-x: auto;
    }

    .tab-indicator {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        background: var(--nudo-bg);
        border-radius: 999px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        transition: transform .28s cubic-bezier(.4,0,.2,1), width .28s cubic-bezier(.4,0,.2,1);
        z-index: 0;
    }

    .tab {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 16px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 600;
        color: var(--nudo-text-secondary);
        min-height: 40px;
        white-space: nowrap;
    }
    .tab i { font-size: 16px; }
    .tab[aria-current="page"] { color: var(--nudo-text-primary); }
    .tab:not([aria-current="page"]):hover { color: var(--nudo-text-primary); }

    @media (prefers-reduced-motion: reduce) {
        .tab-indicator { transition: none; }
    }

    @media (max-width: 860px) {
        .hero { flex-direction: column; align-items: flex-start; }
        .info-bar { width: 100%; overflow-x: auto; }
        .topbar { flex-wrap: wrap; padding: 16px 20px 4px; }
        .search-wrap { order: 3; max-width: 100%; }
        .hero, .tabs-wrap { padding-left: 20px; padding-right: 20px; }
    }
</style>