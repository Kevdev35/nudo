<script lang="ts">
    import type { LayoutData } from './$types';
    import Navbar from '@ui/components/Navbar.svelte';
    import Sidebar from '@ui/components/Sidebar.svelte';

    let { data, children }: { data: LayoutData; children: any } = $props();
    let sidebarOpen = $state(false);
</script>

<section class="bg-nudo-bg flex flex-col min-h-screen md:gap-5 md:px-8 pb-12 pt-1">
    <Navbar {data} onmenuclick={() => sidebarOpen = true} />

    <div class="flex flex-1">
        <Sidebar open={sidebarOpen} onclose={() => sidebarOpen = false} />
        <div class="flex-1 min-w-0 px-4 md:px-0">
            {@render children()}
        </div>
    </div>
</section>
