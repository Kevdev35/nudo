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
    class="cursor-pointer py-2.5 px-5 rounded-2xl text-nudo-on-accent bg-nudo-accent transition-colors duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 {className}"
>
    {#if icon}
        <i class="{icon}"></i>
    {/if}
    {@render children()}
</button>
