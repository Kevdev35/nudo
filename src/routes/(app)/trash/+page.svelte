<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';

    let { data }: { data: PageData } = $props();
    let restoring = $state<string | null>(null);

    function formatDate(d: Date | string): string {
        return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function formatBudget(amount: number | null): string {
        if (!amount) return '—';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }
</script>

<header class="flex items-center justify-between">
    <div class="flex items-center gap-3">
        <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
            Papelera
        </h1>
    </div>
    <span class="text-sm text-nudo-text-tertiary">
        {data.deletedProjects.length} proyecto{data.deletedProjects.length !== 1 ? 's' : ''} eliminado{data.deletedProjects.length !== 1 ? 's' : ''}
    </span>
</header>

<p class="text-sm text-nudo-text-secondary m-0 mb-2">
    Los proyectos eliminados se conservan aquí por si necesitas recuperarlos.
</p>

<div class="flex flex-col gap-2">
    {#if data.deletedProjects.length === 0}
        <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
            <i class="ri-delete-bin-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
            <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">La papelera está vacía</p>
            <p class="m-0 text-[14px] text-nudo-text-secondary">Los proyectos que elimines aparecerán aquí.</p>
        </div>
    {:else}
        {#each data.deletedProjects as project}
            <div class="flex items-center gap-4 px-5 py-4 bg-nudo-surface rounded-3xl group">
                <div class="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-xl text-red-500 shrink-0">
                    <i class="ri-delete-bin-line" aria-hidden="true"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-base font-semibold text-nudo-text-primary m-0 truncate">{project.name}</p>
                    <div class="flex items-center gap-2.5 mt-1">
                        <span class="text-xs text-nudo-text-tertiary">
                            Eliminado el {formatDate(project.deletedAt!)}
                        </span>
                        {#if project.budget}
                            <span class="text-xs text-nudo-text-tertiary">•</span>
                            <span class="text-xs text-nudo-text-tertiary">{formatBudget(project.budget)}</span>
                        {/if}
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <form method="POST" action="?/restore" use:enhance={() => {
                        restoring = project.id;
                        return async ({ result }) => {
                            restoring = null;
                            if (result.type === 'success') {
                                await invalidateAll();
                            }
                        };
                    }}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <button
                            type="submit"
                            disabled={restoring === project.id}
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-nudo-accent-bg text-nudo-accent text-xs font-semibold border-none cursor-pointer hover:bg-nudo-accent hover:text-white transition-all disabled:opacity-50"
                        >
                            <i class="ri-refresh-line" aria-hidden="true"></i>
                            {restoring === project.id ? 'Restaurando...' : 'Restaurar'}
                        </button>
                    </form>
                </div>
            </div>
        {/each}
    {/if}
</div>
