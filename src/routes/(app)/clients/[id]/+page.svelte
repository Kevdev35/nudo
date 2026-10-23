<script lang="ts">
    import type { PageData } from "./$types";
    import Button from "@components/Button.svelte";
    import { enhance } from "$app/forms";
    import { goto, invalidateAll } from "$app/navigation";
    import { projectStatusClass, projectStatusLabel } from "@ui/project-status";
    import { isBackdropClick } from "@ui/modal";

    let { data }: { data: PageData } = $props();

    let settingsDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let deleteDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let projectDialog: HTMLDialogElement = $state() as HTMLDialogElement;
    let settingsLoading = $state(false);
    let settingsError = $state("");
    let deleteLoading = $state(false);
    let deleteError = $state("");
    let projectLoading = $state(false);
    let projectError = $state("");

    let editName = $state("");
    let editEmail = $state("");
    let editPhone = $state("");
    let editLocation = $state("");
    let editNotes = $state("");

    let projectName = $state("");
    let projectDescription = $state("");
    let projectBudget = $state("");

    function openSettings() {
        editName = data.client.name;
        editEmail = data.client.email ?? "";
        editPhone = data.client.phone ?? "";
        editLocation = data.client.location ?? "";
        editNotes = data.client.notes ?? "";
        settingsError = "";
        settingsDialog.showModal();
    }

    function closeSettings() {
        settingsDialog.close();
    }

    function openDelete() {
        closeSettings();
        deleteError = "";
        deleteDialog.showModal();
    }

    function closeDelete() {
        deleteDialog.close();
    }

    function openProject() {
        projectName = "";
        projectDescription = "";
        projectBudget = "";
        projectError = "";
        projectDialog.showModal();
    }

    function closeProject() {
        projectDialog.close();
    }

    function formatBudget(amount: number | null): string {
        if (!amount) return "—";
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
    }

    function formatDate(d: Date | string): string {
        return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    }
</script>


<svelte:head>
    <title>{data.client.name} · Clientes · Nudo</title>
</svelte:head>

<div class="flex flex-col gap-5 pt-1">
    <div class="flex items-center justify-between gap-3">
        <a
            href="/clients"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-nudo-text-secondary no-underline hover:text-nudo-text-primary transition-colors"
        >
            <i class="ri-arrow-left-line text-base" aria-hidden="true"></i>
            Clientes
        </a>
        <button
            type="button"
            onclick={openSettings}
            class="inline-flex items-center gap-1.5 font-semibold text-sm text-nudo-text-secondary py-2 px-2.5 rounded-xl min-h-10 hover:bg-nudo-surface hover:text-nudo-text-primary transition-colors cursor-pointer bg-transparent border-none"
        >
            <i class="ri-settings-3-line text-lg" aria-hidden="true"></i>
            Configuración
        </button>
    </div>

    <!-- Hero del cliente -->
    <header class="flex items-center justify-between flex-wrap gap-5 max-md:flex-col max-md:items-start">
        <div class="flex flex-col gap-1 min-w-0">
            <h1
                class="font-extrabold text-nudo-text-primary uppercase leading-none tracking-tight m-0"
                style="font-size: clamp(26px, 3vw, 36px)"
            >
                {data.client.name}
            </h1>
            {#if data.client.notes}
                <p class="text-nudo-text-secondary text-sm m-0 mt-1 max-w-[560px] whitespace-pre-line break-words">
                    {data.client.notes}
                </p>
            {/if}
        </div>

        <div
            class="flex flex-col gap-3 bg-nudo-surface rounded-2xl py-3 px-5 shrink-0 max-w-full md:max-w-[340px]"
            role="list"
            aria-label="Detalles del cliente"
        >
            {#if data.client.email || data.client.phone || data.client.location}
                <div class="flex flex-col gap-2 min-w-0">
                    {#if data.client.email}
                        <div class="flex items-start gap-2 min-w-0" role="listitem">
                            <i class="ri-mail-line text-nudo-text-tertiary text-base mt-0.5 shrink-0" aria-hidden="true"></i>
                            <a
                                href="mailto:{data.client.email}"
                                class="text-sm font-semibold text-nudo-text-primary no-underline hover:underline break-all"
                            >
                                {data.client.email}
                            </a>
                        </div>
                    {/if}
                    {#if data.client.phone}
                        <div class="flex items-start gap-2 min-w-0" role="listitem">
                            <i class="ri-phone-line text-nudo-text-tertiary text-base mt-0.5 shrink-0" aria-hidden="true"></i>
                            <a
                                href="tel:{data.client.phone}"
                                class="text-sm font-semibold text-nudo-text-primary no-underline hover:underline break-words"
                            >
                                {data.client.phone}
                            </a>
                        </div>
                    {/if}
                    {#if data.client.location}
                        <div class="flex items-start gap-2 min-w-0" role="listitem">
                            <i class="ri-map-pin-line text-nudo-text-tertiary text-base mt-0.5 shrink-0" aria-hidden="true"></i>
                            <span class="text-sm font-semibold text-nudo-text-primary whitespace-pre-line break-words">
                                {data.client.location}
                            </span>
                        </div>
                    {/if}
                </div>
            {/if}
            <div class="flex items-center gap-5 border-t border-nudo-border pt-3">
                <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                    <span class="text-xs text-nudo-text-secondary font-medium">Creado</span>
                    <span class="text-sm font-bold text-nudo-text-primary">{formatDate(data.client.createdAt)}</span>
                </div>
                <div class="flex flex-col gap-px whitespace-nowrap" role="listitem">
                    <span class="text-xs text-nudo-text-secondary font-medium">Proyectos</span>
                    <span class="text-sm font-bold text-nudo-text-primary">{data.projects.length}</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Proyectos del cliente -->
    <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
            <h2 class="text-nudo-text-primary text-lg font-extrabold tracking-tight m-0">Proyectos</h2>
            <button
                type="button"
                onclick={openProject}
                class="inline-flex items-center gap-1.5 font-semibold text-sm text-nudo-text-secondary py-2 px-3 rounded-xl min-h-10 hover:bg-nudo-surface hover:text-nudo-text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
                <i class="ri-add-line text-lg" aria-hidden="true"></i>
                Nuevo proyecto
            </button>
        </div>

        {#if data.projects.length === 0}
            <div class="flex flex-col items-center justify-center gap-1.5 text-center py-14 px-5 bg-nudo-surface rounded-3xl">
                <i class="ri-folder-open-line text-nudo-text-tertiary text-[26px] mb-1" aria-hidden="true"></i>
                <p class="m-0 text-[15px] font-semibold text-nudo-text-primary">Este cliente no tiene proyectos</p>
                <p class="m-0 text-[14px] text-nudo-text-secondary">Creá uno con el botón de arriba.</p>
            </div>
        {:else}
            <div class="flex flex-col gap-2">
                {#each data.projects as project (project.id)}
                    <a
                        href="/projects/{project.id}"
                        class="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 bg-nudo-surface rounded-3xl no-underline text-inherit hover:bg-nudo-bg hover:shadow-sm transition-all duration-150"
                    >
                        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-nudo-accent-soft flex items-center justify-center text-lg sm:text-xl text-nudo-accent shrink-0">
                            <i class="ri-folder-3-line" aria-hidden="true"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm sm:text-base font-semibold text-nudo-text-primary m-0 truncate">{project.name}</p>
                            <div class="flex items-center gap-2 sm:gap-2.5 mt-1">
                                <span class="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full {projectStatusClass(project.status)}">
                                    {projectStatusLabel(project.status)}
                                </span>
                                {#if project.description}
                                    <span class="text-[10px] sm:text-xs text-nudo-text-tertiary truncate max-w-[140px] sm:max-w-[260px]">
                                        {project.description}
                                    </span>
                                {/if}
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-1 shrink-0">
                            {#if project.budget}
                                <span class="text-xs sm:text-sm font-bold text-nudo-text-primary">{formatBudget(project.budget)}</span>
                            {/if}
                            <span class="text-[10px] sm:text-xs text-nudo-text-tertiary">{formatDate(project.createdAt)}</span>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </section>
</div>

<!-- Modal: Configuración del cliente -->
<dialog
    bind:this={settingsDialog}
    onclick={(e) => isBackdropClick(e, settingsDialog) && closeSettings()}
    class="fixed inset-0 m-auto max-w-lg w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40 max-h-[90vh] overflow-y-auto"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Configuración del cliente</h2>
        <button onclick={closeSettings} class="icon-btn" aria-label="Cerrar">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    {#if settingsError}
        <div class="mb-5 p-3 rounded-2xl bg-nudo-danger-soft text-nudo-danger text-sm font-medium flex items-center gap-2">
            <i class="ri-error-warning-line text-lg" aria-hidden="true"></i> {settingsError}
        </div>
    {/if}

    <form
        method="POST"
        action="?/updateClient"
        use:enhance={() => {
            settingsLoading = true;
            settingsError = "";
            return async ({ result }) => {
                settingsLoading = false;
                if (result.type === "success") {
                    closeSettings();
                    await invalidateAll();
                } else if (result.type === "failure") {
                    settingsError = (result.data as any)?.error ?? "Error al guardar";
                }
            };
        }}
        class="flex flex-col gap-4"
    >
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Nombre</span>
            <input
                name="name"
                type="text"
                required
                bind:value={editName}
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors"
            />
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Email</span>
                <input
                    name="email"
                    type="email"
                    bind:value={editEmail}
                    placeholder="cliente@correo.com"
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors"
                />
            </label>
            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Teléfono</span>
                <input
                    name="phone"
                    type="tel"
                    bind:value={editPhone}
                    placeholder="+52 555 000 0000"
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors"
                />
            </label>
        </div>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Ubicación</span>
            <input
                name="location"
                type="text"
                bind:value={editLocation}
                placeholder="Ciudad, dirección..."
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors"
            />
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Notas</span>
            <textarea
                name="notes"
                rows="3"
                bind:value={editNotes}
                placeholder="Notas adicionales..."
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors resize-none"
            ></textarea>
        </label>

        <div class="flex justify-between items-center mt-2 gap-3 flex-wrap">
            <button
                type="button"
                onclick={openDelete}
                class="flex items-center gap-2 text-sm text-nudo-danger hover:text-nudo-danger cursor-pointer bg-transparent border-none font-inherit font-medium transition-colors"
            >
                <i class="ri-delete-bin-line text-base" aria-hidden="true"></i>
                Eliminar cliente
            </button>
            <div class="flex gap-2.5">
                <Button type="button" onclick={closeSettings}>Cancelar</Button>
                <Button type="submit" disabled={settingsLoading}>
                    {settingsLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
            </div>
        </div>
    </form>
</dialog>

<!-- Modal: Nuevo proyecto para este cliente -->
<dialog
    bind:this={projectDialog}
    onclick={(e) => isBackdropClick(e, projectDialog) && closeProject()}
    class="fixed inset-0 m-auto max-w-lg w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40 max-h-[90vh] overflow-y-auto"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Nuevo proyecto</h2>
        <button onclick={closeProject} class="icon-btn" aria-label="Cerrar">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    <p class="text-sm text-nudo-text-secondary m-0 mb-5">
        Se creará a nombre de <strong class="text-nudo-text-primary">{data.client.name}</strong>.
    </p>

    {#if projectError}
        <div class="mb-5 p-3 rounded-2xl bg-nudo-danger-soft text-nudo-danger text-sm font-medium flex items-center gap-2">
            <i class="ri-error-warning-line text-lg" aria-hidden="true"></i> {projectError}
        </div>
    {/if}

    <form
        method="POST"
        action="?/createProject"
        use:enhance={() => {
            projectLoading = true;
            projectError = "";
            return async ({ result }) => {
                projectLoading = false;
                if (result.type === "failure") {
                    projectError = (result.data as any)?.error ?? "Error al crear el proyecto";
                } else if (result.type === "redirect") {
                    await goto(result.location);
                }
            };
        }}
        class="flex flex-col gap-4"
    >
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Nombre</span>
            <input
                name="name"
                type="text"
                required
                bind:value={projectName}
                placeholder="Nombre del proyecto"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors"
            />
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Descripción</span>
            <textarea
                name="description"
                rows="3"
                bind:value={projectDescription}
                placeholder="¿De qué trata?"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors resize-none"
            ></textarea>
        </label>
        <label class="flex flex-col gap-2">
            <span class="text-sm font-semibold text-nudo-text-secondary">Presupuesto (MXN)</span>
            <input
                name="budget"
                type="number"
                min="0"
                step="0.01"
                bind:value={projectBudget}
                placeholder="Opcional"
                class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-surface focus:outline-none focus:border-nudo-accent transition-colors"
            />
        </label>

        <div class="flex justify-end gap-2.5 mt-2">
            <Button type="button" onclick={closeProject}>Cancelar</Button>
            <Button type="submit" disabled={projectLoading}>
                {projectLoading ? "Creando..." : "Crear proyecto"}
            </Button>
        </div>
    </form>
</dialog>

<!-- Modal: Eliminar cliente -->
<dialog
    bind:this={deleteDialog}
    onclick={(e) => isBackdropClick(e, deleteDialog) && closeDelete()}
    class="fixed inset-0 m-auto max-w-md w-full p-7 border-none rounded-3xl bg-nudo-bg shadow-2xl backdrop:bg-black/40"
>
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-extrabold text-nudo-text-primary m-0">Eliminar cliente</h2>
        <button onclick={closeDelete} class="icon-btn" aria-label="Cerrar">
            <i class="ri-close-line" aria-hidden="true"></i>
        </button>
    </div>

    {#if data.projects.length > 0}
        <div class="flex flex-col items-center text-center gap-3 mb-6">
            <div class="w-14 h-14 rounded-full bg-nudo-warning-soft flex items-center justify-center">
                <i class="ri-error-warning-line text-nudo-warning text-2xl" aria-hidden="true"></i>
            </div>
            <p class="text-nudo-text-primary font-semibold m-0">Este cliente todavía tiene proyectos</p>
            <p class="text-nudo-text-secondary text-sm m-0">
                Para borrarlo, primero reasigná o eliminá
                {data.projects.length === 1 ? "su proyecto" : "sus proyectos"}:
            </p>
            <ul class="flex flex-col gap-1.5 w-full m-0 p-0 list-none">
                {#each data.projects as project (project.id)}
                    <li>
                        <a
                            href="/projects/{project.id}"
                            class="flex items-center gap-2 justify-center text-sm font-semibold text-nudo-text-primary no-underline bg-nudo-surface rounded-xl px-3 py-2 hover:bg-nudo-bg transition-colors"
                        >
                            <i class="ri-folder-3-line text-nudo-accent" aria-hidden="true"></i>
                            {project.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="flex justify-end gap-2.5">
            <Button type="button" onclick={closeDelete}>Entendido</Button>
        </div>
    {:else}
        <div class="flex flex-col items-center text-center gap-3 mb-6">
            <div class="w-14 h-14 rounded-full bg-nudo-danger-soft flex items-center justify-center">
                <i class="ri-error-warning-line text-nudo-danger text-2xl" aria-hidden="true"></i>
            </div>
            <p class="text-nudo-text-primary font-semibold m-0">¿Estás seguro de eliminar este cliente?</p>
            <p class="text-nudo-text-secondary text-sm m-0">
                Se eliminará <strong class="text-nudo-text-primary">{data.client.name}</strong>. Esta acción no se puede deshacer.
            </p>
        </div>

        {#if deleteError}
            <div class="mb-5 p-3 rounded-2xl bg-nudo-danger-soft text-nudo-danger text-sm font-medium flex items-center gap-2">
                <i class="ri-error-warning-line text-lg" aria-hidden="true"></i> {deleteError}
            </div>
        {/if}

        <form
            method="POST"
            action="?/deleteClient"
            use:enhance={() => {
                deleteLoading = true;
                deleteError = "";
                return async ({ result }) => {
                    deleteLoading = false;
                    if (result.type === "failure") {
                        deleteError = (result.data as any)?.error ?? "Error al eliminar el cliente";
                    } else if (result.type === "redirect") {
                        await goto(result.location);
                    }
                };
            }}
            class="flex justify-end gap-2.5"
        >
            <Button type="button" onclick={closeDelete}>Cancelar</Button>
            <button
                type="submit"
                disabled={deleteLoading}
                class="px-5 py-2.5 rounded-xl bg-nudo-danger text-nudo-danger-on text-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-colors disabled:opacity-50"
            >
                {deleteLoading ? "Eliminando..." : "Sí, eliminar"}
            </button>
        </form>
    {/if}
</dialog>

