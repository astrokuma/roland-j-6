import React from "react";
import { Note } from "@tonaljs/tonal";
import KeyboardSvg from "./KeyboardSvg";
import { pcName } from "../utils/chordTheory";

const ScaleCard = ({ scale, chordChromas, isFocused, onFocus }) => {
  const outsideNames = scale.outside.map((c) => pcName(c, scale.notes.some((n) => n.includes("b"))));

  const keyState = (midi) => {
    const chroma = midi % 12;
    if (!scale.chromas.has(chroma)) return null;
    return chroma === scale.tonicChroma ? "root" : chordChromas.has(chroma) ? "tone" : "scale";
  };

  return (
    <li className={`bg-primary rounded-xl overflow-hidden outline outline-[3px] -outline-offset-[3px] ${isFocused ? "outline-tertiary" : "outline-transparent"}`}>
      <div className="flex bg-notes border-b-4 border-background px-4 py-3 justify-between items-start gap-2">
        <div>
          <h3 className="text-tertiary font-black capitalize">{scale.name}</h3>
          {scale.alternates.length > 0 && <p className="text-[11px] font-bold text-accent/80">Same notes as {scale.alternates.slice(0, 3).join(", ")}</p>}
        </div>
        <span className="text-tertiary font-black whitespace-nowrap">{Math.round(scale.match * 100)}%</span>
      </div>

      <div className="flex flex-col items-center gap-3 p-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {scale.notes.map((note) => {
            const chroma = Note.chroma(note);
            const inChords = chordChromas.has(chroma);
            return (
              <span
                key={note}
                className={`flex justify-center items-center font-black rounded-full w-8 h-8 text-xs
                  ${chroma === scale.tonicChroma ? "bg-tertiary text-primary" : inChords ? "bg-accent text-primary" : "outline outline-2 -outline-offset-2 outline-accent text-accent"}`}
              >
                {note}
              </span>
            );
          })}
        </div>
        <KeyboardSvg
          startOctave={4}
          octaves={1}
          keyState={keyState}
          className="max-w-[10rem]"
        />
        {outsideNames.length > 0 && <p className="text-xs font-bold text-accent">Outside the scale: {outsideNames.join(", ")}</p>}
        <button
          onClick={onFocus}
          aria-pressed={isFocused}
          className={`text-xs font-black rounded-full px-3 py-1.5 ${isFocused ? "bg-tertiary text-primary" : "bg-notes text-accent hover:bg-accent hover:text-primary"}`}
        >
          {isFocused ? "Showing chords that fit" : "Show chords that fit"}
        </button>
      </div>
    </li>
  );
};

export default ScaleCard;
