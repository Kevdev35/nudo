<script lang="ts">
    import type { PageData } from "./$types"
    import Button from '@components/Button.svelte'

    let { data }: { data: PageData } = $props()
    let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement

    function openModal() { dialogRef.showModal() }
    function closeModal() { dialogRef.close() }

    function formatBudget(amount: number | null): string {
        if (!amount) return '—';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }

    function formatDate(d: Date | string): string {
        return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
    <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(24px,3vw,34px)">
        Mis proyectos
    </h1>
    <div class="flex items-center gap-1.5">
        <a href="/clients"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-nudo-border bg-transparent text-nudo-text-primary text-sm font-semibold no-underline hover:bg-nudo-surface hover:border-nudo-text-tertiary transition-all duration-150">
            <i class="ri-team-line" aria-hidden="true"></i> Ver clientes
        </a>
        <Button onclick={openModal}>
            <i class="ri-add-line" aria-hidden="true"></i> Nuevo proyecto
        </Button>
    </div>
</div>

<dialog
    bind:this={dialogRef}
    onclick={(e) => e.target === dialogRef && closeModal()}
    class="fixed inset-0 m-auto max-w-md w-[calc(100%-2rem)] p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Crear nuevo proyecto</h2>
        <button onclick={closeModal} class="icon-btn cursor-pointer" aria-label="Cerrar"><i class="ri-close-line" aria-hidden="true"></i></button>
    </div>

    <form method="POST" action="?/createProject" class="flex flex-col gap-4">
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Nombre</span>
            <input name="name" type="text" required placeholder="Nombre del proyecto"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Descripción</span>
            <textarea name="description" rows="3" placeholder="Describe el proyecto..."
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent resize-none"></textarea>
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Cliente</span>
            <select name="clientId"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent">
                <option value="">Proyecto propio</option>
                {#each data.clients as client}
                    <option value={client.id}>{client.name}</option>
                {/each}
            </select>
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Presupuesto</span>
            <input name="budget" type="number" step="0.01" placeholder="0.00"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent" />
        </label>
        <div class="flex justify-end gap-2.5 mt-2">
            <Button type="button" onclick={closeModal}>Cancelar</Button>
            <Button type="submit">Crear proyecto</Button>
        </div>
    </form>
</dialog>

<div class="flex flex-col gap-4">
    {#if data.projects.length === 0}
        <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
            <i class="ri-folder-add-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
            <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Aún no tienes proyectos</p>
            <p class="m-0 text-[14px] text-nudo-text-secondary">Crea tu primer proyecto con el botón de arriba.</p>
        </div>
    {:else}
        <div class="flex flex-col gap-2">
            {#each data.projects as project}
                <a href="/projects/{project.id}"
                    class="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 bg-nudo-surface rounded-3xl no-underline text-inherit hover:bg-nudo-bg hover:shadow-sm transition-all duration-150">
                    <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nudo-accent-bg flex items-center justify-center text-lg sm:text-xl text-nudo-accent shrink-0">
                        <i class="ri-folder-3-line" aria-hidden="true"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm sm:text-base font-semibold text-nudo-text-primary m-0 truncate">{project.name}</p>
                        <div class="flex items-center gap-2 sm:gap-2.5 mt-1">
                            <span class="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-nudo-surface text-nudo-text-secondary capitalize">{project.status ?? 'active'}</span>
                            {#if project.description}
                                <span class="text-[10px] sm:text-xs text-nudo-text-tertiary truncate max-w-[140px] sm:max-w-[260px]">{project.description}</span>
                            {/if}
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-1 shrink-0">
                        {#if project.budget}
                            <span class="text-xs sm:text-sm font-bold text-nudo-text-primary">{formatBudget(project.budget)}</span>
                        {/if}
                        <span class="text-[10px] sm:text-xs text-nudo-text-tertiary">{formatDate(project.createdAt)}</span>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
