import React from "react";
import { Note } from "@tonaljs/tonal";
import { normalizeNote } from "../utils/notes";

const NoteTags = ({ notes = [], root, matchedNotes, isScaleDisplay, missingNotes = [] }) => {
  const normalize = (note, rootNote) => {
    return normalizeNote(note, rootNote);
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
        const isMatched = matchedNotes?.includes(note);
        const isMissing = safeMissingNotes.includes(note);

        let bgColor;

        if (isMissing) {
          bgColor = "bg-none text-secondary-500 outline-background-500";
        } else {
          if (isScaleDisplay) {
            bgColor = "outline outline-2 text-accent-500";
            if (isMatched) bgColor = "bg-accent-500 text-background-500";
            if (isRoot) bgColor = "bg-primary-500 text-background-500";
          } else {
            bgColor = "bg-accent-500 text-background-500";
            if (isRoot) {
              bgColor = "bg-primary-500 text-background-500";
            }
          }
        }

        return (
          <span
            key={index}
            className={`flex justify-center items-center font-bold rounded-full w-8 h-8 text-sm ${bgColor}`}
          >
            {displayNote}
          </span>
        );
      })}
    </div>
  );
};

export default NoteTags;
