<script lang="ts">
    import type { LayoutData } from './$types';
    import Navbar from '@ui/components/Navbar.svelte';
    import Sidebar from '@ui/components/Sidebar.svelte';

    let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
    <Navbar {data} />

    <div class="grid grid-cols-[224px_1fr]">
        <Sidebar />
        <div>
            {@render children()}
        </div>
    </div>
</section>
