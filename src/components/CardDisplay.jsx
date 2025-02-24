import React from "react";
import { Card } from "./Card";

const CardDisplay = ({ chords, selectedNotes, handleChordToggle, selectionOrder, bankId }) => {
  const handleCardClick = (chord) => {
    const uniqueId = `${bankId}-${chord.button}`;
    const isSelected = selectedNotes.some((notes) => notes.uniqueId === uniqueId);

    handleChordToggle(chord, uniqueId, isSelected);
  };

  return (
    <div className="w-full mt-4 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
      {chords.map((chord) => {
        const uniqueId = `${bankId}-${chord.button}`;
        const isSelected = selectedNotes.some((notes) => notes.uniqueId === uniqueId);

        return (
          <Card
            key={uniqueId}
            onClick={() => handleCardClick(chord)}
            selected={isSelected}
            chord={chord}
            selectionOrder={selectionOrder}
            num={chord.button}
            uniqueId={uniqueId}
          />
        );
      })}
    </div>
  );
};

export default CardDisplay;
