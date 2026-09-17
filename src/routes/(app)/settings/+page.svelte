<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import Button from '@components/Button.svelte';
    import ThemeToggle from '@ui/components/ThemeToggle.svelte';

    let { data }: { data: PageData } = $props();

    let profileLoading = $state(false);
    let profileMessage = $state('');
    let profileError = $state('');

    let passwordLoading = $state(false);
    let passwordMessage = $state('');
    let passwordError = $state('');
</script>

<h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0 mb-6" style="font-size:clamp(24px,3vw,34px)">
    Configuración
</h1>

<div class="flex flex-col gap-8 max-w-2xl">
    <!-- Perfil -->
    <section class="bg-nudo-surface rounded-3xl p-6">
        <h2 class="text-lg font-bold text-nudo-text-primary m-0 mb-5">Perfil</h2>

        {#if profileMessage}
            <div class="mb-4 p-3 rounded-2xl bg-green-500/10 text-green-600 text-sm font-medium flex items-center gap-2">
                <i class="ri-check-line text-lg"></i> {profileMessage}
            </div>
        {/if}

        {#if profileError}
            <div class="mb-4 p-3 rounded-2xl bg-red-500/10 text-red-500 text-sm font-medium flex items-center gap-2">
                <i class="ri-error-warning-line text-lg"></i> {profileError}
            </div>
        {/if}

        <form
            method="POST"
            action="?/updateProfile"
            use:enhance={() => {
                profileLoading = true;
                profileMessage = '';
                profileError = '';
                return async ({ result }) => {
                    profileLoading = false;
                    if (result.type === 'success') {
                        profileMessage = (result.data as any)?.message ?? 'Guardado';
                    } else if (result.type === 'failure') {
                        profileError = (result.data as any)?.error ?? 'Error al guardar';
                    }
                };
            }}
            class="flex flex-col gap-4"
        >
            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Nombre</span>
                <input name="name" type="text" required value={data.user?.name ?? ''}
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent transition-colors" />
            </label>

            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Email</span>
                <input name="email" type="email" required value={data.user?.email ?? ''}
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent transition-colors" />
            </label>

            <div class="flex justify-end mt-2">
                <Button type="submit" disabled={profileLoading}>
                    {profileLoading ? 'Guardando...' : 'Guardar perfil'}
                </Button>
            </div>
        </form>
    </section>

    <!-- Contraseña -->
    <section class="bg-nudo-surface rounded-3xl p-6">
        <h2 class="text-lg font-bold text-nudo-text-primary m-0 mb-5">Cambiar contraseña</h2>

        {#if passwordMessage}
            <div class="mb-4 p-3 rounded-2xl bg-green-500/10 text-green-600 text-sm font-medium flex items-center gap-2">
                <i class="ri-check-line text-lg"></i> {passwordMessage}
            </div>
        {/if}

        {#if passwordError}
            <div class="mb-4 p-3 rounded-2xl bg-red-500/10 text-red-500 text-sm font-medium flex items-center gap-2">
                <i class="ri-error-warning-line text-lg"></i> {passwordError}
            </div>
        {/if}

        <form
            method="POST"
            action="?/changePassword"
            use:enhance={() => {
                passwordLoading = true;
                passwordMessage = '';
                passwordError = '';
                return async ({ result }) => {
                    passwordLoading = false;
                    if (result.type === 'success') {
                        passwordMessage = (result.data as any)?.message ?? 'Contraseña actualizada';
                    } else if (result.type === 'failure') {
                        passwordError = (result.data as any)?.error ?? 'Error al cambiar contraseña';
                    }
                };
            }}
            class="flex flex-col gap-4"
        >
            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Contraseña actual</span>
                <input name="currentPassword" type="password" required placeholder="••••••••"
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent transition-colors" />
            </label>

            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Nueva contraseña</span>
                <input name="newPassword" type="password" required placeholder="Mínimo 6 caracteres" minlength="6"
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent transition-colors" />
            </label>

            <label class="flex flex-col gap-2">
                <span class="text-sm font-semibold text-nudo-text-secondary">Confirmar contraseña</span>
                <input name="confirmPassword" type="password" required placeholder="Repite la contraseña" minlength="6"
                    class="border border-nudo-border rounded-2xl px-4 py-3.5 text-[15px] text-nudo-text-primary bg-nudo-bg focus:outline-none focus:border-nudo-accent transition-colors" />
            </label>

            <div class="flex justify-end mt-2">
                <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                </Button>
            </div>
        </form>
    </section>

    <!-- Apariencia -->
    <section class="bg-nudo-surface rounded-3xl p-6">
        <h2 class="text-lg font-bold text-nudo-text-primary m-0 mb-5">Apariencia</h2>

        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-semibold text-nudo-text-primary m-0">Tema</p>
                <p class="text-xs text-nudo-text-tertiary m-0 mt-1">Cambia entre modo claro y oscuro</p>
            </div>
            <ThemeToggle />
        </div>
    </section>
</div>
