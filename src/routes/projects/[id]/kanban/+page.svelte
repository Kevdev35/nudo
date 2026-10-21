<script lang="ts">
  import type { PageData } from './$types';
  import type { KanbanCard } from '@entities/kanban-card-entity';
  let { data }: { data: PageData } = $props();

  import Button from "@components/Button.svelte"
  import { isBackdropClick } from '@ui/modal'
  import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';

  let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement
  let dialogRefList: HTMLDialogElement = $state() as HTMLDialogElement
  let dialogRefCard: HTMLDialogElement = $state() as HTMLDialogElement
  let dialogRefEdit: HTMLDialogElement = $state() as HTMLDialogElement

  let activeListId = $state('');
  let editingCard = $state<KanbanCard | null>(null);
  let editTitle = $state('');
  let editDescription = $state('');
  let newCardError = $state('');
  let editCardError = $state('');

  let cardsByList = $state<Record<string, KanbanCard[]>>(data.cardsByList as Record<string, KanbanCard[]>);

  function openBoardModal() { dialogRef.showModal() }
  function closeModal() { dialogRef.close() }
  function openListModal() { dialogRefList.showModal() }
  function closeListModal() { dialogRefList.close() }
  function openCardModal(listId: string) { activeListId = listId; newCardError = ''; dialogRefCard.showModal() }
  function closeCardModal() { dialogRefCard.close() }

  function openEditCard(card: KanbanCard) {
    editingCard = card;
    editTitle = card.title;
    editDescription = card.description ?? '';
    editCardError = '';
    dialogRefEdit.showModal();
  }
  function closeEditCard() { dialogRefEdit.close(); editingCard = null; }

  function hasCardContent(form: HTMLFormElement) {
    const formData = new FormData(form);
    return (
      String(formData.get('title') ?? '').trim().length > 0 ||
      String(formData.get('description') ?? '').trim().length > 0
    );
  }

  function validateNewCard(e: SubmitEvent) {
    if (!hasCardContent(e.currentTarget as HTMLFormElement)) {
      e.preventDefault();
      newCardError = 'Escribí un título o una descripción.';
    } else {
      newCardError = '';
    }
  }

  function validateEditCard(e: SubmitEvent) {
    if (!hasCardContent(e.currentTarget as HTMLFormElement)) {
      e.preventDefault();
      editCardError = 'Escribí un título o una descripción.';
    } else {
      editCardError = '';
    }
  }

  let draggingCardId = $state<string | null>(null);
  let dragIds = $state<string[]>([]);
  let dropTarget = $state<{ listId: string; beforeId: string | null } | null>(null);
  let selectedIds = $state<string[]>([]);

  let pointerDownCardId: string | null = null;
  let pointerStart: { x: number; y: number } | null = null;
  let pointerMoved = false;
  let pointerX = 0;
  let pointerY = 0;
  let nativeDragId: string | null = null;

  function isInteractiveTarget(target: EventTarget | null) {
    return target instanceof Element &&
      !!target.closest('button, a, input, textarea, select, label, [contenteditable="true"]');
  }

  function isSelected(cardId: string) {
    return selectedIds.includes(cardId);
  }

  function toggleSelected(cardId: string) {
    selectedIds = isSelected(cardId)
      ? selectedIds.filter((id) => id !== cardId)
      : [...selectedIds, cardId];
  }

  function cardById(cardId: string) {
    for (const listId of Object.keys(cardsByList)) {
      const card = cardsByList[listId]?.find((c) => c.id === cardId);
      if (card) return card;
    }
    return null;
  }

  // Selección en el mismo orden visual en que se ven las tarjetas.
  function selectedCardsInOrder() {
    return Object.keys(cardsByList)
      .flatMap((listId) => cardsByList[listId] ?? [])
      .filter((card) => selectedIds.includes(card.id));
  }

  // Si la tarjeta arrastrada está seleccionada, se mueve toda la selección.
  function startDrag(cardId: string) {
    draggingCardId = cardId;
    dragIds = isSelected(cardId) ? selectedCardsInOrder().map((c) => c.id) : [cardId];
  }

  function resetDrag() {
    draggingCardId = null;
    dragIds = [];
    dropTarget = null;
  }

  // Lista y tarjeta (por id) sobre las que caería el arrastre, según el puntero.
  function updateDropTarget() {
    const under = document.elementFromPoint(pointerX, pointerY);
    const column = under instanceof Element ? under.closest<HTMLElement>('[data-kanban-list]') : null;
    const listId = column?.dataset.kanbanList;
    if (!column || !listId) {
      dropTarget = null;
      return;
    }

    const moving = new Set(dragIds);
    const siblings = [...column.querySelectorAll<HTMLElement>('[data-highlight-id]')]
      .filter((el) => !moving.has(el.dataset.highlightId ?? ''));

    let beforeId: string | null = null;
    for (const el of siblings) {
      const { top, height } = el.getBoundingClientRect();
      if (pointerY < top + height / 2) {
        beforeId = el.dataset.highlightId ?? null;
        break;
      }
    }

    dropTarget = { listId, beforeId };
  }

  function handleDrop(state: DragDropState<{ id: string }>) {
    const { draggedItem, targetContainer } = state;
    if (!targetContainer || !draggedItem) return;

    const cardId = draggedItem.id;
    const targetListId = targetContainer as string;

    if (dragIds.length === 0) dragIds = [cardId];
    updateDropTarget();

    const movingIds = [...dragIds];
    const movingSet = new Set(movingIds);
    const movingCards = movingIds.map(cardById).filter((c): c is KanbanCard => c !== null);
    if (movingCards.length === 0) {
      resetDrag();
      return;
    }

    const targetCards = (cardsByList[targetListId] ?? []).filter((c) => !movingSet.has(c.id));
    let index = targetCards.length;
    if (dropTarget?.listId === targetListId && dropTarget.beforeId) {
      const beforeIndex = targetCards.findIndex((c) => c.id === dropTarget!.beforeId);
      if (beforeIndex !== -1) index = beforeIndex;
    }

    const nextTarget = [...targetCards.slice(0, index), ...movingCards, ...targetCards.slice(index)];
    const currentTarget = cardsByList[targetListId] ?? [];
    const unchanged = currentTarget.length === nextTarget.length &&
      currentTarget.every((c, i) => c.id === nextTarget[i]?.id);

    if (unchanged) {
      resetDrag();
      return;
    }

    for (const listId of Object.keys(cardsByList)) {
      if (listId === targetListId) continue;
      if ((cardsByList[listId] ?? []).some((c) => movingSet.has(c.id))) {
        cardsByList[listId] = (cardsByList[listId] ?? []).filter((c) => !movingSet.has(c.id));
      }
    }
    cardsByList[targetListId] = nextTarget;

    const formData = new FormData();
    formData.append('cardIds', JSON.stringify(movingIds));
    formData.append('targetListId', targetListId);
    formData.append('newOrder', String(index));
    fetch('?/moveCards', { method: 'POST', body: formData, headers: { 'x-sveltekit-action': 'true' } });

    if (isSelected(cardId)) selectedIds = [];
    resetDrag();
  }

  function handleCardClick(e: MouseEvent, card: KanbanCard) {
    const target = e.target as HTMLElement;
    const moved = pointerMoved;
    pointerStart = null;
    pointerMoved = false;
    if (moved || target.closest('.drag-handle')) return;
    if (e.shiftKey) {
      toggleSelected(card.id);
      return;
    }
    if (selectedIds.length > 0) selectedIds = [];
    openEditCard(card);
  }

  function onCardPointerDown(e: PointerEvent, card: KanbanCard) {
    if (isInteractiveTarget(e.target)) return;
    pointerDownCardId = card.id;
    pointerStart = { x: e.clientX, y: e.clientY };
    pointerX = e.clientX;
    pointerY = e.clientY;
    pointerMoved = false;
    nativeDragId = null;
    draggingCardId = null;
    dragIds = [];
    dropTarget = null;
    window.addEventListener('pointermove', trackPointerMove, { passive: true });
    window.addEventListener('pointerup', stopTrackingPointer, { passive: true });
    window.addEventListener('pointercancel', stopTrackingPointer, { passive: true });
  }

  // Distingue un click (abrir edición) de un arrastre (mover o reordenar),
  // porque ahora se puede arrastrar desde cualquier parte de la tarjeta.
  function trackPointerMove(e: PointerEvent) {
    if (!pointerStart) return;
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (!pointerMoved) {
      if (Math.abs(e.clientX - pointerStart.x) > 8 || Math.abs(e.clientY - pointerStart.y) > 8) {
        pointerMoved = true;
        if (pointerDownCardId) startDrag(pointerDownCardId);
      } else {
        return;
      }
    }
    if (draggingCardId) updateDropTarget();
  }

  function removePointerListeners() {
    window.removeEventListener('pointermove', trackPointerMove);
    window.removeEventListener('pointerup', stopTrackingPointer);
    window.removeEventListener('pointercancel', stopTrackingPointer);
  }

  function cleanupPointerTracking() {
    pointerStart = null;
    pointerDownCardId = null;
    removePointerListeners();
  }

  // El navegador dispara `pointercancel` justo después de `dragstart` en un
  // arrastre nativo: ahí no hay que borrar el estado del drag o el drop queda
  // en la posición original.
  function stopTrackingPointer() {
    cleanupPointerTracking();
    if (!nativeDragId) resetDrag();
  }

  function onCardDragStart(e: DragEvent, card: KanbanCard) {
    if (pointerDownCardId !== card.id) return;
    nativeDragId = card.id;
    startDrag(card.id);
    pointerX = e.clientX;
    pointerY = e.clientY;
  }

  function onNativeDragEnd() {
    nativeDragId = null;
    cleanupPointerTracking();
    resetDrag();
  }

  // El arrastre nativo (mouse) no emite pointermove: seguimos el dragover.
  $effect(() => {
    const onDragOver = (e: DragEvent) => {
      if (!nativeDragId) return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      updateDropTarget();
    };

    const onDragEnd = () => onNativeDragEnd();

    window.addEventListener('dragover', onDragOver, { passive: true });
    window.addEventListener('dragend', onDragEnd, { passive: true });

    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragend', onDragEnd);
    };
  });
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
      <div class="flex items-center gap-4 flex-wrap">
        <p class="m-0 text-[13px] text-nudo-text-tertiary">Shift + click para seleccionar varias</p>
        <Button onclick={openListModal}>
          <i class="ri-add-line" aria-hidden="true"></i> Nueva columna
        </Button>
      </div>
    </div>

    {#if selectedIds.length > 0}
      <div class="flex items-center gap-3 flex-wrap bg-nudo-surface rounded-2xl px-4 py-3">
        <span class="text-sm font-semibold text-nudo-text-primary">
          {selectedIds.length} {selectedIds.length === 1 ? 'tarjeta seleccionada' : 'tarjetas seleccionadas'}
        </span>
        <span class="text-[13px] text-nudo-text-secondary">Arrastrá una de ellas a otra columna para moverlas juntas.</span>
        <button
          type="button"
          onclick={() => selectedIds = []}
          class="ml-auto bg-transparent border-none p-0 text-[13px] font-semibold text-nudo-text-secondary hover:text-nudo-text-primary cursor-pointer"
        >
          Limpiar selección
        </button>
      </div>
    {/if}

    <div class="flex gap-5 overflow-x-auto pb-4">
      {#each data.lists as list}
        <div
          data-kanban-list={list.id}
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
                  use:draggable={{ container: list.id, dragData: card }}
                  onpointerdown={(e) => onCardPointerDown(e, card)}
                  ondragstart={(e) => onCardDragStart(e, card)}
                  onclick={(e) => handleCardClick(e, card)}
                  class="bg-nudo-bg border border-nudo-border rounded-2xl p-4 cursor-pointer active:cursor-grabbing hover:shadow-sm transition-all duration-150 {card.completed ? 'opacity-60' : ''}"
                  class:drop-before-line={dropTarget?.listId === list.id && dropTarget.beforeId === card.id}
                  class:card-selected={isSelected(card.id)}
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      {#if card.title}
                        <p class="font-semibold text-base text-nudo-text-primary m-0 {card.completed ? 'line-through' : ''}">{card.title}</p>
                        {#if card.description}
                          <p class="text-sm text-nudo-text-secondary mt-1 m-0">{card.description}</p>
                        {/if}
                      {:else if card.description}
                        <p class="font-semibold text-base text-nudo-text-primary m-0 {card.completed ? 'line-through' : ''}">{card.description}</p>
                      {:else}
                        <p class="italic text-sm text-nudo-text-tertiary m-0">(Sin título)</p>
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
            {#if dragIds.length > 0 && dropTarget?.listId === list.id && dropTarget.beforeId === null}
              <div class="h-0.5 rounded-full bg-nudo-accent mx-1" aria-hidden="true"></div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- Modal: Crear tablero -->
<dialog bind:this={dialogRef} onclick={(e) => isBackdropClick(e, dialogRef) && closeModal()}
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
<dialog bind:this={dialogRefList} onclick={(e) => isBackdropClick(e, dialogRefList) && closeListModal()}
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
<dialog bind:this={dialogRefCard} onclick={(e) => isBackdropClick(e, dialogRefCard) && closeCardModal()}
  class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40">
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Nueva tarjeta</h2>
    <button onclick={closeCardModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
  </div>
  <form method="POST" action="?/createCard" onsubmit={validateNewCard} class="flex flex-col gap-4">
    <input type="hidden" name="listId" value={activeListId} />
    <label class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-nudo-text-secondary">Título (opcional)</span>
      <input name="title" type="text" placeholder="Titulo de la tarjeta"
        class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
    </label>
    <label class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-nudo-text-secondary">Descripción (opcional)</span>
      <textarea name="description" rows="3" placeholder="Descripcion de la tarjeta..."
        class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent resize-none"></textarea>
    </label>
    {#if newCardError}
      <p class="text-sm text-nudo-danger m-0">{newCardError}</p>
    {/if}
    <Button type="submit">Crear tarjeta</Button>
  </form>
</dialog>

<!-- Modal: Editar tarjeta -->
<dialog bind:this={dialogRefEdit} onclick={(e) => isBackdropClick(e, dialogRefEdit) && closeEditCard()}
  class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40">
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Editar tarjeta</h2>
    <button onclick={closeEditCard} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
  </div>
  {#if editingCard}
    <form method="POST" action="?/updateCard" onsubmit={validateEditCard} class="flex flex-col gap-4">
      <input type="hidden" name="cardId" value={editingCard.id} />
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Título (opcional)</span>
        <input name="title" type="text" value={editTitle}
          class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
      </label>
      <label class="flex flex-col gap-2">
        <span class="text-sm font-semibold text-nudo-text-secondary">Descripción</span>
        <textarea name="description" rows="4"
          class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent resize-none">{editDescription}</textarea>
      </label>
      {#if editCardError}
        <p class="text-sm text-nudo-danger m-0">{editCardError}</p>
      {/if}
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
        <button type="submit" class="flex items-center gap-2 text-sm text-nudo-text-tertiary hover:text-nudo-danger cursor-pointer bg-transparent border-none font-inherit">
          <i class="ri-delete-bin-line text-base"></i> Eliminar tarjeta
        </button>
      </form>
    </div>
  {/if}
</dialog>

<style>
  :global([data-highlight-id].drop-before-line) {
    box-shadow: 0 -3px 0 0 var(--color-nudo-accent);
  }

  :global([data-highlight-id].dragging) {
    opacity: 0.45;
  }

  :global([data-highlight-id].card-selected) {
    outline: 2px solid var(--color-nudo-accent);
    outline-offset: 1px;
  }
</style>
