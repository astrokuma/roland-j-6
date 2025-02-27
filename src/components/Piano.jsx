import React from "react";
import { Note } from "@tonaljs/tonal";
import { normalizeNote } from "../utils/notes";

const Piano = ({ notes = [], root, selected }) => {
  const processedRoot = root ? Note.pitchClass(root) : null;
  const rootAccidental = processedRoot ? (processedRoot.includes("#") ? "#" : processedRoot.includes("b") ? "b" : "") : "";

  // Dynamically set blackNotes based on root accidental
  const blackNotes = rootAccidental === "#" ? ["C#", "D#", "F#", "G#", "A#"] : rootAccidental === "b" ? ["Db", "Eb", "Gb", "Ab", "Bb"] : ["C#", "D#", "F#", "G#", "A#"]; // Default to sharps

  const processedNotes = [...new Set(notes.map((n) => normalizeNote(n, root)))];

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

  return (
    <div className="flex relative p-[1.5px] rounded-[3px] p-.5 my-4 scale-[1.4] sm:scale-150 md:scale-[1.8]">
      {whiteNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        return (
          <div
            key={i}
            className={`w-4 h-12 border rounded-sm ${selected ? "border-primary" : "border-primary"} 
            ${i === whiteNotes.length - 1 ? "rounded-tr-sm " : ""}
            ${normalized === processedRoot ? "bg-tertiary" : processedNotes.includes(normalized) ? "bg-accent" : "bg-notes"}`}
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
            ${normalized === processedRoot ? "bg-tertiary" : processedNotes.includes(normalized) ? "bg-accent" : "bg-notes"}`}
            style={{ left: `${position}px` }}
          />
        );
      })}
    </div>
  );
};

export default Piano;
