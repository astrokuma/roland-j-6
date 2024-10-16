import React from "react";

const Piano = ({ notes = [] }) => {
  const processNotes = (inputNotes) => {
    // Remove octave information, convert flats to sharps, and remove duplicates
    const noteMap = {
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
    };
    return [
      ...new Set(
        inputNotes.map((note) => {
          const noteName = note.replace(/\d+/, "");
          return noteMap[noteName] || noteName;
        })
      ),
    ];
  };

  const processedNotes = processNotes(notes);

  const isNoteActive = (note) => processedNotes.includes(note);

  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
  const blackNotes = ["C#", "D#", "F#", "G#", "A#"];

  return (
    <div
      id="keys"
      className="flex relative p-1 m-4 scale-[1.4] sm:scale-150 md:scale-[1.8]"
    >
      {whiteNotes.map((note, i) => (
        <button
          key={i}
          className={`z-1 w-4 h-12 border-2 outline outline-2 outline-gray-950 border-gray-950 rounded-sm rounded-t-none first:rounded-tl-sm
          ${i === whiteNotes.length - 1 ? "rounded-tr-sm" : ""} 
          ${isNoteActive(note) ? "bg-yellow-600" : "bg-slate-800"}`}
        />
      ))}
      {blackNotes.map((note, i) => {
        const position = [0, 1, 3, 4, 5][i];
        return (
          <button
            key={i}
            className={`absolute h-7 w-3.5 border-[3px] border-t-2 border-gray-950 rounded-sm rounded-t-none ${isNoteActive(note) ? "bg-yellow-700" : "bg-slate-900"}`}
            style={{ left: `${position * 16 + 13}px` }}
          />
        );
      })}
    </div>
  );
};

export default Piano;
