import { Note } from "@tonaljs/tonal";

// Convert note to MIDI number (C4 = 60, C#4 = 61, etc.)
const getPitchClassNumber = (note) => {
  const midi = Note.midi(note);
  return midi !== undefined ? midi % 12 : null;
};

export const normalizeNote = (note, root) => {
  const baseNote = Note.pitchClass(note);
  if (!root) return baseNote;

  const rootAccidental = root.includes("b") ? "b" : root.includes("#") ? "#" : "";
  const equivalent = Note.enharmonic(baseNote);

  // Prefer the accidental type matching the root
  if (rootAccidental === "b" && baseNote.includes("#")) return equivalent;
  if (rootAccidental === "#" && baseNote.includes("b")) return equivalent;

  return baseNote;
};

export const getTonalSafeName = (note) => Note.pitchClass(note);

export const isRootPresent = (root, notes) => {
  if (!root || !notes?.length) return false;

  const normalizedRoot = Note.simplify(Note.pitchClass(normalizeNote(root, root)));
  return notes.some((n) => {
    const note = Note.simplify(Note.pitchClass(normalizeNote(n, root)));
    return note === normalizedRoot || Note.enharmonic(note) === normalizedRoot || Note.enharmonic(normalizedRoot) === note;
  });
};

export { getPitchClassNumber };
