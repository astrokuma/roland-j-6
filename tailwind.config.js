/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg-color)",
        main: "var(--main-color)",
        caret: "var(--caret-color)",
        sub: "var(--sub-color)",
        "sub-alt": "var(--sub-alt-color)",
        text: "var(--text-color)",
        error: "var(--error-color)",
        "error-extra": "var(--error-extra-color)",
        "colorful-error": "var(--colorful-error-color)",
        "colorful-error-extra": "var(--colorful-error-extra-color)",
      },
    },
  },
  plugins: [],
};
