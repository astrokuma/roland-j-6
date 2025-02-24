import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "horizon");
  const [themeStyles, setThemeStyles] = useState({});

  // Load all theme CSS files during initialization
  useEffect(() => {
    const importThemes = async () => {
      const themeModules = import.meta.glob("./themes/*.css", { as: "raw", eager: true });
      const themes = Object.entries(themeModules).reduce((acc, [path, css]) => {
        const themeName = path.match(/\.\/themes\/(.*)\.css/)[1];
        acc[themeName] = css;
        return acc;
      }, {});
      setThemeStyles(themes);
    };
    importThemes();
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (!themeStyles[theme]) return;

    let styleElement = document.getElementById("theme-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "theme-style";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = themeStyles[theme];

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, themeStyles]);

  const switchTheme = (newTheme) => {
    if (themeStyles[newTheme]) {
      setTheme(newTheme);
    }
  };

  return <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
