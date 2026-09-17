<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';

    let { data }: { data: PageData } = $props();

    const completedNotes = $derived(data.notes.filter((n: any) => n.completed).length);
    const completedCards = $derived(data.cards.filter((c: any) => c.completed).length);

    type ActivityItem = {
        id: string;
        title: string;
        type: 'nota' | 'tarea' | 'doc' | 'archivo';
        date: Date;
        completed?: number;
        href: string;
    };

    const activity: ActivityItem[] = $derived.by(() => {
        const items: ActivityItem[] = [
            ...data.notes.map((n: any) => ({
                id: n.id,
                title: n.content?.slice(0, 60) || 'Sin contenido',
                type: 'nota' as const,
                date: new Date(n.updatedAt),
                completed: n.completed,
                href: `/projects/${data.project.id}/notes`,
            })),
            ...data.cards.map((c: any) => ({
                id: c.id,
                title: c.title,
                type: 'tarea' as const,
                date: new Date(c.updatedAt),
                completed: c.completed,
                href: `/projects/${data.project.id}/kanban`,
            })),
            ...data.docs.map((d: any) => ({
                id: d.id,
                title: d.title,
                type: 'doc' as const,
                date: new Date(d.updatedAt),
                href: `/projects/${data.project.id}/markdown/${d.id}`,
            })),
            ...data.files.map((f: any) => ({
                id: f.id,
                title: f.name,
                type: 'archivo' as const,
                date: new Date(f.createdAt),
                href: `/projects/${data.project.id}/files`,
            })),
        ];
        return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
    });

    function timeAgo(date: Date): string {
        const now = Date.now();
        const diff = now - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'ahora mismo';
        if (minutes < 60) return `hace ${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `hace ${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `hace ${days}d`;
        const months = Math.floor(days / 30);
        return `hace ${months}mes`;
    }

    const typeIcon: Record<string, string> = {
        nota: 'ri-file-text-line',
        tarea: 'ri-checkbox-circle-line',
        doc: 'ri-booklet-line',
        archivo: 'ri-attachment-2',
    };

    const typeColors: Record<string, string> = {
        nota: 'bg-nudo-warning-soft text-nudo-warning',
        tarea: 'bg-nudo-success-soft text-nudo-success',
        doc: 'bg-[#e8f1ff] text-nudo-accent',
        archivo: 'bg-nudo-bg text-nudo-text-tertiary',
    };

    const stats = $derived([
        { key: 'notas', label: 'Notas', icon: 'ri-file-text-line', value: data.notes.length, sub: `${completedNotes} completadas`, href: `/projects/${data.project.id}/notes` },
        { key: 'tareas', label: 'Tareas', icon: 'ri-checkbox-circle-line', value: data.cards.length, sub: `${completedCards} completadas`, href: `/projects/${data.project.id}/kanban` },
        { key: 'docs', label: 'Documentos', icon: 'ri-booklet-line', value: data.docs.length, sub: 'markdown', href: `/projects/${data.project.id}/markdown` },
        { key: 'archivos', label: 'Archivos', icon: 'ri-attachment-2', value: data.files.length, sub: 'adjuntos', href: `/projects/${data.project.id}/files` },
    ]);
</script>

<section class="bg-nudo-bg flex flex-col gap-7 px-4 md:px-8 py-1 pb-10">
    <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
        Resumen de {data.project.name}
    </h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        {#each stats as s}
            <button type="button" class="text-left bg-nudo-surface border border-transparent rounded-[var(--nudo-radius-lg)] px-4 py-4 cursor-pointer hover:bg-nudo-bg hover:border-nudo-border transition-all duration-150"
                onclick={() => goto(s.href)}>
                <span class="inline-flex items-center justify-center w-[30px] h-[30px] rounded-[9px] bg-nudo-bg text-nudo-text-tertiary text-[15px] mb-3">
                    <i class={s.icon} aria-hidden="true"></i>
                </span>
                <p class="text-sm font-semibold text-nudo-text-secondary m-0 mb-0.5">{s.label}</p>
                <p class="text-[32px] font-extrabold text-nudo-text-primary m-0 leading-[1.1]">{s.value}</p>
                <p class="text-[13px] text-nudo-text-tertiary m-0 mt-1.5">{s.sub}</p>
            </button>
        {/each}
    </div>

    {#if activity.length > 0}
        <div class="flex flex-col">
            <h2 class="text-base font-bold text-nudo-text-secondary m-0 mb-2.5">Actividad reciente</h2>
            <div class="bg-nudo-surface rounded-[var(--nudo-radius-lg)] overflow-hidden" role="list">
                {#each activity as item (item.id)}
                    <button type="button" class="flex items-center gap-3 w-full px-4 py-3 border-b border-nudo-border cursor-pointer bg-transparent text-left font-[inherit] hover:bg-nudo-bg transition-colors last:border-b-0"
                        role="listitem" onclick={() => goto(item.href)}>
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-[10px] text-base shrink-0 {typeColors[item.type]}">
                            <i class={typeIcon[item.type]} aria-hidden="true"></i>
                        </span>
                        <span class="flex-1 min-w-0 flex flex-col">
                            <p class="text-[15px] font-semibold text-nudo-text-primary m-0 truncate">{item.title}</p>
                            <p class="text-[13px] text-nudo-text-tertiary m-0 mt-px capitalize">{item.type}</p>
                        </span>
                        {#if item.completed !== undefined}
                            <span class="shrink-0 inline-flex text-lg {item.completed ? 'text-nudo-success' : 'text-nudo-text-tertiary'}">
                                <i class={item.completed ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'} aria-hidden="true"></i>
                                <span class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0" style="clip:rect(0,0,0,0)">{item.completed ? 'Completado' : 'Pendiente'}</span>
                            </span>
                        {/if}
                        <span class="shrink-0 text-[13.5px] text-nudo-text-tertiary">{timeAgo(item.date)}</span>
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center gap-1.5 text-center py-12 px-5 bg-nudo-surface rounded-[var(--nudo-radius-lg)] text-nudo-text-secondary">
            <i class="ri-inbox-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
            <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Sin actividad todavía</p>
            <p class="m-0 text-[14px] text-nudo-text-secondary">Crea una nota, tarea o documento para verlo aquí.</p>
        </div>
    {/if}
</section>
