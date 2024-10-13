import React from "react";

const TransposeControl = ({ onTranspose, displayTransposition, buttonClassName }) => {
  return (
    <div className="flex  items-center justify-center gap-2  text-white  w-fit">
      <span className="text-sm font-medium tracking-wide">TRANSPOSE</span>
      <div className="flex justify-between gap-2 w-full items-center">
        <button
          className={buttonClassName}
          onClick={() => onTranspose(-1)}
        >
          -
        </button>
        <span className="font-medium">{displayTransposition}</span>
        <button
          className={buttonClassName}
          onClick={() => onTranspose(1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TransposeControl;
