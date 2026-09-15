<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        type = 'button',
        disabled = false,
        icon = '',
        form = undefined,
        class: className = '',
        onclick,
        children
    }: {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        icon?: string;
        form?: string;
        class?: string;
        onclick?: () => void;
        children: Snippet;
    } = $props();
</script>

<button
    {type}
    {form}
    {disabled}
    {onclick}
    class="cursor-pointer py-4 px-6 rounded-3xl text-amber-50 bg-black transition-colors duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 {className}"
>
    {#if icon}
        <i class="{icon}"></i>
    {/if}
    {@render children()}
</button>
