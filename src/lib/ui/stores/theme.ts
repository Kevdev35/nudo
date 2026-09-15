import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
    const stored = browser ? localStorage.getItem('theme') as Theme | null : null;
    const initial: Theme = stored ?? 'dark';
    const { subscribe, set } = writable<Theme>(initial);

    if (browser) {
        document.documentElement.classList.toggle('dark', initial === 'dark');
    }

    return {
        subscribe,
        toggle() {
            const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            document.documentElement.classList.toggle('dark', next === 'dark');
            localStorage.setItem('theme', next);
            set(next);
        }
    };
}

export const theme = createThemeStore();
