import React from "react";
import { Cog6ToothIcon, MagnifyingGlassIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import StepperSelect from "./StepperSelect";
import { useTheme } from "./ThemeProvider";
import { BANKS } from "../data/banks";

const BANK_OPTIONS = BANKS.map((b) => ({ value: b.number, label: `${b.number}: ${b.genre}` }));

const IconButton = ({ onClick, label, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="w-10 h-10 shrink-0 rounded-full bg-notes text-accent flex items-center justify-center hover:bg-accent hover:text-primary"
  >
    {children}
  </button>
);

const formatKey = (semitones) => (semitones > 0 ? `+${semitones}` : `${semitones}`);

const TransposeControl = ({ transpose, setTranspose }) => (
  <div
    className={`flex items-center h-10 rounded-full ${transpose ? "bg-tertiary text-primary" : "bg-notes text-accent"}`}
    role="group"
    aria-label="Transpose (J-6 KEY)"
  >
    <button
      onClick={() => setTranspose(Math.max(-12, transpose - 1))}
      aria-label="Transpose down"
      className="w-8 h-10 font-black text-lg"
    >
      −
    </button>
    <button
      onClick={() => setTranspose(0)}
      title="J-6 KEY (transpose). Tap to reset."
      className="text-xs font-black leading-none flex flex-col items-center min-w-9"
    >
      <span className="text-[9px] opacity-75">KEY</span>
      {formatKey(transpose)}
    </button>
    <button
      onClick={() => setTranspose(Math.min(12, transpose + 1))}
      aria-label="Transpose up"
      className="w-8 h-10 font-black text-lg"
    >
      +
    </button>
  </div>
);

const Header = ({ bank, changeBank, stepBank, transpose, setTranspose, onOpenBrowser, onOpenSettings }) => {
  const { colorMode, toggleColorMode } = useTheme();

  return (
    <header className="w-full max-w-7xl mx-auto px-2 pt-2 flex flex-col md:flex-row gap-2">
      <div className="flex items-center gap-2 bg-primary rounded-xl px-3 py-2 md:flex-1">
        <h1 className="text-accent text-lg font-black leading-none mr-auto">
          J-6 <span className="text-tertiary">Chords</span>
        </h1>
        <TransposeControl
          transpose={transpose}
          setTranspose={setTranspose}
        />
        <IconButton
          onClick={toggleColorMode}
          label={colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {colorMode === "light" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </IconButton>
        <IconButton
          onClick={onOpenSettings}
          label="Themes and shortcuts"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </IconButton>
      </div>
      <div className="flex items-center gap-2 bg-primary rounded-xl px-3 py-2 md:flex-1">
        <StepperSelect
          options={BANK_OPTIONS}
          value={bank}
          onChange={(value) => changeBank(Number(value))}
          onStep={stepBank}
          label="chord set"
        />
        <IconButton
          onClick={onOpenBrowser}
          label="Search chord sets"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;
