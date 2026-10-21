<script lang="ts">
    import { theme } from '@stores/theme';
    import { DEFAULT_THEME, THEMES, type ThemeId } from '@ui/themes';
    import { isBackdropClick } from '@ui/modal';

    let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement;
    let current = $state<ThemeId>(DEFAULT_THEME);

    theme.subscribe((value) => (current = value));

    const active = $derived(THEMES.find((t) => t.id === current) ?? THEMES[0]);

    function open() {
        dialogRef.showModal();
    }

    function close() {
        dialogRef.close();
    }

    function select(id: ThemeId) {
        theme.set(id);
    }
</script>

<button
    type="button"
    onclick={open}
    class="inline-flex items-center gap-2.5 h-11 px-4 rounded-2xl bg-nudo-bg border border-nudo-border text-sm font-semibold text-nudo-text-primary cursor-pointer hover:border-nudo-accent transition-colors"
>
    <i class="ri-palette-line text-base text-nudo-text-secondary" aria-hidden="true"></i>
    {active.label}
</button>

<dialog
    bind:this={dialogRef}
    onclick={(e) => isBackdropClick(e, dialogRef) && close()}
    class="fixed inset-0 m-auto max-w-lg w-full p-7 border-none rounded-[var(--nudo-radius-lg)] bg-nudo-bg shadow-2xl backdrop:bg-black/40"
>
    <div class="flex items-start justify-between mb-6">
        <div>
            <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Elegí tu tema</h2>
            <p class="text-sm text-nudo-text-secondary m-0 mt-1">Los temas nuevos van a aparecer acá.</p>
        </div>
        <button onclick={close} class="icon-btn text-nudo-text-tertiary hover:text-nudo-text-primary shrink-0" aria-label="Cerrar">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each THEMES as option (option.id)}
            <button
                type="button"
                onclick={() => select(option.id)}
                aria-pressed={current === option.id}
                class="text-left cursor-pointer rounded-2xl p-3 border transition-all
                    {current === option.id ? 'border-nudo-accent' : 'border-nudo-border hover:border-nudo-text-tertiary'}"
            >
                <div
                    class="rounded-xl overflow-hidden border mb-3"
                    style="background:{option.preview.bg}; border-color:{option.preview.border}"
                >
                    <div class="flex items-center gap-2 px-3 py-2" style="background:{option.preview.surface}">
                        <span class="w-2.5 h-2.5 rounded-full" style="background:{option.preview.accent}"></span>
                        <span class="h-1.5 flex-1 rounded-full" style="background:{option.preview.text}; opacity:.85"></span>
                    </div>
                    <div class="px-3 py-3 flex flex-col gap-1.5">
                        <span class="h-1.5 w-3/4 rounded-full" style="background:{option.preview.text}; opacity:.35"></span>
                        <span class="h-1.5 w-1/2 rounded-full" style="background:{option.preview.text}; opacity:.2"></span>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2">
                    <span class="text-sm font-bold text-nudo-text-primary">{option.label}</span>
                    {#if current === option.id}
                        <i class="ri-check-line text-nudo-accent" aria-hidden="true"></i>
                    {/if}
                </div>
                <p class="text-xs text-nudo-text-tertiary m-0 mt-1">{option.description}</p>
            </button>
        {/each}
    </div>
</dialog>
