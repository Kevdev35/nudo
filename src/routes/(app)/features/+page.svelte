<script lang="ts">
    const versions = [
        {
            version: '0.4',
            title: 'Apariencia y pulido',
            date: 'Sep 2025',
            tag: 'Última',
            tagColor: 'bg-nudo-accent-bg text-nudo-accent',
            changes: [
                { icon: 'ri-user-settings-line', text: 'Configuración de perfil: cambiar nombre, email y contraseña', type: 'feat' },
                { icon: 'ri-palette-line', text: 'Selector de tema oscuro/claro', type: 'feat' },
                { icon: 'ri-delete-bin-line', text: 'Papelera: los proyectos eliminados se pueden restaurar', type: 'feat' },
                { icon: 'ri-smartphone-line', text: 'Menú lateral adaptable a móvil', type: 'feat' },
                { icon: 'ri-layout-masonry-line', text: 'Diseño adaptable en dashboard, clientes y papelera', type: 'feat' },
                { icon: 'ri-dark-mode-line', text: 'El tema oscuro ya no parpadea al navegar', type: 'fix' },
                { icon: 'ri-keyboard-line', text: 'Corregido autocompletado no deseado en formularios', type: 'fix' },
            ]
        },
        {
            version: '0.3',
            title: 'Detalle de proyecto',
            date: 'Sep 2025',
            changes: [
                { icon: 'ri-file-text-line', text: 'Notas con colores personalizables, vista de cuadrícula y lista', type: 'feat' },
                { icon: 'ri-kanban-view', text: 'Tablero Kanban con arrastrar y soltar tarjetas', type: 'feat' },
                { icon: 'ri-booklet-line', text: 'Editor de markdown con vista dividida', type: 'feat' },
                { icon: 'ri-attachment-2', text: 'Subir y gestionar archivos adjuntos', type: 'feat' },
                { icon: 'ri-search-line', text: 'Búsqueda global dentro del proyecto con resaltado', type: 'feat' },
                { icon: 'ri-settings-3-line', text: 'Configurar nombre, descripción, estado y presupuesto del proyecto', type: 'feat' },
                { icon: 'ri-delete-bin-line', text: 'Eliminar proyecto con confirmación', type: 'feat' },
                { icon: 'ri-dashboard-line', text: 'Resumen con estadísticas y actividad reciente', type: 'feat' },
            ]
        },
        {
            version: '0.2',
            title: 'Dashboard',
            date: 'Ago 2025',
            changes: [
                { icon: 'ri-folder-3-line', text: 'Crear, editar y eliminar proyectos', type: 'feat' },
                { icon: 'ri-team-line', text: 'Crear y gestionar clientes', type: 'feat' },
                { icon: 'ri-dashboard-line', text: 'Panel principal con lista de proyectos', type: 'feat' },
                { icon: 'ri-menu-line', text: 'Menú lateral con navegación por secciones', type: 'feat' },
                { icon: 'ri-login-box-line', text: 'Barra de navegación con saludo y cerrar sesión', type: 'feat' },
            ]
        },
        {
            version: '0.1',
            title: 'Los cimientos',
            date: 'Ago 2025',
            changes: [
                { icon: 'ri-lock-line', text: 'Registro, inicio de sesión y sesiones seguras', type: 'feat' },
                { icon: 'ri-shield-line', text: 'Contraseñas encriptadas', type: 'feat' },
                { icon: 'ri-palette-line', text: 'Sistema de diseño propio con tema oscuro', type: 'feat' },
                { icon: 'ri-moon-line', text: 'Modo oscuro en toda la aplicación', type: 'feat' },
            ]
        },
    ];

    const typeStyles: Record<string, string> = {
        feat: 'bg-nudo-success-soft text-nudo-success',
        fix: 'bg-red-500/10 text-red-500',
    };

    const typeLabels: Record<string, string> = {
        feat: 'Nuevo',
        fix: 'Corregido',
    };
</script>

<h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0 mb-2" style="font-size:clamp(24px,3vw,34px)">
    Changelog
</h1>
<p class="text-sm text-nudo-text-secondary m-0 mb-8">
    Historial de versiones y funcionalidades de Nudo.
</p>

<div class="flex flex-col gap-10">
    {#each versions as v, i}
        <div class="relative flex gap-6">
            {#if i < versions.length - 1}
                <div class="absolute left-[15px] top-[36px] bottom-0 w-px bg-nudo-border"></div>
            {/if}

            <div class="relative z-10 w-8 h-8 rounded-full bg-nudo-surface border-2 border-nudo-border flex items-center justify-center shrink-0 mt-1">
                <span class="text-xs font-bold text-nudo-text-secondary">{v.version.split('.')[0]}</span>
            </div>

            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 class="text-lg font-extrabold text-nudo-text-primary m-0">
                        v{v.version} — {v.title}
                    </h2>
                    {#if v.tag}
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full {v.tagColor}">
                            {v.tag}
                        </span>
                    {/if}
                    <span class="text-xs text-nudo-text-tertiary">{v.date}</span>
                </div>

                <div class="flex flex-col gap-1.5">
                    {#each v.changes as change}
                        <div class="flex items-center gap-3 py-1.5">
                            <i class="{change.icon} text-base text-nudo-text-tertiary w-5 text-center shrink-0" aria-hidden="true"></i>
                            <span class="text-sm text-nudo-text-primary flex-1">{change.text}</span>
                            <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md {typeStyles[change.type]} shrink-0">
                                {typeLabels[change.type]}
                            </span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/each}
</div>

<div class="mt-10 p-5 bg-nudo-surface rounded-3xl text-center">
    <p class="text-sm text-nudo-text-secondary m-0">
        Próximamente más funcionalidades.
        <span class="font-semibold text-nudo-text-primary">Nudo</span> está en desarrollo activo.
    </p>
</div>
