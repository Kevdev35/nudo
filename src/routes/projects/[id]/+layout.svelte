<script lang="ts">
    import "../../layout.css"
    import type { LayoutData } from './$types';
    import { goto, afterNavigate } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { onMount, tick } from 'svelte';
    import Button from '@components/Button.svelte';
    let { data, children }: { data: LayoutData; children: any } = $props();

    let query = $state('');
    let results = $state<any[]>([]);
    let open = $state(false);
    let timer: ReturnType<typeof setTimeout>;

    // Settings modal
    let settingsDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let deleteDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let settingsLoading = $state(false);
    let settingsError = $state('');
    let deleteLoading = $state(false);

    // Form values
    let editName = $state(data.project.name);
    let editDescription = $state(data.project.description ?? '');
    let editStatus = $state(data.project.status ?? 'pendiente');
    let editBudget = $state(data.project.budget?.toString() ?? '');
    let editClientId = $state(data.project.client_id ?? '');

    function openSettings() {
        editName = data.project.name;
        editDescription = data.project.description ?? '';
        editStatus = data.project.status ?? 'pendiente';
        editBudget = data.project.budget?.toString() ?? '';
        editClientId = data.project.client_id ?? '';
        settingsError = '';
        settingsDialog.showModal();
    }

    function closeSettings() {
        settingsDialog.close();
    }

    function openDelete() {
        deleteDialog.showModal();
    }

    function closeDelete() {
        deleteDialog.close();
    }

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
        if (href === `/projects/${data.project.id}`) return $page.url.pathname === href;
        return $page.url.pathname.startsWith(href);
    }

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
                <i class="ri-arrow-left-s-line text-lg" aria-hidden="true"></i>
                Mis proyectos
            </a>

            <div class="search-wrap">
                <div class="search-field">
                    <i class="ri-search-line text-nudo-text-tertiary text-lg" aria-hidden="true"></i>
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
                                <i class="{typeIcon[r.type]} text-nudo-text-tertiary text-base shrink-0" aria-hidden="true"></i>
                                <div class="flex-1 min-w-0">
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

            <button type="button" onclick={openSettings} class="settings-link">
                <i class="ri-settings-3-line text-lg" aria-hidden="true"></i>
                Configuración
            </button>
        </div>

        <div class="hero">
            <div class="flex flex-col gap-0.5 min-w-0">
                <div class="flex items-center gap-3 justify-start">
                    <h1 class="font-extrabold text-nudo-text-primary uppercase leading-none tracking-tight m-0"
                        style="font-size: clamp(26px, 3vw, 36px)">
                        {data.project.name}
                    </h1>
                    {#if data.project.status}
                        {@const s = statusStyles[data.project.status] ?? { pill: 'status-pendiente', dot: 'dot-pendiente' }}
                        <span class="pill rounded-full gap-1.5 px-2.5 py-1 {s.pill} flex items-center text-center justify-center">
                            <i class="ri-checkbox-blank-circle-fill text-xs flex text-center items-center "></i>
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

<!-- Modal: Configuración del Proyecto -->
<dialog
    bind:this={settingsDialog}
    onclick={(e) => e.target === settingsDialog && closeSettings()}
    class="fixed inset-0 m-auto max-w-lg w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40 max-h-[90vh] overflow-y-auto"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Configuración del proyecto</h2>
        <button onclick={closeSettings} class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface transition-colors" aria-label="Cerrar">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    {#if settingsError}
        <div class="mb-5 p-3 rounded-2xl bg-red-500/10 text-red-500 text-sm font-medium flex items-center gap-2">
            <i class="ri-error-warning-line text-lg"></i> {settingsError}
        </div>
    {/if}

    <form
        method="POST"
        action="?/updateProject"
        use:enhance={() => {
            settingsLoading = true;
            settingsError = '';
            return async ({ result }) => {
                settingsLoading = false;
                if (result.type === 'success') {
                    closeSettings();
                    goto($page.url.pathname, { invalidateAll: true });
                } else if (result.type === 'failure') {
                    settingsError = (result.data as any)?.error ?? 'Error al guardar';
                }
            };
        }}
        class="flex flex-col gap-4"
    >
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Nombre</span>
            <input name="name" type="text" required bind:value={editName}
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors" />
        </label>

        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Descripción</span>
            <textarea name="description" rows="3" bind:value={editDescription}
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors resize-none"></textarea>
        </label>

        <div class="grid grid-cols-2 gap-4">
            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Estado</span>
                <select name="status" bind:value={editStatus}
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors">
                    <option value="pendiente">Pendiente</option>
                    <option value="activo">Activo</option>
                    <option value="terminado">Terminado</option>
                </select>
            </label>

            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Presupuesto</span>
                <input name="budget" type="number" step="0.01" bind:value={editBudget} placeholder="0.00"
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors" />
            </label>
        </div>

        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Cliente</span>
            <select name="clientId" bind:value={editClientId}
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors">
                <option value="">Sin cliente (proyecto propio)</option>
                {#each data.clients as client}
                    <option value={client.id}>{client.name}</option>
                {/each}
            </select>
        </label>

        <div class="flex justify-between items-center mt-2">
            <button type="button" onclick={openDelete}
                class="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 cursor-pointer bg-transparent border-none font-inherit font-medium transition-colors">
                <i class="ri-delete-bin-line text-base" aria-hidden="true"></i> Eliminar proyecto
            </button>
            <div class="flex gap-2.5">
                <Button type="button" onclick={closeSettings}>Cancelar</Button>
                <Button type="submit" disabled={settingsLoading}>
                    {settingsLoading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
            </div>
        </div>
    </form>
</dialog>

<!-- Modal: Confirmar Eliminación -->
<dialog
    bind:this={deleteDialog}
    onclick={(e) => e.target === deleteDialog && closeDelete()}
    class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Eliminar proyecto</h2>
        <button onclick={closeDelete} class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface transition-colors" aria-label="Cerrar">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    <div class="flex flex-col items-center text-center gap-3 mb-6">
        <div class="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <i class="ri-error-warning-line text-red-500 text-2xl" aria-hidden="true"></i>
        </div>
        <p class="text-nudo-text-primary font-semibold m-0">¿Estás seguro de eliminar este proyecto?</p>
        <p class="text-nudo-text-secondary text-sm m-0">
            Se eliminará <strong class="text-nudo-text-primary">{data.project.name}</strong> y todo su contenido (notas, kanban, markdown, archivos). Esta acción no se puede deshacer.
        </p>
    </div>

    <form method="POST" action="?/deleteProject"
        use:enhance={() => {
            deleteLoading = true;
            return async ({ result }) => {
                deleteLoading = false;
                if (result.type === 'redirect') {
                    goto(result.location);
                }
            };
        }}
        class="flex justify-end gap-2.5"
    >
        <Button type="button" onclick={closeDelete}>Cancelar</Button>
        <button type="submit" disabled={deleteLoading}
            class="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold border-none cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50">
            {deleteLoading ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
    </form>
</dialog>

<nav class="tabs-wrap" aria-label="Secciones del proyecto">
    <div class="tabs">
        <div class="tab-indicator" style={indicatorStyle}></div>
        {#each tabs as tab}
            <a
                href={tab.href}
                class="tab relative z-1 text-center inline-flex items-center gap-1.5 rounded-full"
                aria-current={isActive(tab.href) ? 'page' : undefined}
                bind:this={tabRefs[tab.href]}
            >
                <i class="{tab.icon} text-base flex items-center text-center" aria-hidden="true"></i>
                <span class="flex text-center items-center ">{tab.label}</span>
            </a>
        {/each}
    </div>
</nav>

<main class="mt-5">
    {@render children()}
</main>
