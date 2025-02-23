import React, { useState } from "react";

const ChordBankSelector = ({ chords = [], onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!chords || chords.length === 0) {
    console.warn("No chords provided to ChordBankSelector");
    return null;
  }

  const handleSelectChange = (index) => {
    setSelectedIndex(index);
    onChange(chords[index].number);
  };

  const handleIncrement = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % chords.length);
    onChange(chords[(selectedIndex + 1) % chords.length].number);
  };

  const handleDecrement = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + chords.length) % chords.length);
    onChange(chords[(selectedIndex - 1 + chords.length) % chords.length].number);
  };

  return (
    <div className="flex items-center justify-center gap-2 text-yellow-600  w-fit">
      <button
        className="relative flex items-center justify-center rounded-lg px-4 py-1 shadow-sm focus:outline-none appearance-none bg-yellow-600 hover:bg-yellow-700 cursor-pointer h-10 w-10"
        onClick={handleDecrement}
      >
        <div className="h-[3px] rounded-full w-3 bg-gray-950"></div>
      </button>
      <select
        value={selectedIndex}
        onChange={(e) => handleSelectChange(parseInt(e.target.value))}
        className="bg-gray-950 custom-scrollbar rounded-lg px-3 py-2 shadow-sm focus:outline-none appearance-none text-yellow-600 hover:text-yellow-500 cursor-pointer pl-4 pr-8"
        style={{
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ca8a04' viewBox='0 0 16 16'><path d='M1.5 4.5l7 7 7-7z'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "calc(100% - 1rem) center",
          backgroundSize: "1rem",
        }}
      >
        {chords.map((chart, index) => (
          <option
            key={chart.number}
            value={index}
          >
            {chart.number}: {chart.genre}
          </option>
        ))}
      </select>
      <button
        className="relative flex items-center justify-center rounded-lg px-4 py-1 shadow-sm focus:outline-none appearance-none bg-yellow-600 hover:bg-yellow-700 cursor-pointer h-10 w-10"
        onClick={handleIncrement}
      >
        <div className="absolute h-[3px] rounded-full w-3 bg-gray-950"></div>
        <div className="absolute h-3 rounded-full w-[3px] bg-gray-950"></div>
      </button>
    </div>
  );
};

export default ChordBankSelector;
