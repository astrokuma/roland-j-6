import React from "react";
import { cycleIndex } from "../utils/cycleIndex";

const StepperSelect = ({ items = [], valueKey = "value", labelKey = "label", selectedIndex, onChange, renderOption }) => {
  const handleIndexChange = (newIndex) => {
    onChange(items[newIndex], newIndex);
  };

  const handleIncrement = () => {
    handleIndexChange(cycleIndex(selectedIndex, items.length, 1));
  };

  const handleDecrement = () => {
    handleIndexChange(cycleIndex(selectedIndex, items.length, -1));
  };

  if (!items.length) return null;

  return (
    <div className="flex items-center justify-center gap-2 w-fit">
      <StepperButton
        direction="prev"
        onClick={handleDecrement}
      />

      <div className="relative inline-block">
        <select
          value={selectedIndex}
          onChange={(e) => handleIndexChange(parseInt(e.target.value))}
          className="bg-background-50 custom-scrollbar rounded-full pl-6  py-2 shadow-sm focus:outline-primary-200 appearance-none text-text-600 cursor-pointer"
        >
          {items.map((item, index) => (
            <option
              key={item[valueKey]}
              value={index}
            >
              {renderOption ? renderOption(item) : `${item[labelKey]}`}
            </option>
          ))}
        </select>
      </div>

      <StepperButton
        direction="next"
        onClick={handleIncrement}
      />
    </div>
  );
};

const StepperButton = ({ direction, onClick }) => (
  <button
    className="relative flex items-center justify-center rounded-full shadow-sm bg-background-50 focus:outline-primary-200 appearance-none cursor-pointer h-10 w-10"
    onClick={onClick}
  >
    {direction === "prev" ? (
      <div className="h-[3px] w-3 bg-primary-600"></div>
    ) : (
      <>
        <div className="absolute h-[3px] w-3 bg-primary-600"></div>
        <div className="absolute h-3 w-[3px] bg-primary-600"></div>
      </>
    )}
  </button>
);

export default StepperSelect;
