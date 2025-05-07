// utils/themeUtils.ts
import { brandThemes } from "./brandThemes";

export type ThemeColorSet = typeof brandThemes.apple;

export function applyBrandTheme(theme: ThemeColorSet) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-bg", theme.background);
  root.style.setProperty("--color-text", theme.text);

  root.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 400,
    fill: "forwards",
  });
}
