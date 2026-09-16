<script lang="ts">
    import type { PageData } from "./$types"
    import Button from "@ui/components/Button.svelte";
    let { data }: { data: PageData } = $props()

    let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement

    function openModal() { dialogRef.showModal() }
    function closeModal() { dialogRef.close() }

    function formatDate(d: any): string {
        return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
</script>

<div class="flex items-center justify-between flex-wrap gap-4 mb-4">
    <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
        Mis clientes
    </h1>
    <Button onclick={openModal}>
        <i class="ri-add-line" aria-hidden="true"></i> Añadir cliente
    </Button>
</div>

<dialog
    bind:this={dialogRef}
    onclick={(e) => e.target === dialogRef && closeModal()}
    class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Nuevo cliente</h2>
        <button onclick={closeModal} class="icon-btn" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
    </div>

    <form method="POST" action="?/createClient" class="flex flex-col gap-4">
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Nombre</span>
            <input name="name" type="text" required placeholder="Nombre de tu cliente"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Contacto</span>
            <textarea name="contact_info" rows="3" placeholder="Email, teléfono, dirección..."
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent resize-none"></textarea>
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Notas</span>
            <input name="notes" type="text" placeholder="Notas adicionales..."
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
        </label>
        <div class="flex justify-end gap-2.5 mt-2">
            <Button type="button" onclick={closeModal}>Cancelar</Button>
            <Button type="submit">Añadir cliente</Button>
        </div>
    </form>
</dialog>

<div class="flex flex-col gap-4">
    {#if data.clients.length === 0}
        <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
            <i class="ri-team-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
            <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aún no tienes clientes</p>
            <p class="m-0 text-[14px] text-nudo-text-secondary">Añade tu primer cliente con el botón de arriba.</p>
        </div>
    {:else}
        <div class="flex flex-col gap-2">
            {#each data.clients as client}
                <div class="flex items-center gap-4 px-5 py-4 bg-nudo-surface rounded-3xl hover:bg-nudo-bg hover:shadow-sm transition-all duration-150">
                    <div class="w-11 h-11 rounded-xl bg-nudo-accent-bg flex items-center justify-center text-xl text-nudo-accent shrink-0">
                        <i class="ri-user-3-line" aria-hidden="true"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-base font-semibold text-nudo-text-primary m-0 truncate">{client.name}</p>
                        {#if client.contact_info}
                            <p class="text-sm text-nudo-text-secondary mt-1 m-0 truncate">{client.contact_info}</p>
                        {/if}
                    </div>
                    <div class="flex flex-col items-end gap-1 shrink-0">
                        {#if client.notes}
                            <span class="text-xs text-nudo-text-tertiary max-w-[180px] truncate">{client.notes}</span>
                        {/if}
                        <span class="text-xs text-nudo-text-tertiary">{formatDate(client.createdAt)}</span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
