import React, { useId } from "react";

export const Slider = ({ label, value, onChange, min, max, step, format = (v) => v }) => {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="flex justify-between text-xs font-bold text-secondary mb-1 uppercase"
      >
        {label}
        <span className="text-accent normal-case">{format(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-tertiary"
      />
    </div>
  );
};

export const Segmented = ({ options, value, onChange, label }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="flex gap-1 flex-wrap"
  >
    {options.map((option) => (
      <button
        key={option.id}
        role="radio"
        aria-checked={value === option.id}
        aria-label={option.name}
        onClick={() => onChange(option.id)}
        className={`flex-1 min-w-12 py-2 px-2 rounded-md text-xs font-black ${value === option.id ? "bg-tertiary text-primary" : "bg-primary text-accent hover:bg-notes"}`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const Panel = ({ title, children }) => (
  <div className="bg-background p-4 rounded-xl space-y-4">
    {title && <h3 className="text-xs font-bold text-tertiary uppercase tracking-widest">{title}</h3>}
    {children}
  </div>
);
