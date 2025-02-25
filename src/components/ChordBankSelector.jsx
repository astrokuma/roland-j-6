import React, { useState } from "react";
import StepperSelect from "./StepperSelect";

const ChordBankSelector = ({ chords = [], onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!chords?.length) {
    console.warn("No chords provided to ChordBankSelector");
    return null;
  }

  const handleChange = (selectedChord, index) => {
    setSelectedIndex(index);
    onChange(selectedChord.number);
  };

  return (
    <StepperSelect
      items={chords}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      valueKey="number"
      renderOption={(chord) => `${chord.number}: ${chord.genre}`}
    />
  );
};

export default ChordBankSelector;
