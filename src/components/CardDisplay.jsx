import React, { useEffect, useState } from "react";
import { Card } from "./Card";

const CardDisplay = ({ chords, selectedNotes, handleChordToggle, selectionOrder }) => {
  const [localSelectionOrder, setLocalSelectionOrder] = useState(selectionOrder);

  useEffect(() => {
    setLocalSelectionOrder(selectionOrder);
  }, [selectionOrder]);

  const handleCardClick = (chord, button) => {
    const isSelected = selectedNotes.some((notes) => notes.notes.join(",") === chord.notes.join(","));

    handleChordToggle(chord, button, isSelected);

    if (!isSelected) {
      setLocalSelectionOrder((prevOrder) => [...prevOrder, button]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
      {chords.map((chord, index) => {
        const isSelected = selectedNotes.some((notes) => notes.notes.join(",") === chord.notes.join(","));
        return (
          <Card
            key={`${chord.notes.join(",")}-${index}`}
            onClick={() => handleCardClick(chord, chord.button)}
            selected={isSelected}
            chord={chord}
            selectionOrder={selectionOrder}
            num={chord.button}
          />
        );
      })}
    </div>
  );
};

export default CardDisplay;
