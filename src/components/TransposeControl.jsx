import React from "react";

const TransposeControl = ({ onTranspose, displayTransposition, buttonClassName }) => {
  return (
    <div className="flex  items-center justify-center gap-2  text-yellow-600  w-fit">
      <span className="text-sm font-medium tracking-wide">TRANSPOSE</span>
      <div className="flex justify-between gap-2 w-full items-center">
        <button
          className={buttonClassName}
          onClick={() => onTranspose(-1)}
        >
          <div className="absolute h-[3px] rounded-full w-3 bg-yellow-600"></div>
        </button>
        <span className="font-medium">{displayTransposition}</span>
        <button
          className={buttonClassName}
          onClick={() => onTranspose(1)}
        >
          <div className="absolute h-[3px] rounded-full w-3 bg-yellow-600"></div>
          <div className="absolute h-3 rounded-full w-[3px] bg-yellow-600"></div>
        </button>
      </div>
    </div>
  );
};

export default TransposeControl;
