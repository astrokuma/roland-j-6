import { Note } from "@tonaljs/tonal";

export const normalizeNote = (note, root) => {
  const baseNote = Note.pitchClass(note); // Gets note without octave
  if (!root) return baseNote;

  // Get preferred accidental type based on root (e.g., Bb root → prefer flats)
  const rootAccidental = root.includes("b") ? "b" : root.includes("#") ? "#" : "";

  const equivalent = Note.enharmonic(baseNote);
  const [rootLetter] = root.split(/[b#]/);

  // Prefer the version that matches the root's accidental
  if (rootAccidental === "b" && baseNote.includes("#")) {
    return equivalent;
  }
  if (rootAccidental === "#" && baseNote.includes("b")) {
    return equivalent;
  }

  return baseNote;
};

export const getTonalSafeName = (note) => Note.pitchClass(note);
