<script lang="ts">
    import type { PageData } from "./$types"
    import { marked } from 'marked';

    import Button from "@ui/components/Button.svelte";

    let { data }: { data: PageData } = $props()

    let content = $state(data.doc.current_content);
    let renderedHtml = $derived(marked.parse(content, { async: false }));
</script>

<section class="flex flex-col gap-4">
    <!-- Header con el título a la izquierda y el botón a la derecha -->
    <div class="flex items-center justify-between mx-5">
        <h2 class="text-7xl font-bold">{data.doc.title}</h2>
        
        <!-- Al agregar form="update-doc-form" se vincula al <form> aunque esté afuera -->
        <Button type="submit" form="update-doc-form" icon="ri-save-line" >Guardar</Button>
    </div>

    <!-- Formulario identificado con id -->
    <div class="flex min-w-full">
        <form id="update-doc-form" method="POST" action="?/updateDoc" class="w-full m-2">
            <div class="grid grid-cols-2 gap-4 items-start">
                <textarea 
                    name="content" 
                    bind:value={content} 
                    rows="25" 
                    class="font-mono p-4 border rounded-3xl w-full h-dvh resize-none"
                ></textarea>
                
                <div class="prose p-6 border rounded-3xl w-full h-dvh max-w-full overflow-y-auto bg-[#fafafa]" >
                    {@html renderedHtml}
                </div>
            </div>
        </form>
    </div>
</section>