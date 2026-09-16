<script lang="ts">

    import Logo from "./Logo.svelte";
    let { data }: { data: { user?: { name?: string | null } | null } } = $props()
</script>

<nav class="flex items-center justify-between py-4 px-8 border-b border-nudo-border mb-4">
    <div class="flex items-center gap-3">
        <Logo showBadge={false}/>
        <span class="text-nudo-text-tertiary">|</span>
        <h1 class="text-lg font-semibold text-nudo-text-secondary m-0">Hola, {data.user?.name ?? 'de nuevo'}!</h1>
    </div>

    <div class="flex items-center gap-3">
        <form action="?/logout" method="post">
            <button
                type="submit"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nudo-surface text-nudo-text-secondary text-sm font-semibold border-none cursor-pointer hover:bg-nudo-bg hover:text-nudo-text-primary transition-all duration-150"
            >
                <i class="ri-login-box-line text-lg" aria-hidden="true"></i> Salir
            </button>
        </form>
    </div>
</nav>
