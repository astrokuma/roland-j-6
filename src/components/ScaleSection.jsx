import React, { useMemo } from "react";
import * as Scale from "@tonaljs/scale";
import { Note } from "@tonaljs/tonal";
import ScaleDisplay from "./ScaleDisplay";
import NoteTags from "./NoteTags";
import { normalizeNote } from "../utils/notes";

const SCALE_MODES = ["major", "minor", "dorian", "mixolydian", "lydian", "phrygian", "locrian", "harmonic minor", "melodic minor", "major pentatonic", "minor pentatonic", "blues", "whole tone"];

const findMatchingScales = (inputNotes, root) => {
  if (!inputNotes.length || !root) return [];

  // 1. Get original and simplified root (Tonal.js compatible)
  const originalRoot = Note.pitchClass(root);
  const simplifiedRoot = Note.simplify(originalRoot); // e.g., A# → Bb

  // 2. Normalize input notes to original root's accidental
  const normalizedInputNotes = inputNotes.map((n) => normalizeNote(n, originalRoot));
  const uniqueNotes = [...new Set(normalizedInputNotes)];

  return SCALE_MODES.flatMap((mode) => {
    try {
      // 3. Generate scale with simplified root
      const scale = Scale.scale(`${simplifiedRoot} ${mode}`);
      if (scale.empty) return null;

      // 4. Convert scale notes back to original root's accidental
      const scaleNotes = scale.notes.map(
        (n) => normalizeNote(n, originalRoot) // Key fix here
      );

      // 5. Compare notes in original accidental context
      const matchedNotes = uniqueNotes.filter((n) => scaleNotes.includes(n));

      const match = (matchedNotes.length / uniqueNotes.length) * 100;

      return {
        name: `${originalRoot} ${mode}`,
        notes: scaleNotes,
        match: Number.isFinite(match) ? match : 0, // Force valid number
        root: originalRoot,
      };
    } catch {
      return null;
    }
  })
    .filter((scale) => scale && !isNaN(scale.match))
    .sort((a, b) => b.match - a.match)
    .slice(0, 8);
};

const ScaleBox = ({ selectedChords = [] }) => {
  const allNotes = useMemo(() => selectedChords.flatMap((chord) => (chord.notes || []).map((n) => normalizeNote(n, chord.root)).filter(Boolean)), [selectedChords]);

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
                isScaleDisplay={false}
                missingNotes={[]}
              />
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 w-full">
            {scales.map((scale, i) => (
              <ScaleDisplay
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

export default ScaleBox;
