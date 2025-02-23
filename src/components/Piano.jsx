import React from "react";
import { Note } from "@tonaljs/tonal";
import { normalizeNote } from "../utils/notes";

const Piano = ({ notes = [], root }) => {
  const processedRoot = root ? Note.pitchClass(root) : null;

  // Normalize notes relative to chord root
  const processedNotes = [...new Set(notes.map((n) => normalizeNote(n, root)))];

  // White and black key definitions remain the same
  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
  const blackNotes = ["C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"];

  // Helper to check black key matches
  const isBlackKey = (note) => blackNotes.includes(note);

  // Helper function for black key positioning
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
    <div className="flex relative p-1 m-4 scale-[1.4] sm:scale-150 md:scale-[1.8]">
      {whiteNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        return (
          <button
            key={i}
            className={`w-4 h-12 border-2 outline outline-2 outline-gray-950 border-gray-950 rounded-sm rounded-t-none first:rounded-tl-sm
              ${i === whiteNotes.length - 1 ? "rounded-tr-sm" : ""} 
              ${normalized === processedRoot ? "bg-green-600" : processedNotes.includes(normalized) ? "bg-yellow-600" : "bg-slate-800"}`}
          />
        );
      })}
      {blackNotes.map((note, i) => {
        const normalized = normalizeNote(note, root);
        const position = getBlackKeyPosition(note); // Implement positioning logic
        return (
          <button
            key={i}
            className={`absolute h-7 w-3.5 border-[3px] border-t-2 border-gray-950 rounded-sm rounded-t-none
              ${normalized === processedRoot ? "bg-green-600" : processedNotes.includes(normalized) ? "bg-yellow-700" : "bg-slate-900"}`}
            style={{ left: `${position}px` }}
          />
        );
      })}
    </div>
  );
};

export default Piano;
