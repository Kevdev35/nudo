export type ThemeId = 'light' | 'dark';

export type ThemeDefinition = {
    id: ThemeId;
    label: string;
    description: string;
    /** Colores solo para la preview de la tarjeta en Configuración. */
    preview: {
        bg: string;
        surface: string;
        border: string;
        text: string;
        accent: string;
    };
};

export const THEMES: ThemeDefinition[] = [
    {
        id: 'light',
        label: 'Claro',
        description: 'Fondo blanco, ideal para ambientes con mucha luz.',
        preview: {
            bg: '#ffffff',
            surface: '#f7f7f8',
            border: '#e5e5ea',
            text: '#1d1d1f',
            accent: '#0a84ff'
        }
    },
    {
        id: 'dark',
        label: 'Oscuro',
        description: 'Fondo negro, menos fatiga visual de noche.',
        preview: {
            bg: '#141414',
            surface: '#1c1c1c',
            border: '#2a2a2a',
            text: '#f5f5f5',
            accent: '#3b82f6'
        }
    }
];

export const DEFAULT_THEME: ThemeId = 'dark';

export function isThemeId(value: unknown): value is ThemeId {
    return typeof value === 'string' && THEMES.some((theme) => theme.id === value);
}

export function getTheme(id: string): ThemeDefinition | undefined {
    return THEMES.find((theme) => theme.id === id);
}
