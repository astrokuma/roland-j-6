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

  // Check if a note matches any note in matchedNotes, considering enharmonic equivalents
  const isNoteMatched = (note) => {
    if (!matchedNotes) return false;

    const simplifiedNote = Note.simplify(note);
    const simplifiedMatched = matchedNotes.map((n) => Note.simplify(normalize(n, root)));

    return simplifiedMatched.includes(simplifiedNote) || simplifiedMatched.includes(Note.enharmonic(simplifiedNote)) || simplifiedMatched.some((n) => Note.enharmonic(n) === simplifiedNote);
  };

  return (
    <div className="flex flex-wrap justify-center gap-1.5 ">
      {uniqueAllNotes.map((note, index) => {
        const displayNote = normalize(note, root);
        const isRoot = normalizedRoot && (displayNote === normalizedRoot || Note.enharmonic(displayNote) === normalizedRoot);

        const isMatched = isNoteMatched(displayNote);
        const isMissing = safeMissingNotes.includes(note);

        let bgColor;

        if (isMissing) {
          bgColor = "bg-none text-secondary";
        } else {
          if (isScaleDisplay) {
            bgColor = "outline outline-2 text-secondary";
            if (isMatched) bgColor = "bg-accent text-primary";
            if (isRoot) bgColor = "bg-tertiary text-primary";
          } else {
            bgColor = "bg-accent text-primary";
            if (isRoot) {
              bgColor = "bg-tertiary text-primary";
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
