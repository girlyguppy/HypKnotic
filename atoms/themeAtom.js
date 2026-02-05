import { atom } from 'jotai';
import { themes } from '../styles/ThemeSystem';

// Default to lavender theme
export const themeAtom = atom(themes.lavender);

export const availableThemesAtom = atom(themes);