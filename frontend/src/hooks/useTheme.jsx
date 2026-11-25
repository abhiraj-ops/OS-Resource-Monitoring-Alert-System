/**
 * Theme system — Midnight, Aurora, Frost, Graphite
 * Persisted in localStorage, respects system preference
 */

import { createContext, useContext, useCallback, useEffect, useState } from "react";

const THEMES = ["midnight", "aurora", "frost", "graphite"];
const STORAGE_KEY = "os_theme";

const THEME_INFO = {
  midnight: { label: "Midnight", hint: "Deep navy with cyan glows" },
  aurora: { label: "Aurora", hint: "Teal and violet gradients" },
  frost: { label: "Frost", hint: "Light glass, soft blue and white" },
  graphite: { label: "Graphite", hint: "Near-black, high contrast" },
};

const ThemeContext = createContext(null);

function detectTheme() {
  if (typeof window === "undefined") return "midnight";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && THEMES.includes(stored)) return stored;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "frost";
  }
  return "midnight";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(detectTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  const setThemeValue = useCallback((next) => {
    setTheme(next);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeValue,
        cycleTheme,
        themes: THEMES,
        themeInfo: THEME_INFO,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export default ThemeProvider;
