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

    const stats = $derived([
        { key: 'notas', label: 'Notas', icon: 'ri-file-text-line', value: data.notes.length, sub: `${completedNotes} completadas`, href: `/projects/${data.project.id}/notes` },
        { key: 'tareas', label: 'Tareas', icon: 'ri-checkbox-circle-line', value: data.cards.length, sub: `${completedCards} completadas`, href: `/projects/${data.project.id}/kanban` },
        { key: 'docs', label: 'Documentos', icon: 'ri-booklet-line', value: data.docs.length, sub: 'markdown', href: `/projects/${data.project.id}/markdown` },
        { key: 'archivos', label: 'Archivos', icon: 'ri-attachment-2', value: data.files.length, sub: 'adjuntos', href: `/projects/${data.project.id}/files` },
    ]);
</script>

<section class="page-general">
    <h1>Resumen de {data.project.name}</h1>

    <div class="stats-grid">
        {#each stats as s}
            <button type="button" class="stat-card" onclick={() => goto(s.href)}>
                <span class="stat-icon"><i class={s.icon} aria-hidden="true"></i></span>
                <p class="stat-label">{s.label}</p>
                <p class="stat-value">{s.value}</p>
                <p class="stat-sub">{s.sub}</p>
            </button>
        {/each}
    </div>

    {#if activity.length > 0}
        <div class="activity-block">
            <h2>Actividad reciente</h2>
            <div class="activity-list" role="list">
                {#each activity as item (item.id)}
                    <button type="button" class="activity-row" role="listitem" onclick={() => goto(item.href)}>
                        <span class="activity-icon type-{item.type}">
                            <i class={typeIcon[item.type]} aria-hidden="true"></i>
                        </span>
                        <span class="activity-text">
                            <p class="activity-title">{item.title}</p>
                            <p class="activity-type">{item.type}</p>
                        </span>
                        {#if item.completed !== undefined}
                            <span class="activity-check" class:done={!!item.completed}>
                                <i class={item.completed ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'} aria-hidden="true"></i>
                                <span class="sr-only">{item.completed ? 'Completado' : 'Pendiente'}</span>
                            </span>
                        {/if}
                        <span class="activity-time">{timeAgo(item.date)}</span>
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <div class="empty-state">
            <i class="ri-inbox-line" aria-hidden="true"></i>
            <p>Sin actividad todavía</p>
            <p class="empty-sub">Crea una nota, tarea o documento para verlo aquí.</p>
        </div>
    {/if}
</section>

<style>
    .sr-only {
        position: absolute;
        width: 1px; height: 1px;
        padding: 0; margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .page-general {
        display: flex;
        flex-direction: column;
        gap: 28px;
        padding: 4px 32px 40px;
    }

    .page-general h1 {
        font-size: clamp(22px, 2.6vw, 28px);
        font-weight: 800;
        color: var(--nudo-text-primary);
        margin: 0;
        letter-spacing: -0.01em;
    }

    /* ---------- Stat cards ---------- */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
    }

    .stat-card {
        text-align: left;
        background: var(--nudo-surface);
        border: 1px solid transparent;
        border-radius: var(--nudo-radius-lg);
        padding: 16px 18px;
        cursor: pointer;
        transition: background .15s ease, border-color .15s ease;
        font-family: inherit;
    }
    .stat-card:hover {
        background: var(--nudo-bg);
        border-color: var(--nudo-border);
    }

    .stat-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 9px;
        background: var(--nudo-bg);
        color: var(--nudo-text-tertiary);
        font-size: 15px;
        margin-bottom: 12px;
    }

    .stat-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--nudo-text-secondary);
        margin: 0 0 2px;
    }
    .stat-value {
        font-size: 28px;
        font-weight: 800;
        color: var(--nudo-text-primary);
        margin: 0;
        line-height: 1.1;
    }
    .stat-sub {
        font-size: 12px;
        color: var(--nudo-text-tertiary);
        margin: 5px 0 0;
    }

    /* ---------- Activity ---------- */
    .activity-block h2 {
        font-size: 15px;
        font-weight: 700;
        color: var(--nudo-text-secondary);
        margin: 0 0 10px;
    }

    .activity-list {
        background: var(--nudo-surface);
        border-radius: var(--nudo-radius-lg);
        overflow: hidden;
    }

    .activity-row {
        all: unset;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--nudo-border);
        font-family: inherit;
    }
    .activity-row:last-child { border-bottom: none; }
    .activity-row:hover { background: var(--nudo-bg); }

    .activity-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        font-size: 16px;
        flex-shrink: 0;
    }
    .activity-icon.type-nota { background: var(--nudo-warning-soft); color: var(--nudo-warning); }
    .activity-icon.type-tarea { background: var(--nudo-success-soft); color: var(--nudo-success); }
    .activity-icon.type-doc { background: #e8f1ff; color: var(--nudo-accent); }
    .activity-icon.type-archivo { background: var(--nudo-bg); color: var(--nudo-text-tertiary); }

    .activity-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }
    .activity-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--nudo-text-primary);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .activity-type {
        font-size: 12px;
        color: var(--nudo-text-tertiary);
        margin: 1px 0 0;
        text-transform: capitalize;
    }

    .activity-check {
        flex-shrink: 0;
        display: inline-flex;
        font-size: 18px;
        color: var(--nudo-text-tertiary);
    }
    .activity-check.done { color: var(--nudo-success); }

    .activity-time {
        flex-shrink: 0;
        font-size: 12.5px;
        color: var(--nudo-text-tertiary);
    }

    /* ---------- Empty state ---------- */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-align: center;
        padding: 48px 20px;
        background: var(--nudo-surface);
        border-radius: var(--nudo-radius-lg);
        color: var(--nudo-text-secondary);
    }
    .empty-state i { font-size: 26px; color: var(--nudo-text-tertiary); margin-bottom: 4px; }
    .empty-state p { margin: 0; font-size: 14px; font-weight: 600; color: var(--nudo-text-primary); }
    .empty-sub { font-weight: 400 !important; font-size: 13px !important; color: var(--nudo-text-secondary) !important; }

    @media (max-width: 760px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .page-general { padding-left: 20px; padding-right: 20px; }
    }
</style>