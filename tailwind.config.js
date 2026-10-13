/** @type {import('tailwindcss').Config} */

// Theme colors live in CSS variables (src/themes). color-mix lets opacity modifiers like bg-accent/40 work with them.
const themeColor = (name) => `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: themeColor("background"),
        primary: themeColor("primary"),
        secondary: themeColor("secondary"),
        tertiary: themeColor("tertiary"),
        accent: themeColor("accent"),
        notes: themeColor("notes"),
      },
    },
  },
  plugins: [],
};
