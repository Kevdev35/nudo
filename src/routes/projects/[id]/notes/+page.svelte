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
    { name: 'default', bg: 'var(--nudo-surface)' },
    { name: 'amarillo', bg: '#fef3c7' },
    { name: 'rosa', bg: '#fce7f3' },
    { name: 'azul', bg: '#dbeafe' },
    { name: 'verde', bg: '#dcfce7' },
    { name: 'morado', bg: '#f3e8ff' },
    { name: 'naranja', bg: '#ffedd5' },
  ];

  function getNoteBg(color: string | null): string {
    const found = colors.find(c => c.name === color);
    return found ? found.bg : colors[0].bg;
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

<section class="page-notes">
  <div class="page-toolbar">
    <h1>Notas de {data.project.name}</h1>

    <div class="toolbar-actions">
      <button onclick={toggleSort} class="icon-btn" aria-label={sortOrder === 'desc' ? 'Ordenar del más antiguo al más reciente' : 'Ordenar del más reciente al más antiguo'} title="Cambiar orden">
        {#if sortOrder === 'desc'}
          <i class="ri-sort-desc" aria-hidden="true"></i>
        {:else}
          <i class="ri-sort-asc" aria-hidden="true"></i>
        {/if}
      </button>
      <button onclick={toggleView} class="icon-btn" aria-label={viewMode === 'list' ? 'Cambiar a vista de cuadrícula' : 'Cambiar a vista de lista'} title="Cambiar vista">
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
    class="nudo-dialog"
  >
    <div class="dialog-header">
      <h2>Crear nueva nota</h2>
      <button onclick={closeModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
    </div>

    <form method="POST" action="?/createNote" class="dialog-form">
      <label class="field">
        <span>Nueva nota</span>
        <textarea name="content" required placeholder="Escribe tu nota..."></textarea>
      </label>
      <div class="field">
        <span>Color</span>
        <div class="color-row">
          {#each colors as color}
            <button type="button" onclick={() => editColor = color.name}
              class="color-swatch"
              class:selected={editColor === color.name}
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
    class="nudo-dialog"
  >
    <div class="dialog-header">
      <h2>Editar nota</h2>
      <button onclick={closeEdit} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
    </div>

    {#if editingNote}
      <form method="POST" action="?/editNote" class="dialog-form">
        <input type="hidden" name="noteId" value={editingNote.id} />
        <label class="field">
          <span>Contenido</span>
          <textarea name="content" rows="6" required>{editContent}</textarea>
        </label>
        <div class="field">
          <span>Color</span>
          <div class="color-row">
            {#each colors as color}
              <button type="button" onclick={() => editColor = color.name}
                class="color-swatch"
                class:selected={editColor === color.name}
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

  <div class="notes-body">
    {#if activeNotes.length === 0 && completedNotes.length === 0}
      <div class="empty-state">
        <i class="ri-sticky-note-line" aria-hidden="true"></i>
        <p>Aún no hay notas en este proyecto</p>
        <p class="empty-sub">Crea tu primera nota con el botón de arriba.</p>
      </div>
    {:else}
      <div class={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}>
        {#each activeNotes as note}
          <div
            data-highlight-id={note.id}
            onclick={() => openEdit(note)}
            class="note-card {viewMode === 'grid' ? 'note-card-grid' : ''}"
            style="background-color: {getNoteBg(note.color)}"
          >
            <p class="note-text {viewMode === 'grid' ? 'clamp' : ''}">{note.content}</p>
            <div class="note-actions">
              <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="note-action" aria-label="Marcar como completada" title="Marcar como completada">
                  <i class="ri-checkbox-blank-circle-line" aria-hidden="true"></i>
                </button>
              </form>
              <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="note-action danger" aria-label="Eliminar nota" title="Eliminar nota">
                  <i class="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if completedNotes.length > 0}
      <div class="completed-section">
        <button
          onclick={() => showCompleted = !showCompleted}
          class="completed-toggle"
          aria-expanded={showCompleted}
        >
          <i class="ri-arrow-down-s-line {showCompleted ? 'rotated' : ''}" aria-hidden="true"></i>
          Completadas ({completedNotes.length})
        </button>

        {#if showCompleted}
          <div class={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}>
            {#each completedNotes as note}
              <div
                data-highlight-id={note.id}
                onclick={() => openEdit(note)}
                class="note-card note-card-done {viewMode === 'grid' ? 'note-card-grid' : ''}"
                style="background-color: {getNoteBg(note.color)}"
              >
                <p class="note-text {viewMode === 'grid' ? 'clamp' : ''} done">{note.content}</p>
                <div class="note-actions">
                  <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" class="note-action done" aria-label="Marcar como pendiente" title="Marcar como pendiente">
                      <i class="ri-checkbox-circle-fill" aria-hidden="true"></i>
                    </button>
                  </form>
                  <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="noteId" value={note.id} />
                    <button type="submit" class="note-action danger" aria-label="Eliminar nota" title="Eliminar nota">
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
  .page-notes {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 4px 32px 48px;
  }

  .page-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .page-toolbar h1 {
    font-size: clamp(26px, 3vw, 34px);
    font-weight: 800;
    color: var(--nudo-text-primary);
    margin: 0;
    letter-spacing: -0.01em;
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: none;
    border: none;
    color: var(--nudo-text-secondary);
    cursor: pointer;
    font-size: 18px;
    transition: background .15s ease, color .15s ease;
  }
  .icon-btn:hover { background: var(--nudo-surface); color: var(--nudo-text-primary); }

  /* ---------- Dialogs ---------- */
  .nudo-dialog {
    position: fixed;
    inset: 0;
    margin: auto;
    max-width: 440px;
    width: 100%;
    padding: 28px 30px;
    border: none;
    border-radius: var(--nudo-radius-lg);
    background: var(--nudo-bg);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  }
  .nudo-dialog::backdrop { background: rgba(0, 0, 0, 0.4); }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .dialog-header h2 {
    font-size: 21px;
    font-weight: 800;
    color: var(--nudo-text-primary);
    margin: 0;
  }

  .dialog-form { display: flex; flex-direction: column; gap: 16px; }

  .field { display: flex; flex-direction: column; gap: 8px; }
  .field > span { font-size: 14px; font-weight: 600; color: var(--nudo-text-secondary); }

  .field textarea {
    border: 1px solid var(--nudo-border);
    border-radius: var(--nudo-radius-md);
    padding: 14px 16px;
    font-family: inherit;
    font-size: 15px;
    color: var(--nudo-text-primary);
    resize: vertical;
    min-height: 90px;
    background: var(--nudo-bg);
  }
  .field textarea:focus-visible {
    outline: 2px solid var(--nudo-accent);
    outline-offset: 1px;
    border-color: var(--nudo-accent);
  }

  .color-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    box-shadow: inset 0 0 0 1px var(--nudo-border);
    transition: transform .12s ease, box-shadow .12s ease;
  }
  .color-swatch:hover { transform: scale(1.1); }
  .color-swatch.selected {
    border-color: var(--nudo-accent);
    box-shadow: 0 0 0 2px var(--nudo-bg), 0 0 0 4px var(--nudo-accent);
  }

  /* ---------- Notes body ---------- */
  .notes-body { display: flex; flex-direction: column; gap: 24px; }

  .notes-list { display: flex; flex-direction: column; gap: 8px; }
  .notes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  .note-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: var(--nudo-radius-lg);
    cursor: pointer;
    transition: filter .15s ease;
  }
  .note-card:hover { filter: brightness(0.97); }
  .note-card-grid { flex-direction: column; min-height: 150px; }
  .note-card-grid .note-actions { align-self: flex-end; margin-top: auto; padding-top: 10px; }

  .note-card-done { opacity: 0.6; }
  .note-card-done:hover { opacity: 0.85; }

  .note-text {
    flex: 1;
    font-size: 16px;
    line-height: 1.5;
    color: var(--nudo-text-primary);
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .note-text.clamp {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .note-text.done { text-decoration: line-through; }

  .note-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .note-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 17px;
    color: var(--nudo-text-tertiary);
    transition: background .15s ease, color .15s ease;
  }
  .note-action:hover { background: rgba(0, 0, 0, 0.06); color: var(--nudo-text-primary); }
  .note-action.done { color: var(--nudo-success); }
  .note-action.danger:hover { color: #d70015; }

  /* ---------- Completed ---------- */
  .completed-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14.5px;
    font-weight: 700;
    color: var(--nudo-text-secondary);
    padding: 6px 4px;
    margin-bottom: 10px;
  }
  .completed-toggle:hover { color: var(--nudo-text-primary); }
  .completed-toggle i { font-size: 16px; transition: transform .2s ease; }
  .completed-toggle i.rotated { transform: rotate(180deg); }

  /* ---------- Empty state ---------- */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    text-align: center;
    padding: 56px 20px;
    background: var(--nudo-surface);
    border-radius: var(--nudo-radius-lg);
    color: var(--nudo-text-secondary);
  }
  .empty-state i { font-size: 26px; color: var(--nudo-text-tertiary); margin-bottom: 4px; }
  .empty-state p { margin: 0; font-size: 15px; font-weight: 600; color: var(--nudo-text-primary); }
  .empty-sub { font-weight: 400 !important; font-size: 14px !important; color: var(--nudo-text-secondary) !important; }

  @media (prefers-reduced-motion: reduce) {
    .completed-toggle i { transition: none; }
  }

  @media (max-width: 760px) {
    .page-notes { padding-left: 20px; padding-right: 20px; }
    .notes-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .notes-grid { grid-template-columns: 1fr; }
  }
</style>