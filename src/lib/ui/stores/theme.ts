import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { DEFAULT_THEME, isThemeId, type ThemeId } from '@ui/themes';

const STORAGE_KEY = 'theme';

function readStored(): ThemeId {
    if (!browser) return DEFAULT_THEME;

    const stored = localStorage.getItem(STORAGE_KEY);

    return isThemeId(stored) ? stored : DEFAULT_THEME;
}

function apply(theme: ThemeId) {
    if (!browser) return;

    const root = document.documentElement;

    root.dataset.theme = theme;

    // La clase `.dark` se mantiene porque `@custom-variant dark` y las
    // utilidades `dark:*` de Tailwind la siguen usando.
    root.classList.toggle('dark', theme === 'dark');
}

function createThemeStore() {
    const initial = readStored();
    const { subscribe, set } = writable<ThemeId>(initial);

    apply(initial);

    return {
        subscribe,
        set(theme: ThemeId) {
            apply(theme);
            localStorage.setItem(STORAGE_KEY, theme);
            set(theme);
        },
        reset() {
            this.set(DEFAULT_THEME);
        }
    };
}

export const theme = createThemeStore();
