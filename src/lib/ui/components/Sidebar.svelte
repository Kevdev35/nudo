<script lang="ts">
    import { page } from '$app/stores';

    let { open = false, onclose }: { open?: boolean; onclose?: () => void } = $props();

    let currentPath = $derived($page.url.pathname);

    const sections = [
        {
            label: 'Principal',
            items: [
                { icon: 'ri-dashboard-line', label: 'Dashboard', href: '/dashboard' },
                { icon: 'ri-team-line', label: 'Clientes', href: '/clients' },
            ]
        },
        {
            label: 'Herramientas',
            items: [
                { icon: 'ri-delete-bin-line', label: 'Papelera', href: '/trash' },
                { icon: 'ri-settings-2-line', label: 'Configuración', href: '/settings' },
                { icon: 'ri-road-map-line', label: 'Changelog', href: '/features' },
            ]
        }
    ];

    function handleNavClick() {
        if (window.innerWidth < 768 && onclose) {
            onclose();
        }
    }
</script>

{#if open}
    <button
        type="button"
        onclick={onclose}
        class="fixed inset-0 bg-black/40 z-40 md:hidden"
        aria-label="Cerrar menú"
    ></button>
{/if}

<aside class="flex flex-col w-56 shrink-0 pt-2 pr-5
    fixed top-0 left-0 h-full bg-nudo-bg z-50 transform transition-transform duration-200 ease-in-out
    md:static md:translate-x-0 md:bg-transparent
    {open ? 'translate-x-0' : '-translate-x-full'}">
    <div class="flex items-center justify-between px-4 py-3 md:hidden">
        <span class="text-sm font-bold text-nudo-text-secondary">Menú</span>
        <button type="button" onclick={onclose} class="text-nudo-text-secondary hover:text-nudo-text-primary" aria-label="Cerrar">
            <i class="ri-close-line text-xl" aria-hidden="true"></i>
        </button>
    </div>

    {#each sections as section}
        <div class="mb-6">
            <span class="block px-4 mb-2 text-xs font-bold text-nudo-text-tertiary uppercase tracking-wider">
                {section.label}
            </span>
            <nav class="flex flex-col gap-0.5">
                {#each section.items as item}
                    <a
                        href={item.href}
                        onclick={handleNavClick}
                        class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors duration-150
                            {currentPath === item.href
                                ? 'bg-nudo-accent-bg text-nudo-accent'
                                : 'text-nudo-text-secondary hover:bg-nudo-surface hover:text-nudo-text-primary'}"
                    >
                        <i class="{item.icon} text-lg" aria-hidden="true"></i>
                        {item.label}
                    </a>
                {/each}
            </nav>
        </div>
    {/each}
</aside>
