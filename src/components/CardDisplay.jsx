import { Card } from "./Card";
import { getColorByIndex } from "../utils/ColorUtils"; // Import the color function

const CardDisplay = ({ chords, selectedNotes, handleChordToggle }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {chords.map((chord, index) => {
        const isSelected = selectedNotes.some((notes) => notes.join(",") === chord.transposedNotes.join(","));

        return (
          <Card
            key={index}
            onClick={() => handleChordToggle(chord.transposedNotes, chord.button)}
            selected={isSelected}
            bgColor={isSelected ? getColorByIndex(index) : "bg-gray-950"}
            chord={chord}
          />
        );
      })}
    </div>
  );
};

export default CardDisplay;
