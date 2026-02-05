import React from "react";
import { Card } from "./Card";
import useAudioPlayer from "../hooks/useAudioPlayer"; // Import the hook

const CardDisplay = ({ chords, selectedNotes, handleChordToggle, selectionOrder, bankId }) => {
  const { playChord } = useAudioPlayer(); // Initialize audio

  const handleCardClick = (chord) => {
    const uniqueId = `${bankId}-${chord.button}`;
    const isSelected = selectedNotes.some((notes) => notes.uniqueId === uniqueId);

    // Play the audio
    playChord(chord.notes);

    // Toggle selection
    handleChordToggle(chord, uniqueId, isSelected);
  };

  return (
    <div className="w-full mt-4 px-2 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
      {chords.map((chord) => {
        const uniqueId = `${bankId}-${chord.button}`;
        const isSelected = selectedNotes.some((notes) => notes.uniqueId === uniqueId);

        return (
          <Card
            key={uniqueId}
            onClick={() => handleCardClick(chord)} // Passed the updated handler
            selected={isSelected}
            chord={chord}
            selectionOrder={selectionOrder}
            uniqueId={uniqueId}
          />
        );
      })}
    </div>
  );
};

export default CardDisplay;
