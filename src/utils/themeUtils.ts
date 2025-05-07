// utils/themeUtils.ts
import { brandThemes } from "./brandThemes";

export type ThemeColorSet = typeof brandThemes.apple;

export function applyBrandTheme(theme: ThemeColorSet) {
  const root = document.documentElement;
  root.style.setProperty("--primary-color", theme.primary);
  root.style.setProperty("--bg-color", theme.background);
  root.style.setProperty("--text-color", theme.text);
  root.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 400,
    fill: "forwards",
  });
}
