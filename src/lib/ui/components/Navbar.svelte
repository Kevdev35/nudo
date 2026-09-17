<script lang="ts">
    import Logo from "./Logo.svelte";
    let { data, onmenuclick }: { data: { user?: { name?: string | null } | null }; onmenuclick?: () => void } = $props()
</script>

<nav class="flex items-center justify-between py-4 px-4 md:px-8 border-b border-nudo-border mb-4 md:mb-5">
    <div class="flex items-center gap-3">
        {#if onmenuclick}
            <button
                type="button"
                onclick={onmenuclick}
                class="md:hidden text-nudo-text-secondary hover:text-nudo-text-primary"
                aria-label="Abrir menú"
            >
                <i class="ri-menu-line text-xl" aria-hidden="true"></i>
            </button>
        {/if}
        <Logo showBadge={false}/>
        <span class="text-nudo-text-tertiary hidden sm:inline">|</span>
        <h1 class="text-lg font-semibold text-nudo-text-secondary m-0 hidden sm:block">Hola, {data.user?.name ?? 'de nuevo'}!</h1>
    </div>

    <div class="flex items-center gap-3">
        <form action="?/logout" method="post">
            <button
                type="submit"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nudo-surface text-nudo-text-secondary text-sm font-semibold border-none cursor-pointer hover:bg-nudo-bg hover:text-nudo-text-primary transition-all duration-150"
            >
                <i class="ri-login-box-line text-lg" aria-hidden="true"></i>
                <span class="hidden sm:inline">Salir</span>
            </button>
        </form>
    </div>
</nav>
