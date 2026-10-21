export type ThemeId = 'light' | 'dark' | 'liquid';

export type ThemeDefinition = {
    id: ThemeId;
    label: string;
    description: string;
    /** Los temas que no son ni claro ni oscuro pisan el modo base. */
    base: 'light' | 'dark';
    /** Tema en desarrollo: se muestra con un chip "Beta" en el selector. */
    beta?: boolean;
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
        base: 'light',
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
        base: 'dark',
        preview: {
            bg: '#141414',
            surface: '#1c1c1c',
            border: '#2a2a2a',
            text: '#f5f5f5',
            accent: '#3b82f6'
        }
    },
    {
        id: 'liquid',
        label: 'Liquid Lite',
        description: 'Vidrio translúcido con luz ambiental. Beta, solo oscuro.',
        base: 'dark',
        beta: true,
        preview: {
            bg: '#080a0f',
            surface: 'rgba(18,24,38,0.65)',
            border: 'rgba(255,255,255,0.14)',
            text: '#f1f5f9',
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
