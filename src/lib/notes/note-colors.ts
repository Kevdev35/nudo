export type NoteColorName = 'default' | 'amarillo' | 'rosa' | 'azul' | 'verde' | 'morado' | 'naranja';

export interface NoteColor {
    name: NoteColorName;
    bg: string;
    text: string;
    border: string;
}

// Para añadir nuevos colores, solo hay que añadir un objeto aquí.
// Los helpers se encargan del resto sin tocar la vista ni los modales.
export const noteColors: readonly NoteColor[] = [
    { name: 'default', bg: 'var(--nudo-surface)', text: 'var(--nudo-text-primary)', border: 'var(--nudo-border)' },
    { name: 'amarillo', bg: 'var(--nudo-note-amarillo-bg)', text: 'var(--nudo-note-amarillo-text)', border: 'var(--nudo-note-amarillo-border)' },
    { name: 'rosa', bg: 'var(--nudo-note-rosa-bg)', text: 'var(--nudo-note-rosa-text)', border: 'var(--nudo-note-rosa-border)' },
    { name: 'azul', bg: 'var(--nudo-note-azul-bg)', text: 'var(--nudo-note-azul-text)', border: 'var(--nudo-note-azul-border)' },
    { name: 'verde', bg: 'var(--nudo-note-verde-bg)', text: 'var(--nudo-note-verde-text)', border: 'var(--nudo-note-verde-border)' },
    { name: 'morado', bg: 'var(--nudo-note-morado-bg)', text: 'var(--nudo-note-morado-text)', border: 'var(--nudo-note-morado-border)' },
    { name: 'naranja', bg: 'var(--nudo-note-naranja-bg)', text: 'var(--nudo-note-naranja-text)', border: 'var(--nudo-note-naranja-border)' },
] as const;

export const DEFAULT_NOTE_COLOR: NoteColorName = 'default';

const colorMap = new Map<string, NoteColor>(
    noteColors.map((color) => [color.name, color])
);

function resolveColor(name: string | null | undefined): NoteColor {
    if (!name) return colorMap.get(DEFAULT_NOTE_COLOR)!;
    return colorMap.get(name) ?? colorMap.get(DEFAULT_NOTE_COLOR)!;
}

export function getNoteColor(name: string | null | undefined): NoteColor {
    return resolveColor(name);
}

export function getNoteBg(name: string | null | undefined): string {
    return resolveColor(name).bg;
}

export function getNoteText(name: string | null | undefined): string {
    return resolveColor(name).text;
}

export function getNoteBorder(name: string | null | undefined): string {
    return resolveColor(name).border;
}

// Usamos `background` (no `background-color`) porque en Liquid Lite el valor puede ser un gradiente.
export function getNoteStyle(name: string | null | undefined): string {
    const color = resolveColor(name);
    return `background: ${color.bg}; color: ${color.text}; border-color: ${color.border}`;
}
