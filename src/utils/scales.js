import { Note, Scale } from "@tonaljs/tonal";
import { pcName } from "./chordTheory";

// Order matters: earlier modes win when several share the same notes (C major vs D dorian).
const SCALE_MODES = ["major", "minor", "dorian", "mixolydian", "lydian", "phrygian", "locrian", "harmonic minor", "melodic minor", "major pentatonic", "minor pentatonic", "blues", "whole tone"];

const accidentalCount = (notes) => notes.reduce((sum, n) => sum + (n.match(/[#b]/g)?.length ?? 0), 0);

// Spell the scale from whichever enharmonic tonic reads cleanest (Bb major, not A# major).
const spellScale = (chroma, mode) => {
  const candidates = [pcName(chroma, false), pcName(chroma, true)]
    .filter((tonic, i, all) => all.indexOf(tonic) === i)
    .map((tonic) => Scale.get(`${tonic} ${mode}`))
    .filter((s) => !s.empty && !s.notes.some((n) => /##|bb/.test(n)));
  if (!candidates.length) return Scale.get(`${pcName(chroma)} ${mode}`);
  return candidates.sort((a, b) => accidentalCount(a.notes) - accidentalCount(b.notes))[0];
};

/**
 * Rank scales that fit the given notes across all 12 tonics.
 * Scales that share the exact same notes (relative modes) are grouped into one result.
 */
export const findMatchingScales = (notes, { preferredTonic, limit = 6 } = {}) => {
  const chordChromas = [...new Set(notes.map((n) => Note.chroma(n)))];
  if (!chordChromas.length) return [];

  const groups = new Map();
  for (let chroma = 0; chroma < 12; chroma++) {
    SCALE_MODES.forEach((mode, modeIndex) => {
      const scale = spellScale(chroma, mode);
      if (scale.empty) return;
      const scaleChromas = new Set(scale.notes.map((n) => Note.chroma(n)));
      const matched = chordChromas.filter((c) => scaleChromas.has(c));
      if (!matched.length) return;

      const key = [...scaleChromas].sort((a, b) => a - b).join(",");
      const entry = {
        name: scale.name,
        tonicChroma: chroma,
        modeIndex,
        notes: scale.notes,
        chromas: scaleChromas,
        match: matched.length / chordChromas.length,
        outside: chordChromas.filter((c) => !scaleChromas.has(c)),
      };
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });
  }

  const ranked = [...groups.values()].map((members) => {
    // Name the group after the preferred tonic when it is one of the modes, otherwise its earliest mode.
    members.sort((a, b) => (b.tonicChroma === preferredTonic) - (a.tonicChroma === preferredTonic) || a.modeIndex - b.modeIndex);
    const [primary, ...alternates] = members;
    return { ...primary, alternates: alternates.map((m) => m.name) };
  });

  return ranked
    .sort(
      (a, b) =>
        b.match - a.match ||
        (b.tonicChroma === preferredTonic) - (a.tonicChroma === preferredTonic) ||
        b.alternates.length + 1 - (a.alternates.length + 1) ||
        a.chromas.size - b.chromas.size ||
        a.modeIndex - b.modeIndex,
    )
    .slice(0, limit);
};
