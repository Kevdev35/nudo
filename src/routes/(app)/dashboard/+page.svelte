<script lang="ts">
    import type {PageData} from "./$types"
    import Button from '@components/Button.svelte'

    import Navbar from "@ui/components/Navbar.svelte";
    let { data }: { data: PageData} = $props()
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

    <div class="flex gap-2 justify-between px-10">

        <div class="flex">
            <h2 class="font-bold text-5xl flex items-center">Mis proyectos</h2>
        </div>

        <div>
            <a href="/clients" class="py-5 px-7 rounded-3xl text-amber-50 bg-black">Ver clientes</a>

            <Button onclick={openModal}>
                <i class="ri-add-line text-lg"></i> Nuevo proyecto
            </Button>
        </div>
    </div>

    
    <dialog
        bind:this={dialogRef}
        onclick={(e) => e.target === dialogRef && closeModal()}
        class="fixed inset-0 m-auto max-w-md w-full py-8 px-10 rounded-3xl bg-white shadow-xl backdrop:bg-black/50"
    >
        <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold">Crear nuevo proyecto</h2>
            <button onclick={closeModal} class="cursor-pointer text-gray-500 hover:text-black text-2xl"><i class="ri-close-line"></i></button>
        </div>

        <form method="POST" action="?/createProject" class="mt-4 flex flex-col gap-4">
            <label class="flex flex-col gap-1">
                <span>Nombre</span>
                <input name="name" type="text" required class="rounded-3xl border p-5" placeholder="Nombre del proyecto"/>
            </label>

            <label class="flex flex-col gap-1">
                <span>Descripción</span>
                <textarea name="description" class="rounded border p-2"></textarea>
            </label>

            <label class="flex flex-col gap-1">
                <span>Cliente</span>
                <select name="clientId" class="rounded border p-2">
                    <option value="">Proyecto propio</option>
                    {#each data.clients as client}
                        <option value={client.id}>{client.name}</option>
                    {/each}
                </select>
            </label>

            <label class="flex flex-col gap-1">
                <span>Presupuesto</span>
                <input name="budget" type="number" step="0.01" class="rounded border p-2" />
            </label>

            <div class="mt-4 flex justify-end gap-2">
                <Button type="button" onclick={closeModal}>
                    Cancelar
                </Button>
                <Button type="submit" icon="ri-save-line">Crear proyecto</Button>
            </div>
        </form>
    </dialog>

    
    {#if data.projects.length === 0}
        <p>Aún no tienes proyectos.</p>
    {:else}
        <ul class="m-2">
            {#each data.projects as project}
                <li class="mx-4 my-2 px-4 py-6">
                    <a href="/projects/{project.id}" class=" px-4 py-6 bg-[#e6e6e6] rounded-3xl">
                        <span class="text-lg font-bold">{project.name}</span> — {project.status}
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</section>