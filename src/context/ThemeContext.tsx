// src/context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { brandThemes } from "../utils/brandThemes";
import { darkBrandThemes } from "../utils/darkBrandThemes";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  prediction: string;
  setMode: (mode: ThemeMode) => void;
  setPrediction: (brand: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [prediction, setPrediction] = useState<string>("default");

  useEffect(() => {
    const themeMap = mode === "dark" ? darkBrandThemes : brandThemes;
    const theme = themeMap[prediction.toLowerCase()] || themeMap.default;

    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-bg", theme.background);
    root.style.setProperty("--color-text", theme.text);
  }, [mode, prediction]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, prediction, setPrediction }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};