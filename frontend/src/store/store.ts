import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
    theme: 'light' | 'dark';
    themeToggle: () => void;

    language: 'eng' | 'geo';
    languageToggle: () => void;
};

const themeChange = (set: any) => ({
    theme: 'light' as const,
    themeToggle: () =>
        set((s: { theme: 'light' | 'dark' }) => ({
            theme: s.theme === 'light' ? 'dark' : 'light'
        }))
});

const languageChange = (set: any) => ({
    language: 'eng' as const,
    languageToggle: () =>
        set((s: { language: 'eng' | 'geo' }) => ({
            language: s.language === 'eng' ? 'geo' : 'eng'
        }))
});

export const useStore = create<Store>()(
    persist(
        (set) => ({
            ...themeChange(set),
            ...languageChange(set)
        }),
        {
            name: 'social-media-app-data'
        }
    )
);