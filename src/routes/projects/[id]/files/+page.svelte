<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  let { data }: { data: PageData } = $props();

  import Button from '@components/Button.svelte';

  let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement;

  let viewMode = $state<'list' | 'grid'>('list');
  let sortOrder = $state<'asc' | 'desc'>('desc');

  const typeMeta: Record<string, { label: string; icon: string }> = {
    image: { label: 'Imagen', icon: 'ri-image-line' },
    uml: { label: 'UML', icon: 'ri-flow-chart' },
    figma_link: { label: 'Figma', icon: 'ri-figma-line' },
    other: { label: 'Otro', icon: 'ri-file-line' }
  };

  function getType(type: string) {
    return typeMeta[type] ?? typeMeta.other;
  }

  let sortedFiles = $derived(
    [...data.files].sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  function toggleView() {
    viewMode = viewMode === 'list' ? 'grid' : 'list';
    localStorage.setItem('files-view', viewMode);
  }

  function toggleSort() {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('files-sort', sortOrder);
  }

  onMount(() => {
    const sv = localStorage.getItem('files-view');
    if (sv === 'list' || sv === 'grid') viewMode = sv;
    const ss = localStorage.getItem('files-sort');
    if (ss === 'asc' || ss === 'desc') sortOrder = ss;
  });

  function openModal() {
    dialogRef.showModal();
  }

  function closeModal() {
    dialogRef.close();
  }

  function formatDate(d: any): string {
    return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
  <div class="flex items-center justify-between flex-wrap gap-4">
    <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
      Archivos de {data.project.name}
    </h1>
    <div class="flex items-center gap-1.5">
      <button onclick={toggleSort}
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all"
        aria-label="Cambiar orden" title="Cambiar orden">
        {#if sortOrder === 'desc'}
          <i class="ri-sort-desc" aria-hidden="true"></i>
        {:else}
          <i class="ri-sort-asc" aria-hidden="true"></i>
        {/if}
      </button>
      <button onclick={toggleView}
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all"
        aria-label="Cambiar vista" title="Cambiar vista">
        {#if viewMode === 'list'}
          <i class="ri-layout-grid-line" aria-hidden="true"></i>
        {:else}
          <i class="ri-list-check" aria-hidden="true"></i>
        {/if}
      </button>
      <Button onclick={openModal}>
        <i class="ri-upload-2-line" aria-hidden="true"></i> Subir archivo
      </Button>
    </div>
  </div>

  <!-- Modal: subir archivo -->
  <dialog
    bind:this={dialogRef}
    onclick={(e) => e.target === dialogRef && closeModal()}
    class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40"
  >
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Subir archivo</h2>
      <button onclick={closeModal}
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all"
        aria-label="Cerrar">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>
    <form method="POST" action="?/createFile" enctype="multipart/form-data" class="flex flex-col gap-4">
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Nombre del archivo</span>
        <input name="name" type="text" required placeholder="ej. Diagrama de base de datos"
          class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
      </label>
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Tipo</span>
        <select name="type"
          class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent">
          <option value="image">Imagen</option>
          <option value="uml">UML</option>
          <option value="figma_link">Figma</option>
          <option value="other">Otro</option>
        </select>
      </label>
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Archivo</span>
        <input name="file" type="file" required
          class="border border-nudo-border rounded-2xl px-4 py-3 text-[15px] text-nudo-text-secondary bg-nudo-bg focus:outline-none focus:border-nudo-accent file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-none file:bg-nudo-surface file:text-nudo-text-primary file:font-semibold file:cursor-pointer" />
      </label>
      <Button type="submit">Subir archivo</Button>
    </form>
  </dialog>

  <div class="flex flex-col gap-6">
    {#if sortedFiles.length === 0}
      <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
        <i class="ri-folder-3-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
        <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aún no hay archivos en este proyecto</p>
        <p class="m-0 text-[14px] text-nudo-text-secondary">Sube tu primer archivo con el botón de arriba.</p>
      </div>
    {:else if viewMode === 'grid'}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        {#each sortedFiles as file}
          <div
            data-highlight-id={file.id}
            class="group flex flex-col gap-3 min-h-[150px] p-5 bg-nudo-surface rounded-3xl hover:bg-nudo-bg hover:shadow-sm transition-all duration-150"
          >
            <div class="flex items-start justify-between gap-2">
              <i class="{getType(file.type).icon} text-nudo-text-tertiary text-2xl" aria-hidden="true"></i>
              <form method="POST" action="?/deleteFile">
                <input type="hidden" name="fileId" value={file.id} />
                <button type="submit"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-black/5 hover:text-[#d70015] transition-all"
                  aria-label="Eliminar archivo" title="Eliminar archivo">
                  <i class="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
              </form>
            </div>
            <a href={file.url_or_path} target="_blank" rel="noopener noreferrer"
              class="flex-1 min-w-0 no-underline text-inherit">
              <p class="font-semibold text-base text-nudo-text-primary m-0 line-clamp-2 break-words">{file.name}</p>
              <span class="text-xs text-nudo-text-tertiary">{getType(file.type).label}</span>
            </a>
            <span class="text-xs text-nudo-text-tertiary">{formatDate(file.createdAt)}</span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col gap-2">
        {#each sortedFiles as file}
          <div
            data-highlight-id={file.id}
            class="flex items-center gap-4 px-5 py-4 bg-nudo-surface rounded-3xl hover:bg-nudo-bg hover:shadow-sm transition-all duration-150"
          >
            <i class="{getType(file.type).icon} text-nudo-text-tertiary text-xl shrink-0" aria-hidden="true"></i>
            <a href={file.url_or_path} target="_blank" rel="noopener noreferrer"
              class="flex-1 min-w-0 no-underline text-inherit">
              <p class="text-base m-0 text-nudo-text-primary truncate">{file.name}</p>
              <span class="text-xs text-nudo-text-tertiary">{getType(file.type).label}</span>
            </a>
            <span class="text-xs text-nudo-text-tertiary shrink-0 max-sm:hidden">{formatDate(file.createdAt)}</span>
            <form method="POST" action="?/deleteFile" class="shrink-0">
              <input type="hidden" name="fileId" value={file.id} />
              <button type="submit"
                class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-black/5 hover:text-[#d70015] transition-all"
                aria-label="Eliminar archivo" title="Eliminar archivo">
                <i class="ri-delete-bin-line" aria-hidden="true"></i>
              </button>
            </form>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
