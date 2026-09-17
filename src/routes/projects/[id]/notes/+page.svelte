<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  let { data }: { data: PageData } = $props();

  import Button from "@components/Button.svelte"

  let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement
  let editDialogRef: HTMLDialogElement = $state() as HTMLDialogElement

  let editingNote = $state<any>(null);
  let editContent = $state('');
  let editColor = $state('');

  const colors = [
    { name: 'default', bg: 'var(--nudo-surface)', text: 'var(--nudo-text-primary)' },
    { name: 'amarillo', bg: '#fde68a', text: '#78350f' },
    { name: 'rosa', bg: '#fbcfe8', text: '#831843' },
    { name: 'azul', bg: '#bfdbfe', text: '#1e3a5f' },
    { name: 'verde', bg: '#bbf7d0', text: '#14532d' },
    { name: 'morado', bg: '#ddd6fe', text: '#4c1d95' },
    { name: 'naranja', bg: '#fed7aa', text: '#7c2d12' },
  ];

  function getNoteBg(color: string | null): string {
    const found = colors.find(c => c.name === color);
    return found ? found.bg : colors[0].bg;
  }

  function getNoteText(color: string | null): string {
    const found = colors.find(c => c.name === color);
    return found ? found.text : colors[0].text;
  }

  function openModal() {
    dialogRef.showModal()
  }

  function closeModal() {
    dialogRef.close()
  }

  function openEdit(note: any) {
    editingNote = note;
    editContent = note.content;
    editColor = note.color || 'default';
    editDialogRef.showModal();
  }

  function closeEdit() {
    editDialogRef.close();
    editingNote = null;
  }

  let showCompleted = $state(false);
  let viewMode = $state<'list' | 'grid'>('list');
  let sortOrder = $state<'asc' | 'desc'>('desc');

  function toggleView() {
    viewMode = viewMode === 'list' ? 'grid' : 'list';
    localStorage.setItem('notes-view', viewMode);
  }

  function toggleSort() {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('notes-sort', sortOrder);
  }

  let activeNotes = $derived(
    data.notes
      .filter(n => !n.completed)
      .sort((a, b) => sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  );
  let completedNotes = $derived(
    data.notes
      .filter(n => n.completed)
      .sort((a, b) => sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  );

  onMount(() => {
    const savedView = localStorage.getItem('notes-view');
    if (savedView === 'list' || savedView === 'grid') viewMode = savedView;
    const savedSort = localStorage.getItem('notes-sort');
    if (savedSort === 'asc' || savedSort === 'desc') sortOrder = savedSort;
  });
</script>

<section class="bg-nudo-bg flex flex-col gap-5 px-4 md:px-8 py-1 pb-12">
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
      Notas de {data.project.name}
    </h1>

    <div class="flex items-center gap-1.5">
      <button onclick={toggleSort}
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all"
        aria-label={sortOrder === 'desc' ? 'Ordenar del más antiguo al más reciente' : 'Ordenar del más reciente al más antiguo'} title="Cambiar orden">
        {#if sortOrder === 'desc'}
          <i class="ri-sort-desc" aria-hidden="true"></i>
        {:else}
          <i class="ri-sort-asc" aria-hidden="true"></i>
        {/if}
      </button>
      <button onclick={toggleView}
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all"
        aria-label={viewMode === 'list' ? 'Cambiar a vista de cuadrícula' : 'Cambiar a vista de lista'} title="Cambiar vista">
        {#if viewMode === 'list'}
          <i class="ri-layout-grid-line" aria-hidden="true"></i>
        {:else}
          <i class="ri-list-check" aria-hidden="true"></i>
        {/if}
      </button>
      <Button onclick={openModal}>
        <i class="ri-add-line" aria-hidden="true"></i> Nueva nota
      </Button>
    </div>
  </div>

  <!-- Modal crear nota -->
  <dialog
    bind:this={dialogRef}
    onclick={(e) => e.target === dialogRef && closeModal()}
    class="fixed inset-0 m-auto max-w-[440px] w-full p-7 border-none rounded-[var(--nudo-radius-lg)] bg-nudo-bg shadow-2xl backdrop:bg-black/40"
  >
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Crear nueva nota</h2>
      <button onclick={closeModal} class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all" aria-label="Cerrar">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>

    <form method="POST" action="?/createNote" class="flex flex-col gap-4">
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Nueva nota</span>
        <textarea name="content" required placeholder="Escribe tu nota..."
          class="border border-nudo-border rounded-[var(--nudo-radius-md)] px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg font-[inherit] resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-nudo-accent focus:border-nudo-accent"></textarea>
      </label>
      <div class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Color</span>
        <div class="flex gap-2 flex-wrap">
          {#each colors as color}
            <button type="button" onclick={() => editColor = color.name}
              class="w-7 h-7 rounded-full cursor-pointer border-2 border-transparent shadow-[inset_0_0_0_1px_var(--nudo-border)] transition-all hover:scale-110
                {editColor === color.name ? 'border-nudo-accent shadow-[0_0_0_2px_var(--nudo-bg),0_0_0_4px_var(--nudo-accent)]' : ''}"
              style="background-color: {color.bg}"
              aria-label={color.name}
              aria-pressed={editColor === color.name}
            ></button>
          {/each}
        </div>
        <input type="hidden" name="color" value={editColor} />
      </div>
      <Button type="submit">Agregar nota</Button>
    </form>
  </dialog>

  <!-- Modal editar nota -->
  <dialog
    bind:this={editDialogRef}
    onclick={(e) => e.target === editDialogRef && closeEdit()}
    class="fixed inset-0 m-auto max-w-[440px] w-full p-7 border-none rounded-[var(--nudo-radius-lg)] bg-nudo-bg shadow-2xl backdrop:bg-black/40"
  >
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Editar nota</h2>
      <button onclick={closeEdit} class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all" aria-label="Cerrar">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>

    {#if editingNote}
      <form method="POST" action="?/editNote" class="flex flex-col gap-4">
        <input type="hidden" name="noteId" value={editingNote.id} />
        <label class="flex flex-col gap-2">
          <span class="text-sm font-semibold text-nudo-text-secondary">Contenido</span>
          <textarea name="content" rows="6" required
            class="border border-nudo-border rounded-[var(--nudo-radius-md)] px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg font-[inherit] resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-nudo-accent focus:border-nudo-accent">{editContent}</textarea>
        </label>
        <div class="flex flex-col gap-2">
          <span class="text-sm font-semibold text-nudo-text-secondary">Color</span>
          <div class="flex gap-2 flex-wrap">
            {#each colors as color}
              <button type="button" onclick={() => editColor = color.name}
                class="w-7 h-7 rounded-full cursor-pointer border-2 border-transparent shadow-[inset_0_0_0_1px_var(--nudo-border)] transition-all hover:scale-110
                  {editColor === color.name ? 'border-nudo-accent shadow-[0_0_0_2px_var(--nudo-bg),0_0_0_4px_var(--nudo-accent)]' : ''}"
                style="background-color: {color.bg}"
                aria-label={color.name}
                aria-pressed={editColor === color.name}
              ></button>
            {/each}
          </div>
          <input type="hidden" name="color" value={editColor} />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    {/if}
  </dialog>

  <div class="flex flex-col gap-6">
    {#if activeNotes.length === 0 && completedNotes.length === 0}
      <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-[var(--nudo-radius-lg)]">
        <i class="ri-sticky-note-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
        <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aún no hay notas en este proyecto</p>
        <p class="m-0 text-[14px] text-nudo-text-secondary">Crea tu primera nota con el botón de arriba.</p>
      </div>
    {:else}
      <div class="{viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col gap-2'}">
        {#each activeNotes as note}
          <div
            data-highlight-id={note.id}
            onclick={() => openEdit(note)}
            class="flex items-start justify-between gap-3 px-4 py-4 rounded-[var(--nudo-radius-lg)] cursor-pointer transition-all hover:brightness-[0.97]
              {viewMode === 'grid' ? 'flex-col min-h-[150px]' : ''}"
            style="background-color: {getNoteBg(note.color)}; color: {getNoteText(note.color)}"
          >
            <p class="flex-1 text-base leading-relaxed m-0 whitespace-pre-wrap break-words
              {viewMode === 'grid' ? 'line-clamp-5' : ''}">{note.content}</p>
            <div class="flex items-center gap-1 shrink-0 opacity-70
              {viewMode === 'grid' ? 'self-end mt-auto pt-2.5' : ''}">
              <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-black/5 hover:text-nudo-text-primary transition-all" aria-label="Marcar como completada" title="Marcar como completada">
                  <i class="ri-checkbox-blank-circle-line" aria-hidden="true"></i>
                </button>
              </form>
              <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-black/5 hover:text-[#d70015] transition-all" aria-label="Eliminar nota" title="Eliminar nota">
                  <i class="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if completedNotes.length > 0}
      <div class="flex flex-col gap-6">
        <button
          onclick={() => showCompleted = !showCompleted}
          class="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[14.5px] font-bold text-nudo-text-secondary px-1 py-1.5 mb-2.5 hover:text-nudo-text-primary transition-colors"
          aria-expanded={showCompleted}
        >
          <i class="ri-arrow-down-s-line text-base transition-transform duration-200 {showCompleted ? 'rotate-180' : ''}" aria-hidden="true"></i>
          Completadas ({completedNotes.length})
        </button>

        {#if showCompleted}
          <div class="{viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col gap-2'}">
            {#each completedNotes as note}
              <div
                data-highlight-id={note.id}
                onclick={() => openEdit(note)}
                class="flex items-start justify-between gap-3 px-4 py-4 rounded-[var(--nudo-radius-lg)] cursor-pointer opacity-60 hover:opacity-85 transition-all
                  {viewMode === 'grid' ? 'flex-col min-h-[150px]' : ''}"
                style="background-color: {getNoteBg(note.color)}; color: {getNoteText(note.color)}"
              >
                <p class="flex-1 text-base leading-relaxed m-0 whitespace-pre-wrap break-words line-through
                  {viewMode === 'grid' ? 'line-clamp-5' : ''}">{note.content}</p>
                <div class="flex items-center gap-1 shrink-0 opacity-70
                  {viewMode === 'grid' ? 'self-end mt-auto pt-2.5' : ''}">
                  <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-success hover:bg-black/5 transition-all" aria-label="Marcar como pendiente" title="Marcar como pendiente">
                      <i class="ri-checkbox-circle-fill" aria-hidden="true"></i>
                    </button>
                  </form>
                  <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-black/5 hover:text-[#d70015] transition-all" aria-label="Eliminar nota" title="Eliminar nota">
                      <i class="ri-delete-bin-line" aria-hidden="true"></i>
                    </button>
                  </form>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
