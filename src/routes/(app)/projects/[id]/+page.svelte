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

    const typeConfig: Record<string, { icon: string; color: string }> = {
        nota: { icon: 'ri-file-text-line', color: 'text-amber-600' },
        tarea: { icon: 'ri-checkbox-circle-line', color: 'text-green-600' },
        doc: { icon: 'ri-booklet-line', color: 'text-blue-600' },
        archivo: { icon: 'ri-attachment-2', color: 'text-gray-500' },
    };
</script>

<section class="flex flex-col mt-3 px-5 gap-6">
    <div>
        <h1 class="font-bold text-7xl">Resumen de {data.project.name}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onclick={() => goto(`/projects/${data.project.id}/notes`)} class="cursor-pointer bg-[var(--surface-container)] rounded-3xl p-4 text-left hover:shadow-md transition-shadow">
            <p class="text-2xl font-semibold">Notas</p>
            <p class="text-xl font-bold">{data.notes.length}</p>
            <p class="text-lg mt-1">{completedNotes} completadas</p>
        </button>
        <button onclick={() => goto(`/projects/${data.project.id}/kanban`)} class="cursor-pointer bg-[var(--surface-container)] rounded-3xl p-4 text-left hover:shadow-md transition-shadow">
            <p class="text-2xl font-semibold">Tareas</p>
            <p class="text-xl font-bold">{data.cards.length}</p>
            <p class="text-lg mt-1">{completedCards} completadas</p>
        </button>
        <button onclick={() => goto(`/projects/${data.project.id}/markdown`)} class="cursor-pointer bg-[var(--surface-container)] rounded-3xl p-4 text-left hover:shadow-md transition-shadow">
            <p class="text-2xl font-semibold">Documentos</p>
            <p class="text-xl font-bold">{data.docs.length}</p>
            <p class="text-lg mt-1">markdown</p>
        </button>
        <button onclick={() => goto(`/projects/${data.project.id}/files`)} class="cursor-pointer bg-[var(--surface-container)] rounded-3xl p-4 text-left hover:shadow-md transition-shadow">
            <p class="text-2xl font-semibold">Archivos</p>
            <p class="text-xl font-bold">{data.files.length}</p>
            <p class="text-lg mt-1">adjuntos</p>
        </button>
    </div>

    {#if activity.length > 0}
        <div>
            <h2 class="font-bold text-4xl mb-3">Actividad reciente</h2>
            <div class="flex flex-col gap-2 mx-4 my-5">
                {#each activity as item}
                    <button
                        onclick={() => goto(item.href)}
                        class="cursor-pointer flex items-center gap-3 bg-[var(--surface-container)] rounded-3xl px-4 py-4 hover:shadow-sm transition-shadow text-left"
                    >
                        <i class="{typeConfig[item.type].icon} {typeConfig[item.type].color} text-2xl"></i>
                        <div class="flex-1 min-w-0">
                            <p class="text-xl font-semibold truncate">{item.title}</p>
                            <p class="text-lg font-medium opacity-60">{item.type}</p>
                        </div>
                        {#if item.completed !== undefined}
                            <span class="text-xl {item.completed ? 'text-green-600' : 'opacity-40'}">
                                {item.completed ? '✓' : '○'}
                            </span>
                        {/if}
                        <span class="text-lg opacity-40 shrink-0">{timeAgo(item.date)}</span>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</section>
