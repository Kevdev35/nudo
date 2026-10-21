<script lang="ts">
    import type { PageData } from "./$types"
    import { marked } from 'marked';
    import { enhance } from '$app/forms';
    import Button from "@ui/components/Button.svelte";
    import { isBackdropClick } from "@ui/modal";

    let { data }: { data: PageData } = $props()

    let content = $state(data.doc.current_content);
    let renderedHtml = $derived(marked.parse(content, { async: false }));

    // ---------- Historial de versiones (diff estilo GitHub) ----------

    type DiffRow = { type: 'equal' | 'add' | 'del'; text: string };

    // Diff de líneas puro (LCS sobre el centro tras recortar prefijo/sufijo común).
    // Con guard: si el centro es gigante, se muestra todo el centro como cambio.
    function diffLines(oldText: string, newText: string): DiffRow[] {
        const a = oldText.split('\n');
        const b = newText.split('\n');

        let start = 0;
        while (start < a.length && start < b.length && a[start] === b[start]) start++;

        let endA = a.length;
        let endB = b.length;
        while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
            endA--;
            endB--;
        }

        const midA = a.slice(start, endA);
        const midB = b.slice(start, endB);

        let middle: DiffRow[] = [];
        const MAX_CELLS = 1_500_000;

        if (midA.length * midB.length <= MAX_CELLS) {
            const n = midA.length;
            const m = midB.length;
            const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
            for (let i = n - 1; i >= 0; i--) {
                for (let j = m - 1; j >= 0; j--) {
                    dp[i][j] = midA[i] === midB[j]
                        ? dp[i + 1][j + 1] + 1
                        : Math.max(dp[i + 1][j], dp[i][j + 1]);
                }
            }
            let i = 0;
            let j = 0;
            while (i < n && j < m) {
                if (midA[i] === midB[j]) {
                    middle.push({ type: 'equal', text: midA[i] });
                    i++;
                    j++;
                } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                    middle.push({ type: 'del', text: midA[i] });
                    i++;
                } else {
                    middle.push({ type: 'add', text: midB[j] });
                    j++;
                }
            }
            while (i < n) middle.push({ type: 'del', text: midA[i++] });
            while (j < m) middle.push({ type: 'add', text: midB[j++] });
        } else {
            middle = [
                ...midA.map((text) => ({ type: 'del' as const, text })),
                ...midB.map((text) => ({ type: 'add' as const, text }))
            ];
        }

        return [
            ...a.slice(0, start).map((text) => ({ type: 'equal' as const, text })),
            ...middle,
            ...a.slice(endA).map((text) => ({ type: 'equal' as const, text }))
        ];
    }

    function diffStats(rows: DiffRow[]): { add: number; del: number } {
        let add = 0;
        let del = 0;
        for (const row of rows) {
            if (row.type === 'add') add++;
            else if (row.type === 'del') del++;
        }
        return { add, del };
    }

    function formatDate(value: string | Date): string {
        return new Date(value).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    let historyDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let selectedVersionId = $state<string | null>(null);

    let versionsSorted = $derived(
        [...data.versions].sort((a, b) => b.version_number - a.version_number)
    );
    let selectedVersion = $derived(
        versionsSorted.find((v) => v.id === selectedVersionId) ?? null
    );
    let diffRows = $derived(selectedVersion ? diffLines(selectedVersion.content, content) : []);
    let stats = $derived(diffStats(diffRows));

    function openHistory() {
        selectedVersionId = versionsSorted[0]?.id ?? null;
        historyDialog.showModal();
    }

    function closeHistory() {
        historyDialog.close();
    }

    function handleRestore() {
        return async ({ result, update }: any) => {
            const restored = selectedVersion?.content;
            if (result.type === 'success' && restored !== undefined) {
                content = restored;
                historyDialog.close();
            }
            await update();
        };
    }
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
    <div class="flex items-center justify-between flex-wrap gap-4">
        <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
            {data.doc.title}
        </h1>
        <div class="flex items-center gap-3">
            <button
                type="button"
                onclick={openHistory}
                class="cursor-pointer py-3 px-5 rounded-3xl text-sm font-semibold inline-flex items-center gap-2 border border-nudo-border bg-nudo-surface text-nudo-text-primary hover:bg-nudo-bg transition-colors"
            >
                <i class="ri-history-line" aria-hidden="true"></i> Historial
            </button>
            <Button type="submit" form="update-doc-form">
                <i class="ri-save-line" aria-hidden="true"></i> Guardar
            </Button>
        </div>
    </div>

    <form id="update-doc-form" method="POST" action="?/updateDoc" class="grid grid-cols-2 gap-4 items-start w-full max-md:grid-cols-1">
        <textarea
            name="content"
            bind:value={content}
            rows="25"
            class="font-mono p-5 border border-nudo-border rounded-3xl w-full h-[75vh] resize-none text-[14px] leading-relaxed text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent max-md:h-[50vh]"
        ></textarea>

        <div class="prose p-6 border border-nudo-border rounded-3xl w-full h-[75vh] max-w-full overflow-y-auto bg-nudo-surface text-nudo-text-primary max-md:h-[50vh]">
            {@html renderedHtml}
        </div>
    </form>
</section>

<dialog
    bind:this={historyDialog}
    oncancel={(e) => { e.preventDefault(); closeHistory(); }}
    onclick={(e) => isBackdropClick(e, historyDialog) && closeHistory()}
    aria-labelledby="history-title"
    class="fixed inset-0 m-auto max-w-[1000px] w-[94vw] p-0 border border-nudo-border rounded-[var(--nudo-radius-lg)] bg-nudo-bg shadow-2xl backdrop:bg-black/40 overflow-hidden"
>
    <div class="flex items-center justify-between px-6 py-4 border-b border-nudo-border">
        <div class="flex items-baseline gap-3">
            <h2 id="history-title" class="text-lg font-extrabold text-nudo-text-primary m-0">Historial de versiones</h2>
            <span class="text-xs text-nudo-text-tertiary">cada Guardar guarda una copia</span>
        </div>
        <button onclick={closeHistory} aria-label="Cerrar historial" class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border-none text-nudo-text-secondary cursor-pointer text-lg hover:bg-nudo-surface hover:text-nudo-text-primary transition-all">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    {#if versionsSorted.length === 0}
        <div class="p-12 text-center text-nudo-text-secondary">
            <i class="ri-book-2-line text-4xl" aria-hidden="true"></i>
            <p class="m-0 mt-3">
                Todavía no hay versiones. Presioná <strong>Guardar</strong> y el contenido
                actual quedará registrado en el historial.
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-[260px_1fr] max-md:grid-cols-1">
            <nav aria-label="Versiones guardadas" class="border-r border-nudo-border max-md:border-r-0 max-md:border-b p-3 flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
                {#each versionsSorted as v (v.id)}
                    {@const s = diffStats(diffLines(v.content, content))}
                    <button
                        type="button"
                        onclick={() => (selectedVersionId = v.id)}
                        aria-current={selectedVersionId === v.id}
                        class="text-left cursor-pointer rounded-xl px-3 py-2.5 flex flex-col gap-1 transition-colors {selectedVersionId === v.id ? 'bg-nudo-surface outline outline-2 outline-nudo-accent' : 'hover:bg-nudo-surface'}"
                    >
                        <span class="flex items-center justify-between gap-2">
                            <span class="text-sm font-bold text-nudo-text-primary">v{v.version_number}</span>
                            <span class="text-[11px] font-mono">
                                <span class="text-nudo-success">+{s.add}</span>
                                <span class="text-red-600 dark:text-red-400"> -{s.del}</span>
                            </span>
                        </span>
                        <span class="text-[11px] text-nudo-text-tertiary">{formatDate(v.createdAt)}</span>
                    </button>
                {/each}
            </nav>

            <div class="flex flex-col min-w-0">
                <div class="flex items-center justify-between gap-3 flex-wrap px-5 py-3 border-b border-nudo-border min-h-[64px]">
                    {#if selectedVersion}
                        <span class="text-sm font-semibold text-nudo-text-secondary">
                            v{selectedVersion.version_number} → contenido actual
                            <span class="font-mono text-[11px] ml-2">
                                <span class="text-nudo-success">+{stats.add}</span>
                                <span class="text-red-600 dark:text-red-400"> -{stats.del}</span>
                            </span>
                        </span>
                        <form method="POST" action="?/updateDoc" use:enhance={handleRestore}>
                            <input type="hidden" name="content" value={selectedVersion.content} />
                            <Button type="submit">
                                <i class="ri-arrow-go-back-line" aria-hidden="true"></i> Restaurar esta versión
                            </Button>
                        </form>
                    {:else}
                        <span class="text-sm text-nudo-text-tertiary">Elegí una versión para ver los cambios</span>
                    {/if}
                </div>

                <div class="overflow-auto max-h-[60vh] font-mono text-[12.5px] leading-[1.6] p-3 bg-nudo-surface">
                    {#if !selectedVersion}
                        <p class="text-nudo-text-tertiary text-center m-0 p-6">Sin versión seleccionada</p>
                    {:else if stats.add === 0 && stats.del === 0}
                        <p class="font-sans text-nudo-text-secondary text-center m-0 p-6">
                            Sin cambios entre v{selectedVersion.version_number} y el contenido actual
                        </p>
                    {:else}
                        {#each diffRows as row, i (i)}
                            <div class="whitespace-pre {row.type === 'add' ? 'bg-nudo-success-soft' : row.type === 'del' ? 'bg-red-50 dark:bg-red-950/30' : ''}">
                                <span class="select-none inline-block w-5 text-center {row.type === 'add' ? 'text-nudo-success' : row.type === 'del' ? 'text-red-600 dark:text-red-400' : 'text-nudo-text-tertiary'}">{row.type === 'add' ? '+' : row.type === 'del' ? '-' : ' '}</span><span class="text-nudo-text-primary">{row.text || ' '}</span>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</dialog>
