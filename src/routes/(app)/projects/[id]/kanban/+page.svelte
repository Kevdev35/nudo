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

  function openBoardModal() {
    dialogRef.showModal()
  }

  function closeModal() {
    dialogRef.close()
  }

  function openListModal() {
    dialogRefList.showModal()
  }

  function closeListModal() {
    dialogRefList.close()
  }

  function openCardModal(listId: string) {
    activeListId = listId;
    dialogRefCard.showModal()
  }

  function closeCardModal() {
    dialogRefCard.close()
  }

  function openEditCard(card: KanbanCard) {
    editingCard = card;
    editTitle = card.title;
    editDescription = card.description ?? '';
    dialogRefEdit.showModal();
  }

  function closeEditCard() {
    dialogRefEdit.close();
    editingCard = null;
  }

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

    fetch('?/moveCard', {
      method: 'POST',
      body: formData,
      headers: { 'x-sveltekit-action': 'true' }
    });
  }

  function handleCardClick(e: MouseEvent, card: KanbanCard) {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle')) return;
    openEditCard(card);
  }
</script>

<section>
  {#if !data.board}
    <div class="flex flex-col items-center justify-center py-20 gap-4">
      <p class="text-2xl text-gray-500">Aun no hay tablero para este proyecto.</p>
      <p class="text-gray-400">Crea un tablero para organizar tus tareas.</p>
      <Button onclick={openBoardModal}>
        <i class="ri-add-line text-lg"></i> Crear tablero
      </Button>
    </div>
  {:else}
    <div class="flex justify-between mx-5 mb-6">
      <h1 class="font-bold text-7xl">{data.board.name}</h1>

      <Button onclick={openListModal}>
        <i class="ri-add-line text-lg"></i> Nueva columna
      </Button>
    </div>

    <div class="flex gap-5 px-5 overflow-x-auto pb-5">
      {#each data.lists as list}
        <div
          use:droppable={{ container: list.id, callbacks: { onDrop: handleDrop } }}
          class="min-w-[300px] max-w-[300px] bg-[#e6e6e6] rounded-3xl p-4 flex flex-col gap-3"
        >
          <div class="flex justify-between items-center px-2">
            <h2 class="font-bold text-2xl">{list.name}</h2>
            <button
              onclick={() => openCardModal(list.id)}
              class="cursor-pointer text-gray-500 hover:text-black text-xl"
              aria-label="Agregar tarjeta"
            >
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
                  class="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow {card.completed ? 'opacity-60' : ''}"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1">
                      <p class="font-bold text-xl {card.completed ? 'line-through' : ''}">{card.title}</p>
                      {#if card.description}
                        <p class="text-gray-500 text-lg mt-1">{card.description}</p>
                      {/if}
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <form method="POST" action="?/toggleCardComplete" onclick={(e) => e.stopPropagation()}>
                        <input type="hidden" name="cardId" value={card.id} />
                        <button type="submit" class="cursor-pointer text-lg {card.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}" aria-label={card.completed ? 'Marcar como pendiente' : 'Marcar como completada'}>
                          <i class="{card.completed ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}"></i>
                        </button>
                      </form>
                      <span class="drag-handle cursor-grab text-gray-400 hover:text-gray-600 text-lg">
                        <i class="ri-draggable"></i>
                      </span>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <p class="text-gray-400 text-sm px-2">Sin tarjetas</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- Modal: Crear tablero -->
<dialog
  bind:this={dialogRef}
  onclick={(e) => e.target === dialogRef && closeModal()}
  class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
>
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold">Crear tablero</h2>
    <button onclick={closeModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl" aria-label="Cerrar"><i class="ri-close-line"></i></button>
  </div>

  <form method="POST" action="?/createBoard" class="mt-4 flex flex-col gap-4">
    <label class="flex flex-col gap-2">
      <span>Nombre del tablero</span>
      <input name="name" type="text" required class="rounded-3xl border p-5" placeholder="ej. Tablero principal" />
    </label>
    <Button type="submit">Crear tablero</Button>
  </form>
</dialog>

<!-- Modal: Crear columna -->
<dialog
  bind:this={dialogRefList}
  onclick={(e) => e.target === dialogRefList && closeListModal()}
  class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
>
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold">Nueva columna</h2>
    <button onclick={closeListModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl" aria-label="Cerrar"><i class="ri-close-line"></i></button>
  </div>

  <form method="POST" action="?/createList" class="mt-4 flex flex-col gap-4">
    <input type="hidden" name="boardId" value={data.board?.id} />
    <label class="flex flex-col gap-2">
      <span>Nombre de la columna</span>
      <input name="name" type="text" required class="rounded-3xl border p-5" placeholder="ej. Por hacer" />
    </label>
    <Button type="submit">Crear columna</Button>
  </form>
</dialog>

<!-- Modal: Crear tarjeta -->
<dialog
  bind:this={dialogRefCard}
  onclick={(e) => e.target === dialogRefCard && closeCardModal()}
  class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
>
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold">Nueva tarjeta</h2>
    <button onclick={closeCardModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl" aria-label="Cerrar"><i class="ri-close-line"></i></button>
  </div>

  <form method="POST" action="?/createCard" class="mt-4 flex flex-col gap-4">
    <input type="hidden" name="listId" value={activeListId} />
    <label class="flex flex-col gap-2">
      <span>Titulo</span>
      <input name="title" type="text" required class="rounded-3xl border p-5" placeholder="Titulo de la tarjeta" />
    </label>
    <label class="flex flex-col gap-2">
      <span>Descripcion (opcional)</span>
      <textarea name="description" class="rounded-3xl border p-5" placeholder="Descripcion de la tarjeta..."></textarea>
    </label>
    <Button type="submit">Crear tarjeta</Button>
  </form>
</dialog>

<!-- Modal: Editar tarjeta -->
<dialog
  bind:this={dialogRefEdit}
  onclick={(e) => e.target === dialogRefEdit && closeEditCard()}
  class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
>
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold">Editar tarjeta</h2>
    <button onclick={closeEditCard} class="cursor-pointer text-gray-500 hover:text-black text-2xl" aria-label="Cerrar"><i class="ri-close-line"></i></button>
  </div>

  {#if editingCard}
    <form method="POST" action="?/updateCard" class="mt-4 flex flex-col gap-4">
      <input type="hidden" name="cardId" value={editingCard.id} />
      <label class="flex flex-col gap-2">
        <span>Titulo</span>
        <input name="title" type="text" required class="rounded-3xl border p-5" value={editTitle} />
      </label>
      <label class="flex flex-col gap-2">
        <span>Descripcion</span>
        <textarea name="description" class="rounded-3xl border p-5" rows="4">{editDescription}</textarea>
      </label>
      <div class="flex gap-3 items-center">
        <Button type="submit">Guardar cambios</Button>
        <Button type="button" onclick={closeEditCard}>Cancelar</Button>
      </div>
    </form>

    <div class="flex justify-between items-center mt-4 pt-4 border-t">
      <form method="POST" action="?/toggleCardComplete">
        <input type="hidden" name="cardId" value={editingCard.id} />
        <button type="submit" class="cursor-pointer flex items-center gap-2 text-sm {editingCard.completed ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-green-600'}">
          <i class="{editingCard.completed ? 'ri-checkbox-circle-fill text-lg' : 'ri-checkbox-blank-circle-line text-lg'}"></i>
          {editingCard.completed ? 'Completada' : 'Marcar como completada'}
        </button>
      </form>

      <form method="POST" action="?/deleteCard">
        <input type="hidden" name="cardId" value={editingCard.id} />
        <button type="submit" class="cursor-pointer flex items-center gap-2 text-sm text-gray-500 hover:text-red-600">
          <i class="ri-delete-bin-line text-lg"></i> Eliminar tarjeta
        </button>
      </form>
    </div>
  {/if}
</dialog>
