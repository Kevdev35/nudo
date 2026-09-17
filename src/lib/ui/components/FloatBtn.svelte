<script lang="ts">
    import { onMount } from 'svelte';

    let expanded = $state(true);
    let visible = $state(false);

    onMount(() => {
        visible = true;
        const timer = setTimeout(() => { expanded = false; }, 3500);
        return () => clearTimeout(timer);
    });
</script>

{#if visible}
    <a
        href="/features"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg transition-all duration-500 ease-out no-underline overflow-hidden
            {expanded
                ? 'bg-nudo-accent text-white px-5 py-3 w-auto'
                : 'bg-nudo-accent text-white w-12 h-12 px-0 justify-center'}"
    >
        <i class="ri-sparkling-2-line text-lg shrink-0"></i>
        <span class="text-sm font-semibold whitespace-nowrap transition-all duration-500
            {expanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}">
            Nuevas funciones
        </span>
    </a>
{/if}
