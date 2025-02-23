import React from "react";
import { Note } from "@tonaljs/tonal";

const NoteTags = ({ notes = [], root, matchedNotes, isScaleDisplay }) => {
  const normalize = (note, rootNote) => {
    if (!note) return "";
    const cleaned = note.replace(/[0-9]/g, "");

    if (rootNote) {
      const rootAccidental = rootNote.includes("b") ? "b" : rootNote.includes("#") ? "#" : "";
      const equivalent = Note.enharmonic(cleaned);

      if (rootAccidental === "b" && cleaned.includes("#")) {
        return equivalent;
      }
      if (rootAccidental === "#" && cleaned.includes("b")) {
        return equivalent;
      }
    }

    return Note.simplify(cleaned) || cleaned;
  };

  // RESTORE MISSING LINES
  const safeNotes = Array.isArray(notes) ? notes.filter(Boolean) : [];
  const uniqueNotes = [...new Set(safeNotes)];
  // END OF RESTORED CODE

  const normalizedRoot = root ? normalize(root, root) : null;

  return (
    <div className="flex flex-wrap justify-center gap-1.5 ">
      {uniqueNotes.map((note, index) => {
        const displayNote = normalize(note, root);
        const isRoot = displayNote === normalizedRoot;
        const isAccidental = displayNote.includes("#") || displayNote.includes("b");
        const isMatched = matchedNotes?.includes(displayNote);

        // Different logic for scale vs chord displays
        let bgColor = "bg-yellow-600"; // Default for chords
        if (isScaleDisplay) {
          bgColor = "bg-none border-2 border-yellow-700 text-yellow-700"; // Default for scales
          if (isRoot) bgColor = "bg-green-600";
          if (isMatched) bgColor = "bg-yellow-600";
        } else {
          if (isRoot) {
            if (isAccidental) {
              bgColor = "bg-green-600"; // Accidental is the root
            } else {
              bgColor = "bg-green-600"; // Regular root
            }
          }
          if (isAccidental && !isRoot) bgColor = "bg-yellow-700"; // Accidental but not root
        }

        return (
          <span
            key={index}
            className={`flex justify-center items-center text-gray-950 font-bold rounded-full w-8 h-8 text-sm transition-all ${bgColor}`}
          >
            {displayNote}
          </span>
        );
      })}
    </div>
  );
};

export default NoteTags;
