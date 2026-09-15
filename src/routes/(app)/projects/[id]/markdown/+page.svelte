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

<section>

    <div class="flex justify-between mx-5">
        <h1 class="font-bold text-7xl">Markdowns de {data.project.name}</h1>

        <div>
            <button onclick={toggleSort} class="rounded-3xl p-5 cursor-pointer hover:bg-[var(--surface-container-high)] transition-colors" aria-label="Cambiar orden">
                {#if sortOrder === 'desc'}
                    <i class="ri-sort-desc text-xl"></i>
                {:else}
                    <i class="ri-sort-asc text-xl"></i>
                {/if}
            </button>
            <button onclick={toggleView} class="rounded-3xl p-5 cursor-pointer hover:bg-[var(--surface-container-high)] transition-colors" aria-label="Cambiar vista">
                {#if viewMode === 'list'}
                    <i class="ri-layout-grid-line text-xl"></i>
                {:else}
                    <i class="ri-list-check text-xl"></i>
                {/if}
            </button>
            <Button onclick={openModal}>
                <i class="ri-add-line text-lg"></i> Nuevo markdown
            </Button>
        </div>
    </div>

    <dialog
        bind:this={dialogRef}
        onclick={(e) => e.target === dialogRef && closeModal()}
        class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
    >
        <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold">Crear nuevo markdown</h2>
        <button onclick={closeModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl"><i class="ri-close-line"></i></button>
        </div>

        <form method="POST" action="?/createMarkdownDoc" class="mt-4 flex flex-col gap-4">
        <label class="flex flex-col gap-2">
            <span>Crear markdown</span>
            <input name="title" class="rounded-3xl border p-5" required placeholder="Escribe el titulo de tu markdown..."/>
        </label>
        <Button type="submit">Crear markdown</Button>
        </form>
    </dialog>


    <div>
        {#if sortedDocs.length === 0}
            <p>Aún no hay archivos en este proyecto.</p>
        {:else if viewMode === 'grid'}
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mx-3 mt-4">
                {#each sortedDocs as markdown}
                    <a
                        data-highlight-id={markdown.id}
                        href="/projects/{data.project.id}/markdown/{markdown.id}"
                        class="bg-[var(--surface-container-high)] rounded-3xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3 min-h-[120px]"
                    >
                        <i class="ri-booklet-line text-2xl opacity-40"></i>
                        <div class="flex-1">
                            <p class="font-bold text-lg line-clamp-2">{markdown.title}</p>
                        </div>
                        <p class="text-xs opacity-40">{formatDate(markdown.createdAt)}</p>
                    </a>
                {/each}
            </div>
        {:else}
            <div class="flex flex-col gap-2 mx-3 mt-4">
                {#each sortedDocs as markdown}
                    <a
                        data-highlight-id={markdown.id}
                        href="/projects/{data.project.id}/markdown/{markdown.id}"
                        class="flex items-center gap-4 px-5 py-4 bg-[var(--surface-container-high)] rounded-3xl hover:shadow-sm transition-shadow"
                    >
                        <i class="ri-booklet-line text-xl opacity-40"></i>
                        <p class="text-lg flex-1">{markdown.title}</p>
                        <span class="text-xs opacity-40 shrink-0">{formatDate(markdown.createdAt)}</span>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</section>
