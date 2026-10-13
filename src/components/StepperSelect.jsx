import React from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

const StepperButton = ({ onClick, label, children }) => (
  <button
    className="flex shrink-0 items-center justify-center rounded-full bg-accent text-primary h-10 w-10 hover:brightness-110"
    onClick={onClick}
    aria-label={label}
  >
    {children}
  </button>
);

/** −/+ stepper around a native select, like turning the J-6 VALUE knob. */
const StepperSelect = ({ options, value, onChange, onStep, label }) => (
  <div className="flex items-center gap-2 min-w-0 flex-1">
    <StepperButton
      onClick={() => onStep(-1)}
      label={`Previous ${label}`}
    >
      <MinusIcon className="w-5 h-5" />
    </StepperButton>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="custom-scrollbar flex-1 min-w-0 h-10 rounded-full bg-accent text-primary font-black text-center appearance-none cursor-pointer px-3 truncate"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
    <StepperButton
      onClick={() => onStep(1)}
      label={`Next ${label}`}
    >
      <PlusIcon className="w-5 h-5" />
    </StepperButton>
  </div>
);

export default StepperSelect;
