import { Note, Interval } from "@tonaljs/tonal";

// Utility functions for chord manipulation
const stripChordName = (chordName) => {
  const [rootPart, bassPart] = chordName.split("/");
  const rootMatch = rootPart.match(/^[A-G][#b]?/);
  const root = rootMatch ? rootMatch[0] : null;
  const bassMatch = bassPart ? bassPart.match(/^[A-G][#b]?/) : null;
  const bass = bassMatch ? bassMatch[0] : null;
  const originalModifiers = rootPart.replace(root, "");
  const strippedChord = bass ? `${root}/${bass}` : root;
  return { strippedChord, originalModifiers };
};

const transposeNote = (note, semitones) => {
  return Note.transpose(note, Interval.fromSemitones(semitones));
};

const transposeStrippedChord = (strippedChord, semitones) => {
  const [root, bass] = strippedChord.split("/");
  const transposedRoot = transposeNote(root, semitones);
  const transposedBass = bass ? transposeNote(bass, semitones) : null;
  return transposedBass ? `${transposedRoot} / ${transposedBass}` : transposedRoot;
};

export { stripChordName, transposeNote, transposeStrippedChord };
