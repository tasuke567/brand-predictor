// src/components/ThemeToggle.tsx
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { mode, setMode } = useTheme();

  return (
    <button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      style={{
        backgroundColor: "transparent",
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
        marginTop: "2rem",
      }}
    >
      {mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
