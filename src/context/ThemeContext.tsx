// src/context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";


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
    // Set body class like: "light apple" or "dark samsung"
    const brandClass = prediction.toLowerCase();
    document.body.className = `${mode} ${brandClass}`;
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