import React from "react";
import { Note } from "@tonaljs/tonal";
import { normalizeNote, isRootPresent } from "../utils/notes";

const Piano = ({ notes = [], root, selected }) => {
  // Process the actual notes from the chord
  const processedNotes = [...new Set(notes.map((n) => Note.simplify(Note.pitchClass(normalizeNote(n, root)))))];

  const normalizedRoot = root ? Note.simplify(Note.pitchClass(normalizeNote(root, root))) : null;

  const rootIsPresent = isRootPresent(root, notes);

  // Get the preferred accidental style from the first note
  const firstNote = notes[0] || "";
  const preferredAccidental = firstNote.includes("b") ? "b" : firstNote.includes("#") ? "#" : root && root.includes("b") ? "b" : root && root.includes("#") ? "#" : "#";

  // Select black notes display format based on preferred accidental
  const blackNotes = preferredAccidental === "b" ? ["Db", "Eb", "Gb", "Ab", "Bb"] : ["C#", "D#", "F#", "G#", "A#"];

  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];

  const getBlackKeyPosition = (note) => {
    const positions = {
      "C#": 10.5,
      Db: 10.5,
      "D#": 27,
      Eb: 27,
      "F#": 58.5,
      Gb: 58.5,
      "G#": 74.5,
      Ab: 74.5,
      "A#": 90.5,
      Bb: 90.5,
    };
    return positions[note] || 0;
  };

  // Check if a note matches the root AND the root is present in the chord
  const isRoot = (note) => {
    if (!normalizedRoot || !rootIsPresent) return false;

    const simplifiedNote = Note.simplify(note);
    return simplifiedNote === normalizedRoot || Note.enharmonic(simplifiedNote) === normalizedRoot || Note.enharmonic(normalizedRoot) === simplifiedNote;
  };

  // Check if a note is included in our processed notes array
  const isNoteIncluded = (note) => {
    // Get all enharmonic equivalents
    const basicNote = Note.simplify(note);
    const enharmonic = Note.enharmonic(basicNote);

    return processedNotes.includes(basicNote) || processedNotes.includes(enharmonic) || processedNotes.some((n) => Note.enharmonic(n) === basicNote);
  };

  return (
    <div className="flex relative p-[1.5px] rounded-[3px] my-4 scale-[1.4] sm:scale-150 md:scale-[1.8]">
      {whiteNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        return (
          <div
            key={i}
            className={`w-4 h-12 border rounded-sm ${selected ? "border-primary" : "border-primary"} 
            ${i === whiteNotes.length - 1 ? "rounded-tr-sm " : ""}
            ${isRoot(normalized) ? "bg-tertiary" : isNoteIncluded(normalized) ? "bg-accent" : "bg-notes"}`}
          />
        );
      })}
      {blackNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        const position = getBlackKeyPosition(note);
        return (
          <div
            key={i}
            className={`absolute h-7 w-3.5 border-[1.5px] border-t-[1px] rounded-sm rounded-t-none ${selected ? "border-primary" : "border-primary"} 
            ${isRoot(normalized) ? "bg-tertiary" : isNoteIncluded(normalized) ? "bg-accent" : "bg-notes"}`}
            style={{ left: `${position}px` }}
          />
        );
      })}
    </div>
  );
};

export default Piano;
