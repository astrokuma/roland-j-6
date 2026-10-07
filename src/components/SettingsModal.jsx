import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import { useTheme } from "./ThemeProvider";
import { themes } from "../constants/themes";
import { SHORTCUTS } from "../hooks/useKeyboardShortcuts";

// Each swatch carries its own data-theme attributes, so it renders in that theme's colors.
const ThemeSwatch = ({ theme, colorMode, selected, onSelect }) => (
  <button
    data-theme={theme.value}
    data-color-mode={colorMode}
    onClick={() => onSelect(theme.value)}
    aria-pressed={selected}
    className={`relative rounded-xl bg-background p-2 flex flex-col gap-1.5 text-left outline outline-2 ${selected ? "outline-tertiary" : "outline-transparent"}`}
  >
    <div className="flex gap-1">
      <span className="h-6 flex-1 rounded-md bg-primary" />
      <span className="h-6 w-6 rounded-full bg-accent" />
      <span className="h-6 w-6 rounded-full bg-tertiary" />
    </div>
    <span className="text-xs font-black text-accent bg-primary rounded-md px-2 py-1">{theme.label}</span>
    {selected && <CheckIcon className="absolute top-1 right-1 w-4 h-4 text-tertiary" />}
  </button>
);

const SettingsModal = ({ isOpen, onClose }) => {
  const { themeName, colorMode, switchTheme, toggleColorMode } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
    >
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Theme</h3>
            <button
              onClick={toggleColorMode}
              className="text-xs font-black rounded-full bg-notes text-accent px-3 py-1.5"
            >
              {colorMode === "light" ? "Light" : "Dark"} mode
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {themes.map((theme) => (
              <ThemeSwatch
                key={theme.value}
                theme={theme}
                colorMode={colorMode}
                selected={theme.value === themeName}
                onSelect={switchTheme}
              />
            ))}
          </div>
        </section>

        <section className="hidden sm:block">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Keyboard shortcuts</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {SHORTCUTS.map((s) => (
              <React.Fragment key={s.keys}>
                <dt className="font-black text-tertiary whitespace-nowrap">{s.keys}</dt>
                <dd className="text-accent">{s.action}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>

        <section className="text-sm text-accent space-y-2">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Tips</h3>
          <p>Swipe left or right on the chord cards to change chord set.</p>
          <p>No sound on iPhone or iPad? Turn off silent mode. iOS mutes web audio when the ring switch is off.</p>
          <p>Chord names and voicings follow Roland&apos;s J-6 Chord Set List. Where a name and its notes disagree, the card says so.</p>
        </section>
      </div>
    </Modal>
  );
};

export default SettingsModal;
