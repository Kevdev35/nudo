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
    { name: 'default', bg: 'var(--surface-container-high)' },
    { name: 'amarillo', bg: '#fef9c3' },
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

<section>
  <div class="flex justify-between mx-5">
    <h1 class="font-bold text-7xl">Notas de {data.project.name}</h1>

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
        <i class="ri-add-line text-lg"></i> Nueva nota
      </Button>
    </div>
  </div>

  <!-- Modal crear nota -->
  <dialog
    bind:this={dialogRef}
    onclick={(e) => e.target === dialogRef && closeModal()}
    class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Crear nueva nota</h2>
      <button onclick={closeModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl" aria-label="Cerrar"><i class="ri-close-line"></i></button>
    </div>

    <form method="POST" action="?/createNote" class="mt-4 flex flex-col gap-4">
      <label class="flex flex-col gap-2">
        <span>Nueva nota</span>
        <textarea name="content" class="rounded-3xl border p-5" required placeholder="Escribe tu nota..."></textarea>
      </label>
      <div class="flex flex-col gap-2">
        <span>Color</span>
        <div class="flex gap-2">
          {#each colors as color}
            <button type="button" onclick={() => editColor = color.name}
              class="w-8 h-8 rounded-full cursor-pointer border-2 transition-transform hover:scale-110"
              class:border-black={editColor === color.name}
              class:border-transparent={editColor !== color.name}
              style="background-color: {color.bg}"
              aria-label={color.name}
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
    class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Editar nota</h2>
      <button onclick={closeEdit} class="cursor-pointer text-gray-500 hover:text-black text-2xl" aria-label="Cerrar"><i class="ri-close-line"></i></button>
    </div>

    {#if editingNote}
      <form method="POST" action="?/editNote" class="mt-4 flex flex-col gap-4">
        <input type="hidden" name="noteId" value={editingNote.id} />
        <label class="flex flex-col gap-2">
          <span>Contenido</span>
          <textarea name="content" class="rounded-3xl border p-5" rows="6" required>{editContent}</textarea>
        </label>
        <div class="flex flex-col gap-2">
          <span>Color</span>
          <div class="flex gap-2">
            {#each colors as color}
              <button type="button" onclick={() => editColor = color.name}
                class="w-8 h-8 rounded-full cursor-pointer border-2 transition-transform hover:scale-110"
                class:border-black={editColor === color.name}
                class:border-transparent={editColor !== color.name}
                style="background-color: {color.bg}"
                aria-label={color.name}
              ></button>
            {/each}
          </div>
          <input type="hidden" name="color" value={editColor} />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    {/if}
  </dialog>

  <div class="m-6 ">
    {#if completedNotes.length > 0}
        <div class="mx-3 mt-8 mb-2">
          <button
            onclick={() => showCompleted = !showCompleted}
            class=" mx-3 cursor-pointer flex items-center gap-5 text-lg font-bold text-gray-600 hover:text-gray-700"
          >
            <i class="ri-arrow-down-s-line text-lg transition-transform {showCompleted ? 'rotate-180' : ''}"></i>
            Completadas ({completedNotes.length})
          </button>

          {#if showCompleted}
            <div class="{viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col gap-2'}">
              {#each completedNotes as note}
                <div
                  data-highlight-id={note.id}
                  onclick={() => openEdit(note)}
                  class="px-4 py-6 rounded-3xl flex justify-between items-start gap-3 opacity-60 cursor-pointer hover:opacity-80 transition-opacity {viewMode === 'grid' ? 'min-h-[160px]' : ''}"
                  style="background-color: {getNoteBg(note.color)}"
                >
                  <p class="text-lg flex-1 {viewMode === 'grid' ? 'line-clamp-4' : ''} line-through">{note.content}</p>
                  <div class="flex items-center gap-2">
                    <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                      <input type="hidden" name="noteId" value={note.id} />
                      <button type="submit" class="cursor-pointer text-green-600 hover:text-gray-400 text-xl" aria-label="Marcar como pendiente" title="Marcar como pendiente">
                        <i class="ri-checkbox-circle-fill"></i>
                      </button>
                    </form>
                    <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                      <input type="hidden" name="noteId" value={note.id} />
                      <button type="submit" class="cursor-pointer text-gray-500 hover:text-red-600 text-xl" aria-label="Eliminar nota">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </form>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {#if activeNotes.length === 0 && completedNotes.length === 0}
      <p>Aún no hay notas en este proyecto.</p>
    {:else}
      <div class="{viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3 mx-3' : 'flex flex-col gap-2 mx-3'}">
        {#each activeNotes as note}
          <div
            data-highlight-id={note.id}
            onclick={() => openEdit(note)}
            class="px-4 py-6 rounded-3xl flex justify-between items-start gap-3 cursor-pointer hover:shadow-md transition-shadow {viewMode === 'grid' ? 'min-h-[160px]' : ''}"
            style="background-color: {getNoteBg(note.color)}"
          >
            <p class="text-lg flex-1 {viewMode === 'grid' ? 'line-clamp-4' : ''}">{note.content}</p>
            <div class="flex items-center gap-2">
              <form method="POST" action="?/toggleComplete" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="cursor-pointer text-gray-400 hover:text-green-600 text-xl" aria-label="Marcar como completada" title="Marcar como completada">
                  <i class="ri-checkbox-blank-circle-line"></i>
                </button>
              </form>
              <form method="POST" action="?/deleteNote" onclick={(e) => e.stopPropagation()}>
                <input type="hidden" name="noteId" value={note.id} />
                <button type="submit" class="cursor-pointer text-gray-500 hover:text-red-600 text-xl" aria-label="Eliminar nota">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
