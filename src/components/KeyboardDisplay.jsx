import React from "react";
import { getSelectionNumber } from "../utils/selectionUtils";

const KeyboardDisplay = ({ selectedButtons, selectionOrder, bankId }) => {
  const KeyButton = ({ num, isTop }) => {
    const compositeId = `${bankId}-${num}`;
    const isSelected = selectedButtons.includes(compositeId);
    const selectionNumber = getSelectionNumber(compositeId, selectionOrder);

    return (
      <div
        className={`flex items-center justify-center ${isTop ? "h-7" : "h-8"} w-6 rounded-sm 
        ${isSelected ? (isTop ? "bg-primary-500" : "bg-secondary-500") : "bg-secondary-50"}`}
      >
        {selectionNumber && <p className="text-secondary-50 text-sm font-bold">{selectionNumber}</p>}
      </div>
    );
  };

  return (
    <div className="col-span-8 flex flex-col items-center justify-center gap-2 bg-secondary-200 h-28 px-6 rounded-lg">
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
