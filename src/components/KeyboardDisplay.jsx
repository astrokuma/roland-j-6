import React from "react";
import { getColorByIndex } from "../utils/ColorUtils";

const KeyboardDisplay = ({ selectedButtons, selectionOrder }) => {
  const getSelectedColor = (num) => {
    const index = parseInt(num) - 1;
    return selectedButtons.includes(num) ? getColorByIndex(index) : "bg-neutral-950";
  };

  const getSelectionNumber = (num) => {
    const index = selectionOrder.indexOf(num);
    return index !== -1 ? index + 1 : null;
  };

  const KeyButton = ({ num, isTop }) => (
    <div
      className={`flex items-center justify-center ${isTop ? "h-7" : "h-8"} w-6 outline outline-2 ${isTop ? "outline-sky-200" : "outline-sky-500"} rounded-sm ${getSelectedColor(num)} 
        ${num === "4" && isTop ? "mr-7" : ""}`}
    >
      {selectedButtons.includes(num) && <p className="text-neutral-950 text-sm font-bold">{getSelectionNumber(num)}</p>}
    </div>
  );

  return (
    <div className=" flex flex-col items-center justify-center gap-2 bg-sky-950 h-28 px-6 rounded-lg">
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
