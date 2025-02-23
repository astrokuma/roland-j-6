// ScaleBox.jsx (updated)
import React, { useMemo } from "react";
import * as Scale from "@tonaljs/scale";
import { Note } from "@tonaljs/tonal";
import ScaleButton from "./ScaleButton";
import { normalizeNote } from "../utils/notes";

const SCALE_MODES = ["major", "minor", "dorian", "mixolydian", "lydian", "phrygian", "locrian", "harmonic minor", "melodic minor", "major pentatonic", "minor pentatonic", "blues"];

const findMatchingScales = (inputNotes, root) => {
  if (!inputNotes.length || !root) return [];

  const tonic = Note.simplify(Note.pitchClass(root));
  const uniqueNotes = [...new Set(inputNotes.map((n) => Note.simplify(n)))];

  return SCALE_MODES.flatMap((mode) => {
    try {
      const scale = Scale.scale(`${tonic} ${mode}`);
      if (scale.empty) return null;

      const scaleNotes = scale.notes.map((n) => Note.simplify(Note.pitchClass(n)));
      const matchedNotes = uniqueNotes.filter((n) => scaleNotes.includes(n));
      const match = Math.round((matchedNotes.length / uniqueNotes.length) * 100);

      return {
        name: `${scale.tonic} ${mode}`,
        notes: scaleNotes,
        match,
        root: scale.tonic,
      };
    } catch {
      return null;
    }
  })
    .filter(Boolean)
    .sort((a, b) => b.match - a.match)
    .slice(0, 6);
};

const ScaleBox = ({ selectedChords = [] }) => {
  const allNotes = useMemo(
    () =>
      selectedChords.flatMap((chord) =>
        (chord.transposedNotes || [])
          .map((n) => normalizeNote(n, chord.root)) // Now properly imported
          .filter(Boolean)
      ),
    [selectedChords]
  );

  const root = selectedChords[0]?.root;
  const scales = useMemo(() => findMatchingScales(allNotes, root), [allNotes, root]);

  let uniqueNotesArray = Array.isArray(allNotes) ? [...new Set(allNotes)] : [];
  let uniqueNotes = uniqueNotesArray.join(" · ");

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 text-gray-400">
      {scales.length > 0 ? (
        <>
          <div className="flex justify-center">
            <p className="border-4 border-slate-900 rounded-lg bg-slate-900 text-slate-400 font-semibold py-2 px-4 break-words">Notes in chords: {uniqueNotes}</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
            {scales.map((scale, i) => (
              <ScaleButton
                key={i}
                scaleName={scale.name}
                notes={scale.notes}
                root={scale.root}
                matchPercentage={scale.match}
                matchedNotes={allNotes}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="w-full text-center rounded-t-sm bg-sky-900 text-white font-semibold py-2 px-4">SCALE: No matching scales found</div>
      )}
    </div>
  );
};

export default ScaleBox;
