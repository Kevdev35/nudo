<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    let { data }: { data: PageData } = $props();
    import Button from '@ui/components/Button.svelte';

    let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement

    let viewMode = $state<'list' | 'grid'>('list');
    let sortOrder = $state<'asc' | 'desc'>('desc');

    function toggleView() {
        viewMode = viewMode === 'list' ? 'grid' : 'list';
        localStorage.setItem('markdown-view', viewMode);
    }

    function toggleSort() {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        localStorage.setItem('markdown-sort', sortOrder);
    }

    let sortedDocs = $derived(
        [...data.markdownDocs].sort((a, b) =>
            sortOrder === 'asc'
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );

    onMount(() => {
        const sv = localStorage.getItem('markdown-view');
        if (sv === 'list' || sv === 'grid') viewMode = sv;
        const ss = localStorage.getItem('markdown-sort');
        if (ss === 'asc' || ss === 'desc') sortOrder = ss;
    });

    function openModal() {
        dialogRef.showModal()
    }

    function closeModal() {
        dialogRef.close()
    }

    function formatDate(d: any): string {
        return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
    <div class="flex items-center justify-between flex-wrap gap-4">
        <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
            Markdowns de {data.project.name}
        </h1>
        <div class="flex items-center gap-1.5">
            <button onclick={toggleSort} class="icon-btn" aria-label="Cambiar orden" title="Cambiar orden">
                {#if sortOrder === 'desc'}
                    <i class="ri-sort-desc" aria-hidden="true"></i>
                {:else}
                    <i class="ri-sort-asc" aria-hidden="true"></i>
                {/if}
            </button>
            <button onclick={toggleView} class="icon-btn" aria-label="Cambiar vista" title="Cambiar vista">
                {#if viewMode === 'list'}
                    <i class="ri-layout-grid-line" aria-hidden="true"></i>
                {:else}
                    <i class="ri-list-check" aria-hidden="true"></i>
                {/if}
            </button>
            <Button onclick={openModal}>
                <i class="ri-add-line" aria-hidden="true"></i> Nuevo markdown
            </Button>
        </div>
    </div>

    <dialog
        bind:this={dialogRef}
        onclick={(e) => e.target === dialogRef && closeModal()}
        class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40"
    >
        <div class="flex items-center justify-between mb-5">
            <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Crear nuevo markdown</h2>
            <button onclick={closeModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
        </div>
        <form method="POST" action="?/createMarkdownDoc" class="flex flex-col gap-4">
            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Título</span>
                <input name="title" required placeholder="Escribe el titulo de tu markdown..."
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
            </label>
            <Button type="submit">Crear markdown</Button>
        </form>
    </dialog>

    <div class="flex flex-col gap-6">
        {#if sortedDocs.length === 0}
            <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
                <i class="ri-booklet-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
                <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aún no hay documentos markdown</p>
                <p class="m-0 text-[14px] text-nudo-text-secondary">Crea tu primer documento con el botón de arriba.</p>
            </div>
        {:else if viewMode === 'grid'}
            <div class="grid grid-cols-3 gap-3">
                {#each sortedDocs as markdown}
                    <a
                        data-highlight-id={markdown.id}
                        href="/projects/{data.project.id}/markdown/{markdown.id}"
                        class="flex flex-col gap-3 min-h-[120px] p-5 bg-nudo-surface rounded-3xl hover:bg-nudo-bg hover:shadow-sm transition-all duration-150 no-underline text-inherit"
                    >
                        <i class="ri-booklet-line text-nudo-text-tertiary text-2xl" aria-hidden="true"></i>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-base text-nudo-text-primary m-0 line-clamp-2">{markdown.title}</p>
                        </div>
                        <span class="text-xs text-nudo-text-tertiary">{formatDate(markdown.createdAt)}</span>
                    </a>
                {/each}
            </div>
        {:else}
            <div class="flex flex-col gap-2">
                {#each sortedDocs as markdown}
                    <a
                        data-highlight-id={markdown.id}
                        href="/projects/{data.project.id}/markdown/{markdown.id}"
                        class="flex items-center gap-4 px-5 py-4 bg-nudo-surface rounded-3xl hover:bg-nudo-bg hover:shadow-sm transition-all duration-150 no-underline text-inherit"
                    >
                        <i class="ri-booklet-line text-nudo-text-tertiary text-xl" aria-hidden="true"></i>
                        <p class="text-base flex-1 m-0 text-nudo-text-primary">{markdown.title}</p>
                        <span class="text-xs text-nudo-text-tertiary shrink-0">{formatDate(markdown.createdAt)}</span>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</section>
