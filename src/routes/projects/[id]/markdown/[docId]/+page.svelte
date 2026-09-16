<script lang="ts">
    import type { PageData } from "./$types"
    import { marked } from 'marked';
    import Button from "@ui/components/Button.svelte";

    let { data }: { data: PageData } = $props()

    let content = $state(data.doc.current_content);
    let renderedHtml = $derived(marked.parse(content, { async: false }));
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
    <div class="flex items-center justify-between flex-wrap gap-4">
        <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0" style="font-size:clamp(26px,3vw,34px)">
            {data.doc.title}
        </h1>
        <Button type="submit" form="update-doc-form">
            <i class="ri-save-line" aria-hidden="true"></i> Guardar
        </Button>
    </div>

    <form id="update-doc-form" method="POST" action="?/updateDoc" class="grid grid-cols-2 gap-4 items-start w-full max-md:grid-cols-1">
        <textarea
            name="content"
            bind:value={content}
            rows="25"
            class="font-mono p-5 border border-nudo-border rounded-3xl w-full h-[75vh] resize-none text-[14px] leading-relaxed text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent max-md:h-[50vh]"
        ></textarea>

        <div class="prose p-6 border border-nudo-border rounded-3xl w-full h-[75vh] max-w-full overflow-y-auto bg-nudo-surface text-nudo-text-primary max-md:h-[50vh]">
            {@html renderedHtml}
        </div>
    </form>
</section>
