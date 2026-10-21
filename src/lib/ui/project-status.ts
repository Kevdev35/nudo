import type { ProjectStatus } from '@entities/project-entity';

export const PROJECT_STATUSES: ReadonlyArray<{ value: ProjectStatus; label: string }> = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'activo', label: 'Activo' },
    { value: 'terminado', label: 'Terminado' },
];

const statusClasses: Record<ProjectStatus, string> = {
    activo: 'bg-nudo-success-soft text-nudo-success',
    pendiente: 'bg-nudo-warning-soft text-nudo-warning',
    terminado: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function projectStatusClass(status: string | null | undefined): string {
    return statusClasses[(status ?? 'pendiente') as ProjectStatus] ?? statusClasses.pendiente;
}

export function projectStatusLabel(status: string | null | undefined): string {
    return PROJECT_STATUSES.find((s) => s.value === status)?.label ?? 'Pendiente';
}
