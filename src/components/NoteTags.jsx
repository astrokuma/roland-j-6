import React from "react";
import { Note } from "@tonaljs/tonal";

const NoteTags = ({ notes = [], root, matchedNotes, isScaleDisplay, missingNotes = [] }) => {
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

  const safeNotes = Array.isArray(notes) ? notes.filter(Boolean) : [];
  const safeMissingNotes = Array.isArray(missingNotes) ? missingNotes.filter(Boolean) : [];
  const allNotes = [...safeNotes, ...safeMissingNotes];
  const uniqueAllNotes = [...new Set(allNotes)];

  const normalizedRoot = root ? normalize(root, root) : null;

  return (
    <div className="flex flex-wrap justify-center gap-1.5 ">
      {uniqueAllNotes.map((note, index) => {
        const displayNote = normalize(note, root);
        const isRoot = displayNote === normalizedRoot;
        const isAccidental = displayNote.includes("#") || displayNote.includes("b");
        const isMatched = matchedNotes?.includes(note);
        const isMissing = safeMissingNotes.includes(note);

        let bgColor;

        if (isMissing) {
          bgColor = "opacity-50 bg-none border-2 border-main text-main";
        } else {
          if (isScaleDisplay) {
            bgColor = "bg-none border-2 border-text text-text";
            if (isRoot) bgColor = "bg-text";
            if (isMatched) bgColor = "bg-main text-bg";
          } else {
            // Chord display logic with default background
            bgColor = "bg-text text-bg"; // Restore default chord color
            if (isRoot) {
              bgColor = "bg-main text-bg";
            }
            if (isAccidental && !isRoot) {
              bgColor = "bg-text text-bg";
            }
          }
        }

        return (
          <span
            key={index}
            className={`flex justify-center outline outline-2 outline-sub-alt items-center font-bold rounded-full w-8 h-8 text-sm ${bgColor}`}
          >
            {displayNote}
          </span>
        );
      })}
    </div>
  );
};

export default NoteTags;
