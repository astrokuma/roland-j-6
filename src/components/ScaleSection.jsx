import React, { useMemo } from "react";
import { Note } from "@tonaljs/tonal";
import ScaleCard from "./ScaleCard";
import { findMatchingScales } from "../utils/scales";
import { pcName, usesFlats } from "../utils/chordTheory";

const ScaleSection = ({ chords, focusScale, onFocusScale }) => {
  const allNotes = useMemo(() => chords.flatMap((chord) => chord.notes), [chords]);
  const chordChromas = useMemo(() => new Set(allNotes.map((n) => Note.chroma(n))), [allNotes]);
  const firstRoot = chords[0] ? Note.chroma(chords[0].root) : undefined;
  const scales = useMemo(() => findMatchingScales(allNotes, { preferredTonic: firstRoot }), [allNotes, firstRoot]);
  const preferFlats = chords.some((c) => usesFlats(c.name));

  if (!chords.length) return null;

  return (
    <section
      aria-labelledby="scale-heading"
      className="w-full max-w-7xl px-2 mx-auto flex flex-col gap-3 mt-8"
    >
      <div className="bg-primary p-4 rounded-xl flex flex-wrap items-center gap-3">
        <h2
          id="scale-heading"
          className="text-tertiary font-black"
        >
          Scales for this sequence
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {[...chordChromas]
            .sort((a, b) => a - b)
            .map((chroma) => (
              <span
                key={chroma}
                className={`flex justify-center items-center font-black rounded-full w-8 h-8 text-xs ${chroma === firstRoot ? "bg-tertiary" : "bg-accent"} text-primary`}
              >
                {pcName(chroma, preferFlats)}
              </span>
            ))}
        </div>
      </div>
      {scales.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
          {scales.map((scale) => (
            <ScaleCard
              key={scale.name}
              scale={scale}
              chordChromas={chordChromas}
              isFocused={focusScale?.name === scale.name}
              onFocus={() => onFocusScale(focusScale?.name === scale.name ? null : scale)}
            />
          ))}
        </ul>
      ) : (
        <p className="text-accent font-bold text-center py-2">No matching scales found.</p>
      )}
    </section>
  );
};

export default ScaleSection;
