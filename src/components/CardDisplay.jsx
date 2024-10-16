import { Card } from "./Card";

const CardDisplay = ({ chords, selectedNotes, handleChordToggle, selectionOrder }) => {
  const handleCardClick = (transposedNotes, button) => {
    const isSelected = selectedNotes.some((notes) => notes.join(",") === transposedNotes.join(","));
    handleChordToggle(transposedNotes, button, isSelected);
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
      {chords.map((chord, index) => {
        const isSelected = selectedNotes.some((notes) => notes.join(",") === chord.transposedNotes.join(","));

        return (
          <Card
            key={index}
            onClick={() => handleCardClick(chord.transposedNotes, chord.button)}
            selected={isSelected}
            chord={chord}
            selectionOrder={selectionOrder} // Pass selectionOrder as a prop
            num={chord.button}
          />
        );
      })}
    </div>
  );
};

export default CardDisplay;
