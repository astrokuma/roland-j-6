import React from "react";
import { Note } from "@tonaljs/tonal";
import { normalizeNote } from "../utils/notes";

const Piano = ({ notes = [], root }) => {
  const processedRoot = root ? Note.pitchClass(root) : null;
  const rootAccidental = processedRoot ? (processedRoot.includes("#") ? "#" : processedRoot.includes("b") ? "b" : "") : "";

  // Dynamically set blackNotes based on root accidental
  const blackNotes = rootAccidental === "#" ? ["C#", "D#", "F#", "G#", "A#"] : rootAccidental === "b" ? ["Db", "Eb", "Gb", "Ab", "Bb"] : ["C#", "D#", "F#", "G#", "A#"]; // Default to sharps

  const processedNotes = [...new Set(notes.map((n) => normalizeNote(n, root)))];

  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];

  const getBlackKeyPosition = (note) => {
    const positions = {
      "C#": 13,
      Db: 13,
      "D#": 29,
      Eb: 29,
      "F#": 61,
      Gb: 61,
      "G#": 77,
      Ab: 77,
      "A#": 93,
      Bb: 93,
    };
    return positions[note] || 0;
  };

  return (
    <div className="flex relative p-1 my-4 scale-[1.4] sm:scale-150 md:scale-[1.8]">
      {whiteNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        return (
          <div
            key={i}
            className={`w-4 h-12 border-1 outline outline-2 outline-main border-main rounded-sm rounded-t-none first:rounded-tl-sm
              ${i === whiteNotes.length - 1 ? "rounded-tr-sm" : ""} 
              ${normalized === processedRoot ? "bg-text" : processedNotes.includes(normalized) ? "bg-text" : "bg-sub-alt"}`}
          />
        );
      })}
      {blackNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        const position = getBlackKeyPosition(note);
        return (
          <div
            key={i}
            className={`absolute h-7 w-3.5 border-[2px] border-t-0 border-main rounded-sm rounded-t-none
              ${normalized === processedRoot ? "bg-text" : processedNotes.includes(normalized) ? "bg-text" : "bg-sub-alt"}`}
            style={{ left: `${position}px` }}
          />
        );
      })}
    </div>
  );
};

export default Piano;
