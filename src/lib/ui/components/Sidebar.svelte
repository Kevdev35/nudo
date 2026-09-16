<script lang="ts">
    let currentPath = $state('/dashboard');

    if (typeof window !== 'undefined') {
        currentPath = window.location.pathname;
    }

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
            ]
        }
    ];
</script>

<aside class="flex flex-col w-56 shrink-0 pt-2 pr-5">
    {#each sections as section}
        <div class="mb-6">
            <span class="block px-4 mb-2 text-xs font-bold text-nudo-text-tertiary uppercase tracking-wider">
                {section.label}
            </span>
            <nav class="flex flex-col gap-0.5">
                {#each section.items as item}
                    <a
                        href={item.href}
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
