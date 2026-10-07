import React, { createContext, useContext, useEffect, useState } from "react";
import { themes } from "../constants/themes";

const ThemeContext = createContext();
const DEFAULT_THEME = "emerald";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

const readSaved = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const save = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable; the theme just won't persist.
  }
};

const systemMode = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const isKnownTheme = (name) => themes.some((t) => t.value === name);

// index.html applies the saved theme before React loads (no flash); this keeps it in sync afterwards.
const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    const saved = readSaved("themeName");
    return isKnownTheme(saved) ? saved : DEFAULT_THEME;
  });
  // Follow the system setting until the person picks a mode themselves.
  const [savedMode, setSavedMode] = useState(() => readSaved("colorMode"));
  const [systemColorMode, setSystemColorMode] = useState(systemMode);
  const colorMode = savedMode === "light" || savedMode === "dark" ? savedMode : systemColorMode;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemColorMode(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeName);
    document.documentElement.setAttribute("data-color-mode", colorMode);
    const background = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background);
  }, [themeName, colorMode]);

  const switchTheme = (name) => {
    const next = isKnownTheme(name) ? name : DEFAULT_THEME;
    setThemeName(next);
    save("themeName", next);
  };

  const toggleColorMode = () => {
    const next = colorMode === "light" ? "dark" : "light";
    setSavedMode(next);
    save("colorMode", next);
  };

  return <ThemeContext.Provider value={{ themeName, colorMode, switchTheme, toggleColorMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
