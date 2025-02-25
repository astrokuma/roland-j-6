import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(localStorage.getItem("themeName") || "1");
  const [colorMode, setColorMode] = useState(() => {
    const savedMode = localStorage.getItem("colorMode");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!savedMode) {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemDark ? "dark" : "light";
    }
    return savedMode || (systemDark ? "dark" : "light");
  });
  const [themeStyles, setThemeStyles] = useState({});

  // Load all theme CSS files
  useEffect(() => {
    const importThemes = async () => {
      try {
        const themeModules = import.meta.glob("../themes/*.css", {
          as: "raw",
          eager: true,
        });

        // Debug: Log found theme files
        console.log("Theme files found:", Object.keys(themeModules));

        const themes = Object.entries(themeModules).reduce((acc, [path, css]) => {
          const themeName = path.match(/\/themes\/(.*)\.css/)[1];
          acc[themeName] = css;
          return acc;
        }, {});

        setThemeStyles(themes);
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    };
    importThemes();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e) => {
      if (!localStorage.getItem("colorMode")) {
        setColorMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // Apply theme and mode
  useEffect(() => {
    if (!themeStyles[themeName]) return;

    let styleElement = document.getElementById("theme-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "theme-style";
      document.head.appendChild(styleElement);
    }

    document.documentElement.removeAttribute("style");

    styleElement.textContent = themeStyles[themeName];

    document.documentElement.setAttribute("data-theme", themeName);
    document.documentElement.setAttribute("data-color-mode", colorMode);

    document.documentElement.offsetHeight;

    localStorage.setItem("themeName", themeName);
    localStorage.setItem("colorMode", colorMode);
  }, [themeName, colorMode, themeStyles]);

  const switchTheme = (newTheme) => {
    if (themeStyles[newTheme]) {
      setThemeName(newTheme);
    } else {
      console.warn(`Theme ${newTheme} not found, resetting to default`);
      setThemeName("1");
    }
  };

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ themeName, colorMode, switchTheme, toggleColorMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
