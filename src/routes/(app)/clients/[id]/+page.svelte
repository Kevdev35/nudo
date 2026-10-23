<script lang="ts">
    import type { PageData } from "./$types";
    import { projectStatusClass, projectStatusLabel } from "@ui/project-status";

    let { data }: { data: PageData } = $props();

    function formatBudget(amount: number | null): string {
        if (!amount) return "—";
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
    }

    function formatDate(d: Date | string): string {
        return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    }
</script>

<svelte:head>
    <title>{data.client.name} · Clientes · Nudo</title>
</svelte:head>

<div class="flex flex-col gap-5 pt-1">
    <a
        href="/clients"
        class="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-nudo-text-secondary no-underline hover:text-nudo-text-primary transition-colors"
    >
        <i class="ri-arrow-left-line text-base" aria-hidden="true"></i>
        Clientes
    </a>

    <!-- Hero del cliente -->
    <header class="flex items-center justify-between flex-wrap gap-5 max-md:flex-col max-md:items-start">
        <div class="flex flex-col gap-1 min-w-0">
            <h1
                class="font-extrabold text-nudo-text-primary uppercase leading-none tracking-tight m-0"
                style="font-size: clamp(26px, 3vw, 36px)"
            >
                {data.client.name}
            </h1>
            {#if data.client.notes}
                <p class="text-nudo-text-secondary text-sm m-0 mt-1 max-w-[560px] whitespace-pre-line break-words">
                    {data.client.notes}
                </p>
            {/if}
        </div>

        <div
            class="flex flex-wrap items-start gap-x-5 gap-y-3 bg-nudo-surface rounded-2xl py-3 px-5 shrink-0 max-w-full md:max-w-[440px]"
            role="list"
            aria-label="Detalles del cliente"
        >
            {#if data.client.contact_info}
                <div class="flex flex-col gap-px min-w-0" role="listitem">
                    <span class="text-xs text-nudo-text-secondary font-medium">Contacto</span>
                    <span class="text-sm font-semibold text-nudo-text-primary whitespace-pre-line break-words line-clamp-3">
                        {data.client.contact_info}
                    </span>
                </div>
            {/if}
            <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                <span class="text-xs text-nudo-text-secondary font-medium">Creado</span>
                <span class="text-sm font-bold text-nudo-text-primary">{formatDate(data.client.createdAt)}</span>
            </div>
            <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                <span class="text-xs text-nudo-text-secondary font-medium">Proyectos</span>
                <span class="text-sm font-bold text-nudo-text-primary">{data.projects.length}</span>
            </div>
        </div>
    </header>

    <!-- Proyectos del cliente -->
    <section class="flex flex-col gap-3">
        <h2 class="text-nudo-text-primary text-lg font-extrabold tracking-tight m-0">Proyectos</h2>

        {#if data.projects.length === 0}
            <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
                <i class="ri-folder-open-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
                <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Este cliente no tiene proyectos</p>
                <p class="m-0 text-[14px] text-nudo-text-secondary">Asignale un proyecto desde su configuración.</p>
            </div>
        {:else}
            <div class="flex flex-col gap-2">
                {#each data.projects as project (project.id)}
                    <a
                        href="/projects/{project.id}"
                        class="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 bg-nudo-surface rounded-3xl no-underline text-inherit hover:bg-nudo-bg hover:shadow-sm transition-all duration-150"
                    >
                        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nudo-accent-soft flex items-center justify-center text-lg sm:text-xl text-nudo-accent shrink-0">
                            <i class="ri-folder-3-line" aria-hidden="true"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm sm:text-base font-semibold text-nudo-text-primary m-0 truncate">{project.name}</p>
                            <div class="flex items-center gap-2 sm:gap-2.5 mt-1">
                                <span class="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full {projectStatusClass(project.status)}">
                                    {projectStatusLabel(project.status)}
                                </span>
                                {#if project.description}
                                    <span class="text-[10px] sm:text-xs text-nudo-text-tertiary truncate max-w-[140px] sm:max-w-[260px]">
                                        {project.description}
                                    </span>
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
    </section>
</div>
