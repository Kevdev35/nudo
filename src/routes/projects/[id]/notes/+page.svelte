<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import { enhance } from '$app/forms';
  let { data }: { data: PageData } = $props();

  import Button from "@components/Button.svelte"
  import { isBackdropClick } from '@ui/modal'

  let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement
  let editDialogRef: HTMLDialogElement = $state() as HTMLDialogElement

  let editingNote = $state<any>(null);
  let editTitle = $state('');
  let editContent = $state('');
  let editColor = $state('');

  let newTitle = $state('');
  let newContent = $state('');
  let newColor = $state('default');
  let savingDraft = $state(false);
  let justPublishedId = $state<string | null>(null);

  function handleEditEnhance() {
    // enhance llama a esto ANTES del fetch; el callback que retornamos recibe la respuesta
    return async ({ result, update }: any) => {
      const id = editingNote?.id;
      if (result.type === 'success' && id) {
        justPublishedId = id;
        editDialogRef.close();
        editingNote = null;
      }
      await update();
    };
  }

  const colors = [
    { name: 'default', bg: 'var(--nudo-surface)', text: 'var(--nudo-text-primary)', border: 'var(--nudo-border)' },
    { name: 'amarillo', bg: 'var(--nudo-note-amarillo-bg)', text: 'var(--nudo-note-amarillo-text)', border: 'var(--nudo-note-amarillo-border)' },
    { name: 'rosa', bg: 'var(--nudo-note-rosa-bg)', text: 'var(--nudo-note-rosa-text)', border: 'var(--nudo-note-rosa-border)' },
    { name: 'azul', bg: 'var(--nudo-note-azul-bg)', text: 'var(--nudo-note-azul-text)', border: 'var(--nudo-note-azul-border)' },
    { name: 'verde', bg: 'var(--nudo-note-verde-bg)', text: 'var(--nudo-note-verde-text)', border: 'var(--nudo-note-verde-border)' },
    { name: 'morado', bg: 'var(--nudo-note-morado-bg)', text: 'var(--nudo-note-morado-text)', border: 'var(--nudo-note-morado-border)' },
    { name: 'naranja', bg: 'var(--nudo-note-naranja-bg)', text: 'var(--nudo-note-naranja-text)', border: 'var(--nudo-note-naranja-border)' },
  ];

  function getNoteBg(color: string | null): string {
    const found = colors.find(c => c.name === color);
    return found ? found.bg : colors[0].bg;
  }

  function getNoteText(color: string | null): string {
    const found = colors.find(c => c.name === color);
    return found ? found.text : colors[0].text;
  }

  function getNoteBorder(color: string | null): string {
    const found = colors.find(c => c.name === color);
    return found ? found.border : colors[0].border;
  }

  // `background` (no `background-color`) porque en Liquid Lite el valor es un
  // gradiente. En Claro/Oscuro los bordes son transparentes y no cambia nada.
  function getNoteStyle(color: string | null): string {
    return `background: ${getNoteBg(color)}; color: ${getNoteText(color)}; border-color: ${getNoteBorder(color)}`;
  }

  function openModal() {
    newTitle = '';
    newContent = '';
    newColor = 'default';
    dialogRef.showModal()
  }

  async function persistDraft(payload: { noteId?: string; title: string; content: string; color: string }): Promise<boolean> {
    try {
      const fd = new FormData();
      if (payload.noteId) fd.append('noteId', payload.noteId);
      fd.append('title', payload.title);
      fd.append('content', payload.content);
      fd.append('color', payload.color);
      const res = await fetch('?/saveDraft', { method: 'POST', body: fd });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function closeModal() {
    if (savingDraft) return;

    const title = newTitle;
    const content = newContent;
    const hasContent = title.trim().length > 0 || content.trim().length > 0;

    if (hasContent) {
      savingDraft = true;
      const ok = await persistDraft({ title, content, color: newColor });
      savingDraft = false;
      // si falla, se queda abierto para no perder lo escrito
      if (!ok) return;
    }

    dialogRef.close();
    newTitle = '';
    newContent = '';
    newColor = 'default';
    if (hasContent) await invalidateAll();
  }

  function openEdit(note: any) {
    editingNote = note;
    editTitle = note.title ?? '';
    editContent = note.content;
    editColor = note.color || 'default';
    editDialogRef.showModal();
  }

  async function closeEdit() {
    if (savingDraft) return;

    const note = editingNote;
    if (!note) {
      editDialogRef.close();
      return;
    }

    const title = editTitle;
    const content = editContent;
    const color = editColor;
    const hasContent = title.trim().length > 0 || content.trim().length > 0;
    const changed = title !== (note.title ?? '') || content !== note.content || color !== (note.color || 'default');

    // Solo los borradores se guardan al cerrar; las notas publicadas
    // solo cambian al presionar "Guardar cambios"
    const willSave = !!note.draft && hasContent && changed;

    if (willSave) {
      savingDraft = true;
      const ok = await persistDraft({ noteId: note.id, title, content, color });
      savingDraft = false;
      // si falla, se queda abierto para no perder lo escrito
      if (!ok) return;
    }

    editDialogRef.close();
    editingNote = null;
    if (willSave) await invalidateAll();
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

  let draftNotes = $derived(
    data.notes
      .filter(n => n.draft)
      .sort((a, b) => sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  );

  let activeNotes = $derived(
    data.notes
      .filter(n => !n.completed && !n.draft)
      .sort((a, b) => sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  );
  let completedNotes = $derived(
    data.notes
      .filter(n => n.completed && !n.draft)
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
    oncancel={(e) => { e.preventDefault(); closeModal(); }}
    onclick={(e) => isBackdropClick(e, dialogRef) && closeModal()}
    class="fixed inset-0 m-auto max-w-[440px] w-full p-7 border-none rounded-[var(--nudo-radius-lg)] bg-nudo-bg shadow-2xl backdrop:bg-black/40"
  >
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Crear nueva nota</h2>
      <button onclick={closeModal} class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all" aria-label="Cerrar">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>

    <form method="POST" action="?/createNote" class="flex flex-col gap-4"
      onkeydown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); e.currentTarget.requestSubmit(); } }}>
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Título</span>
        <input type="text" name="title" bind:value={newTitle} placeholder="Título de la nota..."
          class="border border-nudo-border rounded-[var(--nudo-radius-md)] px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg font-[inherit] focus:outline-none focus:ring-2 focus:ring-nudo-accent focus:border-nudo-accent" />
      </label>
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Contenido</span>
        <textarea name="content" required bind:value={newContent} placeholder="Escribe tu nota..."
          class="border border-nudo-border rounded-[var(--nudo-radius-md)] px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg font-[inherit] resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-nudo-accent focus:border-nudo-accent"></textarea>
      </label>
      <div class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Color</span>
        <div class="flex gap-2 flex-wrap">
          {#each colors as color}
            <button type="button" onclick={() => newColor = color.name}
              class="w-7 h-7 rounded-full cursor-pointer border-2 border-transparent shadow-[inset_0_0_0_1px_var(--nudo-border)] transition-all hover:scale-110
                {newColor === color.name ? 'border-nudo-accent shadow-[0_0_0_2px_var(--nudo-bg),0_0_0_4px_var(--nudo-accent)]' : ''}"
              style="background-color: {color.bg}"
              aria-label={color.name}
              aria-pressed={newColor === color.name}
            ></button>
          {/each}
        </div>
        <input type="hidden" name="color" value={newColor} />
      </div>
      <Button type="submit">Agregar nota</Button>
    </form>
  </dialog>

  <!-- Modal editar nota -->
  <dialog
    bind:this={editDialogRef}
    oncancel={(e) => { e.preventDefault(); closeEdit(); }}
    onclick={(e) => isBackdropClick(e, editDialogRef) && closeEdit()}
    class="fixed inset-0 m-auto max-w-[440px] w-full p-7 border-none rounded-[var(--nudo-radius-lg)] bg-nudo-bg shadow-2xl backdrop:bg-black/40"
  >
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Editar nota</h2>
      <button onclick={closeEdit} class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all" aria-label="Cerrar">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>

    {#if editingNote}
      <form method="POST" action="?/editNote" use:enhance={handleEditEnhance}
        onkeydown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); e.currentTarget.requestSubmit(); } }}
        class="flex flex-col gap-4">
        <input type="hidden" name="noteId" value={editingNote.id} />
        <label class="flex flex-col gap-2">
          <span class="text-sm font-semibold text-nudo-text-secondary">Título</span>
          <input type="text" name="title" bind:value={editTitle} placeholder="Título de la nota..."
            class="border border-nudo-border rounded-[var(--nudo-radius-md)] px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg font-[inherit] focus:outline-none focus:ring-2 focus:ring-nudo-accent focus:border-nudo-accent" />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-sm font-semibold text-nudo-text-secondary">Contenido</span>
          <textarea name="content" rows="6" required bind:value={editContent}
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
        {#if editingNote.draft}
          <p class="m-0 flex items-center gap-1.5 text-[12px] text-nudo-text-tertiary">
            <i class="ri-draft-line" aria-hidden="true"></i>
            Se guardará como borrador al cerrar · <span class="font-semibold">⌘/Ctrl + Enter</span> para publicar
          </p>
        {/if}
        <Button type="submit">Guardar cambios</Button>
      </form>
    {/if}
  </dialog>

  <!-- Notes List -->

  <div class="flex flex-col gap-6">
    {#if activeNotes.length === 0 && completedNotes.length === 0 && draftNotes.length === 0}
      <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-[var(--nudo-radius-lg)]">
        <i class="ri-sticky-note-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
        <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aún no hay notas en este proyecto</p>
        <p class="m-0 text-[14px] text-nudo-text-secondary">Crea tu primera nota con el botón de arriba.</p>
      </div>
    {:else}
      <div class="{viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col gap-2'}">
        {#each draftNotes as note}
          <div
            data-highlight-id={note.id}
            onclick={() => openEdit(note)}
            class="draft-card note-card relative flex items-start justify-between gap-3 px-4 py-4 rounded-[var(--nudo-radius-lg)] cursor-pointer transition-all hover:brightness-[0.97]
              {viewMode === 'grid' ? 'flex-col min-h-[150px]' : ''}"
            style={getNoteStyle(note.color)}
          >
            <div class="flex-1 min-w-0 pr-6">
              <span class="draft-chip inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide mb-1.5 px-2 py-0.5 rounded-full">
                <i class="ri-draft-line" aria-hidden="true"></i> Borrador
              </span>
              {#if note.title}
                <h3 class="m-0 mb-1 text-[15px] font-bold break-words">{note.title}</h3>
              {/if}
              {#if note.content}
                <p class="text-base leading-relaxed m-0 whitespace-pre-wrap break-words
                  {viewMode === 'grid' ? 'line-clamp-5' : ''}">{note.content}</p>
              {/if}
            </div>
            <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}
              class="absolute top-2.5 right-2.5 opacity-70 hover:opacity-100">
              <input type="hidden" name="noteId" value={note.id} />
              <button type="submit" class="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-transparent border-none cursor-pointer text-[16px] text-nudo-text-tertiary hover:bg-nudo-hover-soft hover:text-nudo-danger transition-all" aria-label="Descartar borrador" title="Descartar borrador">
                <i class="ri-close-line" aria-hidden="true"></i>
              </button>
            </form>
          </div>
        {/each}
        {#each activeNotes as note}
          <div
            data-highlight-id={note.id}
            onclick={() => openEdit(note)}
            onanimationend={() => (justPublishedId = null)}
            class="note-card flex items-start justify-between gap-3 px-4 py-4 rounded-[var(--nudo-radius-lg)] cursor-pointer transition-all hover:brightness-[0.97]
              {justPublishedId === note.id ? 'just-published' : ''}
              {viewMode === 'grid' ? 'flex-col min-h-[150px]' : ''}"
            style={getNoteStyle(note.color)}
          >
            <div class="flex-1 min-w-0">
              {#if note.title}
                <h3 class="m-0 mb-1 text-[15px] font-bold break-words">{note.title}</h3>
              {/if}
              <p class="text-base leading-relaxed m-0 whitespace-pre-wrap break-words
                {viewMode === 'grid' ? 'line-clamp-5' : ''}">{note.content}</p>
            </div>
            <div class="flex items-center gap-1 shrink-0 opacity-70
              {viewMode === 'grid' ? 'self-end mt-auto pt-2.5' : ''}">
              <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-nudo-hover-soft hover:text-nudo-text-primary transition-all" aria-label="Marcar como completada" title="Marcar como completada">
                  <i class="ri-checkbox-blank-circle-line" aria-hidden="true"></i>
                </button>
              </form>
              <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-nudo-hover-soft hover:text-nudo-danger transition-all" aria-label="Eliminar nota" title="Eliminar nota">
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
                class="note-card flex items-start justify-between gap-3 px-4 py-4 rounded-[var(--nudo-radius-lg)] cursor-pointer opacity-60 hover:opacity-85 transition-all
                  {viewMode === 'grid' ? 'flex-col min-h-[150px]' : ''}"
                style={getNoteStyle(note.color)}
              >
                <div class="flex-1 min-w-0">
                  {#if note.title}
                    <h3 class="m-0 mb-1 text-[15px] font-bold break-words line-through">{note.title}</h3>
                  {/if}
                  <p class="text-base leading-relaxed m-0 whitespace-pre-wrap break-words line-through
                    {viewMode === 'grid' ? 'line-clamp-5' : ''}">{note.content}</p>
                </div>
                <div class="flex items-center gap-1 shrink-0 opacity-70
                  {viewMode === 'grid' ? 'self-end mt-auto pt-2.5' : ''}">
                  <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-success hover:bg-nudo-hover-soft transition-all" aria-label="Marcar como pendiente" title="Marcar como pendiente">
                      <i class="ri-checkbox-circle-fill" aria-hidden="true"></i>
                    </button>
                  </form>
                  <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" class="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-transparent border-none cursor-pointer text-[17px] text-nudo-text-tertiary hover:bg-nudo-hover-soft hover:text-nudo-danger transition-all" aria-label="Eliminar nota" title="Eliminar nota">
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

<style>
  .draft-card {
    border: 2px dashed color-mix(in srgb, currentColor 50%, transparent);
  }

  .draft-chip {
    background: color-mix(in srgb, currentColor 15%, transparent);
    color: inherit;
  }

  .just-published {
    position: relative;
    animation: publish-pop 480ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .just-published::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px dashed color-mix(in srgb, currentColor 55%, transparent);
    border-radius: inherit;
    pointer-events: none;
    animation: draft-fade 480ms ease-out forwards;
  }

  @keyframes publish-pop {
    0% {
      transform: scale(1.012);
      box-shadow: inset 0 0 0 0 transparent;
    }
    35% {
      box-shadow: inset 0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);
    }
    100% {
      transform: scale(1);
      box-shadow: inset 0 0 0 0 transparent;
    }
  }

  @keyframes draft-fade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .just-published,
    .just-published::after {
      animation: none;
    }

    .just-published::after {
      opacity: 0;
    }
  }
</style>
