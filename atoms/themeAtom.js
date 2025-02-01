import { atom } from 'jotai';
import { lavenderTheme, darkTheme, LatexTheme, babyBlueTheme, vampireTheme, fairyTheme, barbieTheme, forestTheme } from '../styles/Themes';

export const themeAtom = atom(lavenderTheme);

export const availableThemesAtom = atom({
  lavender: lavenderTheme,
  dark: darkTheme,
  latex: LatexTheme,
  babyBlue: babyBlueTheme,
  vampire: vampireTheme,
  fairy: fairyTheme,
  barbie: barbieTheme,
  forest: forestTheme,
});