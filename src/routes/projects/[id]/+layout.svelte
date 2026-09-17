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

    let settingsDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let deleteDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let settingsLoading = $state(false);
    let settingsError = $state('');
    let deleteLoading = $state(false);

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

    function closeSettings() { settingsDialog.close(); }
    function openDelete() { deleteDialog.showModal(); }
    function closeDelete() { deleteDialog.close(); }

    function onInput() {
        clearTimeout(timer);
        if (query.trim().length < 2) { results = []; open = false; return; }
        timer = setTimeout(async () => {
            const res = await fetch(`/projects/${data.project.id}/search?q=${encodeURIComponent(query)}`);
            const json = await res.json();
            results = json.results ?? [];
            open = results.length > 0;
        }, 250);
    }

    function close() { open = false; }
    function select(href: string, id: string) { query = ''; open = false; goto(href + '?highlight=' + id); }
    function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') close(); }

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

    afterNavigate(() => { applyHighlight(); updateIndicator(); });

    const typeIcon: Record<string, string> = {
        nota: 'ri-file-text-line', tarea: 'ri-checkbox-circle-line',
        doc: 'ri-booklet-line', archivo: 'ri-attachment-2',
    };

    const statusClasses: Record<string, string> = {
        pendiente: 'bg-nudo-warning-soft text-nudo-warning',
        'en progreso': 'bg-[#e8f1ff] text-nudo-accent',
        completado: 'bg-nudo-success-soft text-nudo-success',
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

<section class="bg-nudo-bg">
    <header>
        <!-- Topbar -->
        <div class="flex items-center justify-between gap-6 px-8 pt-3.5 pb-1 max-md:flex-wrap max-md:px-5">
            <a href="/dashboard"
                class="inline-flex items-center gap-1.5 font-semibold text-base text-nudo-text-primary py-2 px-2.5 -ml-2.5 rounded-xl min-h-10 hover:bg-nudo-surface transition-colors no-underline">
                <i class="ri-arrow-left-s-line text-lg" aria-hidden="true"></i>
                Mis proyectos
            </a>

            <!-- Search -->
            <div class="relative w-full max-w-[420px] max-md:order-3 max-md:max-w-full">
                <div class="flex search-field appearance-none items-center gap-2.5 bg-nudo-surface border border-transparent rounded-full px-4 h-11 transition-all focus-within:bg-nudo-bg focus-within:border-nudo-accent">
                    <i class="ri-search-line text-nudo-text-tertiary text-lg" aria-hidden="true"></i>
                    <input
                        type="text" role="combobox" aria-expanded={open} aria-controls="search-results"
                        aria-autocomplete="list" aria-label="Buscar notas, markdowns, archivos y más en este proyecto"
                        placeholder="Buscar notas, markdowns, archivos..."
                        bind:value={query} oninput={onInput}
                        onfocus={() => { if (results.length > 0) open = true; }}
                        onblur={() => setTimeout(close, 200)} onkeydown={onKeydown}
                        class="border-none bg-transparent text-base text-nudo-text-primary w-full h-full placeholder:text-nudo-text-tertiary"
                    />
                </div>
                {#if open && results.length > 0}
                    <div class="absolute top-full mt-2 left-0 right-0 bg-nudo-bg border border-nudo-border rounded-[var(--nudo-radius-md)] shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden z-50" id="search-results" role="listbox">
                        {#each results as r}
                            <button type="button" role="option" aria-selected="false"
                                onmousedown={() => select(r.href, r.id)}
                                class="flex items-center gap-3 w-full text-left px-3.5 py-3 bg-transparent border-none cursor-pointer min-h-11 hover:bg-nudo-surface transition-colors">
                                <i class="{typeIcon[r.type]} text-nudo-text-tertiary text-base shrink-0" aria-hidden="true"></i>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-nudo-text-primary m-0 truncate">{r.title}</p>
                                    {#if r.excerpt}
                                        <p class="text-xs text-nudo-text-secondary m-0 mt-px truncate">{r.excerpt}</p>
                                    {/if}
                                </div>
                                <span class="text-[11.5px] text-nudo-text-tertiary ml-auto shrink-0">{r.type}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <button type="button" onclick={openSettings}
                class="inline-flex items-center gap-1.5 font-semibold text-base text-nudo-text-secondary py-2 px-2.5 rounded-xl min-h-10 hover:bg-nudo-surface hover:text-nudo-text-primary transition-colors cursor-pointer bg-transparent border-none">
                <i class="ri-settings-3-line text-lg" aria-hidden="true"></i>
                Configuración
            </button>
        </div>

        <!-- Hero -->
        <div class="flex items-center justify-between flex-wrap gap-5 px-8 py-3.5 pb-4.5 max-md:flex-col max-md:items-start max-md:px-5">
            <div class="flex flex-col gap-0.5 min-w-0">
                <div class="flex items-center gap-3 justify-start">
                    <h1 class="font-extrabold text-nudo-text-primary uppercase leading-none tracking-tight m-0"
                        style="font-size: clamp(26px, 3vw, 36px)">
                        {data.project.name}
                    </h1>
                    {#if data.project.status}
                        {@const sClass = statusClasses[data.project.status] ?? 'bg-nudo-warning-soft text-nudo-warning'}
                        <span class="text-[13.5px] font-semibold rounded-full gap-1.5 px-2.5 py-1 flex items-center text-center justify-center {sClass}">
                            <i class="ri-checkbox-blank-circle-fill text-xs flex text-center items-center"></i>
                            {data.project.status}
                        </span>
                    {/if}
                </div>
                {#if data.project.description}
                    <p class="text-nudo-text-secondary text-sm m-0 mt-0.5 max-w-[480px] truncate">{data.project.description}</p>
                {/if}
            </div>

            <div class="flex items-center gap-4.5 bg-nudo-surface rounded-full py-2.5 px-5 shrink-0 max-md:w-full max-md:overflow-x-auto" role="list" aria-label="Detalles del proyecto">
                {#if data.project.budget}
                    <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                        <span class="text-xs text-nudo-text-secondary font-medium">Presupuesto</span>
                        <span class="text-base font-bold text-nudo-text-primary">${data.project.budget}</span>
                    </div>
                    <span class="w-px h-[22px] bg-nudo-border shrink-0" aria-hidden="true"></span>
                {/if}
                <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                    <span class="text-xs text-nudo-text-secondary font-medium">Creado</span>
                    <span class="text-base font-bold text-nudo-text-primary">{data.project.createdAt}</span>
                </div>
                <span class="w-px h-[22px] bg-nudo-border shrink-0" aria-hidden="true"></span>
                <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                    <span class="text-xs text-nudo-text-secondary font-medium">Cliente</span>
                    <span class="text-base font-bold text-nudo-text-primary {!data.client?.name ? 'font-normal text-nudo-text-secondary' : ''}">
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

    <form method="POST" action="?/updateProject"
        use:enhance={() => {
            settingsLoading = true; settingsError = '';
            return async ({ result }) => {
                settingsLoading = false;
                if (result.type === 'success') { closeSettings(); goto($page.url.pathname, { invalidateAll: true }); }
                else if (result.type === 'failure') { settingsError = (result.data as any)?.error ?? 'Error al guardar'; }
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
            Se eliminará <strong class="text-nudo-text-primary">{data.project.name}</strong> y todo su contenido. Esta acción no se puede deshacer.
        </p>
    </div>
    <form method="POST" action="?/deleteProject"
        use:enhance={() => {
            deleteLoading = true;
            return async ({ result }) => { deleteLoading = false; if (result.type === 'redirect') goto(result.location); };
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

<!-- Tabs -->
<nav class="bg-nudo-bg/85 sticky top-0 z-10 backdrop-blur-[10px] border-b border-nudo-border px-8 py-3.5 max-md:px-5" aria-label="Secciones del proyecto">
    <div class="relative inline-flex gap-0.5 bg-nudo-surface p-1 rounded-full max-w-full overflow-x-auto">
        <div class="absolute top-1 bottom-1 left-1 bg-nudo-bg rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.08)] z-0 transition-all duration-[280ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={indicatorStyle}></div>
        {#each tabs as tab}
            <a
                href={tab.href}
                class="py-2.5 px-4 text-base font-semibold text-nudo-text-secondary min-h-10 whitespace-nowrap relative z-10 rounded-full inline-flex items-center gap-1.5 no-underline transition-colors hover:text-nudo-text-primary
                    {isActive(tab.href) ? 'text-nudo-text-primary' : ''}"
                aria-current={isActive(tab.href) ? 'page' : undefined}
                bind:this={tabRefs[tab.href]}
            >
                <i class="{tab.icon} text-base flex items-center text-center" aria-hidden="true"></i>
                <span class="flex text-center items-center">{tab.label}</span>
            </a>
        {/each}
    </div>
</nav>

<main class="mt-5 bg-nudo-bg">
    {@render children()}
</main>
