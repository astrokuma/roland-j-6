import React from "react";
import { getSelectionNumber } from "../utils/selectionUtils";

const KeyboardDisplay = ({ selectedButtons, selectionOrder }) => {
  const KeyButton = ({ num, isTop }) => {
    const isSelected = selectedButtons.includes(num);
    const selectionNumber = getSelectionNumber(num, selectionOrder);

    return (
      <div
        className={`flex items-center justify-center ${isTop ? "h-7" : "h-8"} w-6 outline outline-2 
        ${isTop ? "outline-yellow-700" : "outline-yellow-600"} rounded-sm 
        ${isSelected ? (isTop ? "bg-yellow-700" : "bg-yellow-600") : "bg-neutral-950"}`}
      >
        {isSelected && <p className="text-neutral-950 text-sm font-bold">{selectionNumber}</p>}
      </div>
    );
  };

  return (
    <div className="col-span-9 sm:col-start-2 sm:col-span-7 xl:col-span-3 flex flex-col items-center justify-center gap-2 bg-sky-950 h-28 px-6 rounded-lg">
      <div className="grid grid-flow-col mx-4 gap-2.5">
        {["2", "4", "7", "9", "11"].map((num) => (
          <KeyButton
            key={num}
            num={num}
            isTop={true}
          />
        ))}
      </div>
      <div className="grid grid-flow-col gap-2">
        {["1", "3", "5", "6", "8", "10", "12"].map((num) => (
          <KeyButton
            key={num}
            num={num}
            isTop={false}
          />
        ))}
      </div>
    </div>
  );
};

export default KeyboardDisplay;
