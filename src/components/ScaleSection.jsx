import React, { useMemo } from "react";
import * as Scale from "@tonaljs/scale";
import { Note } from "@tonaljs/tonal";
import ScaleCard from "./ScaleCard";
import NoteTags from "./NoteTags";
import { normalizeNote } from "../utils/notes";

const SCALE_MODES = ["major", "minor", "dorian", "mixolydian", "lydian", "phrygian", "locrian", "harmonic minor", "melodic minor", "major pentatonic", "minor pentatonic", "blues", "whole tone"];

const findMatchingScales = (inputNotes, root) => {
  if (!inputNotes.length) return [];

  // Even if there's no root in the chord, we need a reference note for the scale
  // Use the first note of the chord if no root is specified
  const scaleRoot = root || (inputNotes.length > 0 ? Note.pitchClass(inputNotes[0]) : null);
  if (!scaleRoot) return [];

  // Simplify input notes to enharmonic equivalents
  const simplifiedInputNotes = inputNotes.map((n) => {
    const pc = Note.pitchClass(n);
    return Note.simplify(pc);
  });
  const uniqueNotes = [...new Set(simplifiedInputNotes)];

  return SCALE_MODES.flatMap((mode) => {
    try {
      const scale = Scale.scale(`${scaleRoot} ${mode}`);
      if (scale.empty) return null;

      // Simplify scale notes for comparison and display
      const simplifiedScaleNotes = scale.notes.map((n) => Note.simplify(n));

      // Find matches using simplified notes
      const matchedNotes = uniqueNotes.filter((n) => {
        // Check if the note or its enharmonic equivalent is in the scale
        const enharmonic = Note.enharmonic(n);
        return simplifiedScaleNotes.includes(n) || simplifiedScaleNotes.includes(enharmonic);
      });

      const match = (matchedNotes.length / uniqueNotes.length) * 100;

      return {
        name: `${scaleRoot} ${mode}`,
        // Use simplified scale notes first, then normalize them for display consistency
        notes: simplifiedScaleNotes.map((n) => normalizeNote(n, scaleRoot)),
        match: Number.isFinite(match) ? match : 0,
        root: scaleRoot,
      };
    } catch {
      return null;
    }
  })
    .filter((scale) => scale && !isNaN(scale.match))
    .sort((a, b) => b.match - a.match)
    .slice(0, 8);
};

const ScaleSection = ({ selectedChords = [] }) => {
  // Extract only the actual notes from the chords, without adding the root
  const allNotes = useMemo(() => selectedChords.flatMap((chord) => (chord.notes || []).map((n) => normalizeNote(n, chord.root)).filter(Boolean)), [selectedChords]);

  // Use the root from the first chord for scale generation
  const root = selectedChords[0]?.root;
  const scales = useMemo(() => findMatchingScales(allNotes, root), [allNotes, root]);

  let uniqueNotesArray = Array.isArray(allNotes) ? [...new Set(allNotes)] : [];

  return (
    <div className="w-full 2xl:max-w-[85%] px-2 mx-auto flex flex-col gap-4">
      {scales.length > 0 ? (
        <>
          <div className="flex mt-4">
            <div className="bg-primary p-4 rounded-lg break-words flex items-center gap-4">
              <span className="text-accent font-semibold">Notes in chords:</span>
              <NoteTags
                notes={uniqueNotesArray}
                root={root}
                matchedNotes={uniqueNotesArray}
                isScaleCard={false}
                missingNotes={[]}
              />
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 w-full">
            {scales.map((scale, i) => (
              <ScaleCard
                key={i}
                scaleName={scale.name}
                notes={scale.notes}
                root={scale.root}
                matchedNotes={allNotes}
                matchedCount={scale.matchedCount}
                totalChordNotes={scale.totalChordNotes}
                matchPercentage={scale.match}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="w-full text-center rounded-t-sm bg-bg text-primary font-semibold py-2 px-4">SCALE: No matching scales found</div>
      )}
    </div>
  );
};

export default ScaleSection;
