import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ThemeProvider from "./components/ThemeProvider";
import { AudioProvider } from "./audio/AudioProvider";
import "./index.css";

// Every theme is scoped by [data-theme][data-color-mode], so they can all load up front.
import.meta.glob("./themes/*.css", { eager: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ThemeProvider>
  </StrictMode>,
);
