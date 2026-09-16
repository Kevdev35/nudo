<script lang="ts">
  import type { PageData } from './$types';
  import type { KanbanCard } from '@entities/kanban-card-entity';
  let { data }: { data: PageData } = $props();

  import Button from "@components/Button.svelte"
  import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';

  let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement
  let dialogRefList: HTMLDialogElement = $state() as HTMLDialogElement
  let dialogRefCard: HTMLDialogElement = $state() as HTMLDialogElement
  let dialogRefEdit: HTMLDialogElement = $state() as HTMLDialogElement

  let activeListId = $state('');
  let editingCard = $state<KanbanCard | null>(null);
  let editTitle = $state('');
  let editDescription = $state('');

  let cardsByList = $state<Record<string, KanbanCard[]>>(data.cardsByList as Record<string, KanbanCard[]>);

  function openBoardModal() { dialogRef.showModal() }
  function closeModal() { dialogRef.close() }
  function openListModal() { dialogRefList.showModal() }
  function closeListModal() { dialogRefList.close() }
  function openCardModal(listId: string) { activeListId = listId; dialogRefCard.showModal() }
  function closeCardModal() { dialogRefCard.close() }

  function openEditCard(card: KanbanCard) {
    editingCard = card;
    editTitle = card.title;
    editDescription = card.description ?? '';
    dialogRefEdit.showModal();
  }
  function closeEditCard() { dialogRefEdit.close(); editingCard = null; }

  function handleDrop(state: DragDropState<{ id: string }>) {
    const { draggedItem, targetContainer } = state;
    if (!targetContainer || !draggedItem) return;
    const cardId = draggedItem.id;
    const targetListId = targetContainer as string;
    const sourceListId = Object.keys(cardsByList).find(listId =>
      cardsByList[listId]?.some((c: { id: string }) => c.id === cardId)
    );
    if (!sourceListId || sourceListId === targetListId) return;
    const card = cardsByList[sourceListId]?.find((c: { id: string }) => c.id === cardId);
    if (!card) return;
    cardsByList[sourceListId] = cardsByList[sourceListId]?.filter((c: { id: string }) => c.id !== cardId) ?? [];
    const targetCards = cardsByList[targetListId] ?? [];
    cardsByList[targetListId] = [...targetCards, card];
    const formData = new FormData();
    formData.append('cardId', cardId);
    formData.append('targetListId', targetListId);
    formData.append('newOrder', String(cardsByList[targetListId]?.length ?? 1));
    fetch('?/moveCard', { method: 'POST', body: formData, headers: { 'x-sveltekit-action': 'true' } });
  }

  function handleCardClick(e: MouseEvent, card: KanbanCard) {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle')) return;
    openEditCard(card);
  }
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
  {#if !data.board}
    <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
      <i class="ri-layout-column-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
      <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aun no hay tablero para este proyecto.</p>
      <p class="m-0 text-[14px] text-nudo-text-secondary">Crea un tablero para organizar tus tareas.</p>
      <Button onclick={openBoardModal}>
        <i class="ri-add-line" aria-hidden="true"></i> Crear tablero
      </Button>
    </div>
  {:else}
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
        {data.board.name}
      </h1>
      <Button onclick={openListModal}>
        <i class="ri-add-line" aria-hidden="true"></i> Nueva columna
      </Button>
    </div>

    <div class="flex gap-5 overflow-x-auto pb-4">
      {#each data.lists as list}
        <div
          use:droppable={{ container: list.id, callbacks: { onDrop: handleDrop } }}
          class="min-w-[300px] max-w-[300px] bg-nudo-surface rounded-3xl p-4 flex flex-col gap-3"
        >
          <div class="flex justify-between items-center px-2">
            <h2 class="text-lg font-bold text-nudo-text-primary m-0">{list.name}</h2>
            <button onclick={() => openCardModal(list.id)} class="icon-btn text-nudo-text-tertiary hover:text-nudo-text-primary" aria-label="Agregar tarjeta">
              <i class="ri-add-circle-line"></i>
            </button>
          </div>

          <div class="flex flex-col gap-2 min-h-[60px]">
            {#if cardsByList[list.id]?.length > 0}
              {#each cardsByList[list.id] as card (card.id)}
                <div
                  data-highlight-id={card.id}
                  use:draggable={{ container: list.id, dragData: card, handle: '.drag-handle' }}
                  onclick={(e) => handleCardClick(e, card)}
                  class="bg-nudo-bg border border-nudo-border rounded-2xl p-4 cursor-pointer hover:shadow-sm transition-all duration-150 {card.completed ? 'opacity-60' : ''}"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-base text-nudo-text-primary m-0 {card.completed ? 'line-through' : ''}">{card.title}</p>
                      {#if card.description}
                        <p class="text-sm text-nudo-text-secondary mt-1 m-0">{card.description}</p>
                      {/if}
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <form method="POST" action="?/toggleCardComplete" onclick={(e) => e.stopPropagation()}>
                        <input type="hidden" name="cardId" value={card.id} />
                        <button type="submit" class="icon-btn w-8 h-8 text-base {card.completed ? 'text-green-600' : 'text-nudo-text-tertiary hover:text-green-600'}" aria-label={card.completed ? 'Marcar como pendiente' : 'Marcar como completada'}>
                          <i class="{card.completed ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}"></i>
                        </button>
                      </form>
                      <span class="drag-handle cursor-grab icon-btn w-8 h-8 text-base text-nudo-text-tertiary hover:text-nudo-text-secondary">
                        <i class="ri-draggable"></i>
                      </span>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <p class="text-sm text-nudo-text-tertiary px-2 m-0">Sin tarjetas</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- Modal: Crear tablero -->
<dialog bind:this={dialogRef} onclick={(e) => e.target === dialogRef && closeModal()}
  class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40">
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Crear tablero</h2>
    <button onclick={closeModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
  </div>
  <form method="POST" action="?/createBoard" class="flex flex-col gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-nudo-text-secondary">Nombre del tablero</span>
      <input name="name" type="text" required placeholder="ej. Tablero principal"
        class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
    </label>
    <Button type="submit">Crear tablero</Button>
  </form>
</dialog>

<!-- Modal: Crear columna -->
<dialog bind:this={dialogRefList} onclick={(e) => e.target === dialogRefList && closeListModal()}
  class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40">
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Nueva columna</h2>
    <button onclick={closeListModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
  </div>
  <form method="POST" action="?/createList" class="flex flex-col gap-4">
    <input type="hidden" name="boardId" value={data.board?.id} />
    <label class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-nudo-text-secondary">Nombre de la columna</span>
      <input name="name" type="text" required placeholder="ej. Por hacer"
        class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
    </label>
    <Button type="submit">Crear columna</Button>
  </form>
</dialog>

<!-- Modal: Crear tarjeta -->
<dialog bind:this={dialogRefCard} onclick={(e) => e.target === dialogRefCard && closeCardModal()}
  class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40">
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Nueva tarjeta</h2>
    <button onclick={closeCardModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
  </div>
  <form method="POST" action="?/createCard" class="flex flex-col gap-4">
    <input type="hidden" name="listId" value={activeListId} />
    <label class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-nudo-text-secondary">Título</span>
      <input name="title" type="text" required placeholder="Titulo de la tarjeta"
        class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
    </label>
    <label class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-nudo-text-secondary">Descripción (opcional)</span>
      <textarea name="description" rows="3" placeholder="Descripcion de la tarjeta..."
        class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent resize-none"></textarea>
    </label>
    <Button type="submit">Crear tarjeta</Button>
  </form>
</dialog>

<!-- Modal: Editar tarjeta -->
<dialog bind:this={dialogRefEdit} onclick={(e) => e.target === dialogRefEdit && closeEditCard()}
  class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40">
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Editar tarjeta</h2>
    <button onclick={closeEditCard} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
  </div>
  {#if editingCard}
    <form method="POST" action="?/updateCard" class="flex flex-col gap-4">
      <input type="hidden" name="cardId" value={editingCard.id} />
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Título</span>
        <input name="title" type="text" required value={editTitle}
          class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
      </label>
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Descripción</span>
        <textarea name="description" rows="4"
          class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent resize-none">{editDescription}</textarea>
      </label>
      <div class="flex gap-3 items-center">
        <Button type="submit">Guardar cambios</Button>
        <Button type="button" onclick={closeEditCard}>Cancelar</Button>
      </div>
    </form>

    <div class="flex justify-between items-center mt-5 pt-4 border-t border-nudo-border">
      <form method="POST" action="?/toggleCardComplete">
        <input type="hidden" name="cardId" value={editingCard.id} />
        <button type="submit" class="flex items-center gap-2 text-sm cursor-pointer bg-transparent border-none font-inherit {editingCard.completed ? 'text-green-600 font-bold' : 'text-nudo-text-tertiary hover:text-green-600'}">
          <i class="text-base {editingCard.completed ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}"></i>
          {editingCard.completed ? 'Completada' : 'Marcar como completada'}
        </button>
      </form>
      <form method="POST" action="?/deleteCard">
        <input type="hidden" name="cardId" value={editingCard.id} />
        <button type="submit" class="flex items-center gap-2 text-sm text-nudo-text-tertiary hover:text-red-600 cursor-pointer bg-transparent border-none font-inherit">
          <i class="ri-delete-bin-line text-base"></i> Eliminar tarjeta
        </button>
      </form>
    </div>
  {/if}
</dialog>
