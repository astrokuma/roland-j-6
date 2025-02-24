// components/ThemeSwitcher.jsx
import React, { useState } from "react";
import { cycleIndex } from "../utils/cycleIndex";

const ThemeSwitcher = ({ themes = [], onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!themes.length) return null;

  const handleSelectChange = (index) => {
    setSelectedIndex(index);
    onChange(themes[index].value);
  };

  const handleIncrement = () => {
    const newIndex = cycleIndex(selectedIndex, themes.length, 1);
    handleSelectChange(newIndex);
  };

  const handleDecrement = () => {
    const newIndex = cycleIndex(selectedIndex, themes.length, -1);
    handleSelectChange(newIndex);
  };

  return (
    <div className="flex items-center justify-center gap-2 text-main w-fit">
      <button
        className="relative flex items-center justify-center rounded-lg px-4 py-1 shadow-sm focus:outline-caret appearance-none bg-caret cursor-pointer h-10 w-10"
        onClick={handleDecrement}
      >
        <div className="h-[3px] rounded-full w-3 bg-bg"></div>
      </button>
      <div className="relative inline-block w-full">
        <select
          value={selectedIndex}
          onChange={(e) => handleSelectChange(parseInt(e.target.value))}
          className="bg-bg outline outline-2 outline-main custom-scrollbar rounded-lg pl-3 py-2 shadow-sm focus:outline-text appearance-none text-text cursor-pointer"
        >
          {themes.map((theme, index) => (
            <option
              key={theme.value}
              value={index}
            >
              {theme.label}
            </option>
          ))}
        </select>
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-b-0 border-t-8 border-transparent border-t-text"></div>
      </div>
      <button
        className="relative flex items-center justify-center rounded-lg px-4 py-1 shadow-sm focus:outline-caret appearance-none bg-caret cursor-pointer h-10 w-10"
        onClick={handleIncrement}
      >
        <div className="absolute h-[3px] rounded-full w-3 bg-bg"></div>
        <div className="absolute h-3 rounded-full w-[3px] bg-bg"></div>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
