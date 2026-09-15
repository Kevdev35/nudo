<script lang="ts">
    import type {PageData} from "./$types"

    import Button from "@ui/components/Button.svelte";
    
    import Navbar from "@ui/components/Navbar.svelte";
    let {data}: {data: PageData} = $props()
    
    let dialogRef: HTMLDialogElement = $state() as HTMLDialogElement

    function openModal() {
        dialogRef.showModal()
    }

    function closeModal() {
        dialogRef.close()
    }
</script>

<section>

    <Navbar {data}/>

    <header class="">
        <div class="flex justify-between gap-5 px-6 py-8 h-4 items-center  ">
            <div class="flex gap-7 items-center">
                <a href="/dashboard" class="font-bold text-2xl">
                    <i class="ri-arrow-left-s-line"></i> 
                    Volver
                </a>
            </div>

            <div>
                <input type="search" name="" id="" placeholder="Buscar notas, markdowns, archivos, etc...">
            </div>

            <Button onclick={openModal}>
                <i class="ri-add-line text-lg"></i> Añadir cliente
            </Button>

        </div>
        
    </header>

    <dialog
        bind:this={dialogRef}
        onclick={(e) => e.target === dialogRef && closeModal()}
        class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
    >
        <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold">Crear nuevo proyecto</h2>
            <button onclick={closeModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl"><i class="ri-close-line"></i></button>
        </div>

        <form method="POST" action="?/createClient" class="mt-4 flex flex-col gap-4">
            <label class="flex flex-col gap-1">
                <span>Nombre del liente</span>
                <input name="name" type="text" required class="rounded-3xl border p-5" placeholder="Nombre de tu cliente"/>
            </label>

            <label class="flex flex-col gap-1">
                <span>Descripción</span>
                <textarea name="contact_info" class="rounded border p-2"></textarea>
            </label>

            <label class="flex flex-col gap-1">
                <span>Notas</span>
                <input name="notes" type="number" class="rounded border p-2" />
            </label>

            <div class="mt-4 flex justify-end gap-2">
                <Button type="button" onclick={closeModal}>
                    Cancelar
                </Button>
                <Button type="submit" icon="ri-save-line">Añadir Cliente</Button>
            </div>
        </form>
    </dialog>

    <div class="mx-4 my-2 px-4  ">
        <ul>
            {#each data.clients as client}
            <li class="my-3 px-5 py-6 bg-[#e6e6e6] rounded-3xl" >
                <p class="font-bold text-2xl">{client.name}</p>
                <p class="font-semibold">{client.contact_info}</p>
                <p>{client.notes}</p>
            </li>
            {/each}
        </ul>
    </div>
</section>