import { ChordType, Interval, Note } from "@tonaljs/tonal";

// The J-6 chord list uses its own shorthand ("FM9", "G7(13)", "Cm9/11", "CM13(no 3)").
// Each quality used in the chord sets maps either to a tonal chord type alias or to an
// explicit interval formula, so every chord can be broken down into degrees.
const QUALITY_ALIASES = {
  M: "M",
  FM7: "maj7", // Typo in the J-6 list ("F#FM7")
  M9: "maj9",
  M13: "maj13",
  "M7#5": "maj7#5",
  "M9/#11": "maj9#11",
  "M7/b5": "M7b5",
  "M7/9": "maj9",
  "maj7/9": "maj9",
  "M6/9": "6/9",
  "m9/11": "m11",
  "m7/11": "m7add11",
  "m7(11)": "m7add11",
  "m7/9": "m9",
  "m7/b5": "m7b5",
  "m6/9": "m69",
  mAdd9: "madd9",
  "7(13)": "7add13",
  "7/b13": "7b13",
  "7/b9": "7b9",
  "7add9": "9",
  "aug#9": "+add#9",
  addb9: "Maddb9",
  Madd2: "add2",
  Dim: "dim7",
  DimM7: "oM7",
  dimM7: "oM7",
  "11sus": "11",
  "11sus2": "11",
  sus7: "7sus4",
  sus9: "9sus4",
  sus11: "7sus4",
};

const QUALITY_FORMULAS = {
  "7sus2": ["1P", "2M", "5P", "7m"],
  add11: ["1P", "3M", "5P", "11P"],
  madd11: ["1P", "3m", "5P", "11P"],
  Madd4: ["1P", "3M", "4P", "5P"],
  mb13: ["1P", "3m", "5P", "13m"],
  mb6: ["1P", "3m", "5P", "6m"],
  mb9: ["1P", "3m", "5P", "9m"],
  "6sus2": ["1P", "2M", "5P", "6M"],
  "6sus4": ["1P", "4P", "5P", "6M"],
  "6sus2b5": ["1P", "2M", "5d", "6M"],
  dim11: ["1P", "3m", "5d", "11P"],
  "dim#5": ["1P", "3m", "5d", "13m"],
  "5b9": ["1P", "5P", "9m"],
  "5add9/b13": ["1P", "5P", "9M", "13m"],
  "M13(no3)": ["1P", "5P", "7M", "9M", "13M"],
  "M9(no3)": ["1P", "5P", "7M", "9M"],
  "sus9/13": ["1P", "5P", "9M", "13M"],
  sus13: ["1P", "4P", "5P", "7m", "13M"],
  "sus4/b9": ["1P", "4P", "5P", "9m"],
  m7b13: ["1P", "3m", "5P", "7m", "13m"],
  "m7/b13": ["1P", "3m", "5P", "7m", "13m"],
  m7add13: ["1P", "3m", "5P", "7m", "13M"],
  M7add6: ["1P", "3M", "5P", "6M", "7M"],
  m6addb13: ["1P", "3m", "5P", "6M", "13m"],
  M7sus2: ["1P", "2M", "5P", "7M"],
  "M7(13)": ["1P", "3M", "5P", "7M", "13M"],
  mM13: ["1P", "3m", "5P", "7M", "9M", "13M"],
  m11b5: ["1P", "3m", "5d", "7m", "11P"],
  "m7b5/9": ["1P", "3m", "5d", "7m", "9M"],
  "Mb5/#9": ["1P", "3M", "5d", "9A"],
  Mb7: ["1P", "3M", "5P"], // "DMb7/D#" in set 74 is a D triad over a D# bass
};

// Fallback degree names for notes that are not part of the chord formula.
const SEMITONE_DEGREES = ["R", "b9", "9", "b3", "3", "11", "#11", "5", "b13", "13", "b7", "7"];

const NAME_PATTERN = /^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/;
const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const pcName = (chroma, preferFlats = false) => (preferFlats ? FLAT_NAMES : SHARP_NAMES)[((chroma % 12) + 12) % 12];

export const spellMidi = (midi, preferFlats = false) => `${pcName(midi % 12, preferFlats)}${Math.floor(midi / 12) - 1}`;

export const usesFlats = (name = "") => /^[A-G]b/.test(name);

export const splitChordName = (name = "") => {
  const match = name.replace(/\s+/g, "").match(NAME_PATTERN);
  if (!match) return null;
  return { root: match[1], quality: match[2], bass: match[3] || null };
};

const degreeLabel = (interval) => {
  const { num, q } = Interval.get(interval);
  if (num === 1) return "R";
  if (q === "m") return `b${num}`;
  if (q === "A") return `#${num}`;
  if (q === "d") return [4, 5, 11, 12].includes(num) ? `b${num}` : `bb${num}`;
  return `${num}`;
};

const formulaFor = (quality) => {
  if (QUALITY_FORMULAS[quality]) return QUALITY_FORMULAS[quality];
  const type = ChordType.get(QUALITY_ALIASES[quality] ?? quality);
  return type.empty ? null : type.intervals;
};

/**
 * Break a chord down into what the J-6 actually plays versus what the name implies.
 * Returns the voicing (low to high, with degree labels) plus any chord tones Roland left out.
 */
export const analyzeChord = (chord) => {
  const parts = splitChordName(chord.analyzeAs || chord.name);
  const preferFlats = usesFlats(chord.name);
  const midis = [...chord.notes.map((n) => Note.midi(n))].sort((a, b) => a - b);
  const bassChroma = midis[0] % 12;

  if (!parts) {
    return { voicing: midis.map((m) => ({ midi: m, name: spellMidi(m, preferFlats), degree: null, isRoot: false, isBass: m === midis[0] })), omitted: [], recognized: false };
  }

  const rootChroma = Note.chroma(parts.root);
  const formula = formulaFor(parts.quality);
  const formulaByChroma = new Map();
  (formula || []).forEach((iv) => {
    const chroma = (rootChroma + Interval.semitones(iv)) % 12;
    if (!formulaByChroma.has(chroma)) formulaByChroma.set(chroma, degreeLabel(iv));
  });

  const playedChromas = new Set(midis.map((m) => m % 12));
  const isOctaveStack = playedChromas.size === 1;

  const voicing = midis.map((midi, index) => {
    const chroma = midi % 12;
    const degree = formulaByChroma.get(chroma) ?? SEMITONE_DEGREES[(chroma - rootChroma + 12) % 12];
    return {
      midi,
      name: spellMidi(midi, preferFlats),
      degree,
      inFormula: formulaByChroma.has(chroma),
      isRoot: chroma === rootChroma,
      isBass: index === 0,
      isDoubled: midis.findIndex((m) => m % 12 === chroma) !== index,
    };
  });

  const omitted = isOctaveStack
    ? []
    : [...formulaByChroma.entries()]
        .filter(([chroma]) => !playedChromas.has(chroma))
        .map(([chroma, degree]) => ({ name: pcName(chroma, preferFlats), degree, chroma }));

  return {
    voicing,
    omitted,
    recognized: Boolean(formula),
    rootChroma,
    bassChroma,
    slashBass: parts.bass,
    isOctaveStack,
  };
};

const transposePc = (pc, semitones, preferFlats) => pcName(Note.chroma(pc) + semitones, preferFlats);

/** Transpose a chord (name, notes and root) like the J-6 KEY function. */
export const transposeChord = (chord, semitones) => {
  if (!semitones) return chord;
  const preferFlats = usesFlats(chord.name);
  const shiftName = (name) =>
    name
      .replace(/^([A-G][#b]?)/, (pc) => transposePc(pc, semitones, preferFlats))
      .replace(/\/([A-G][#b]?)$/, (_, pc) => `/${transposePc(pc, semitones, preferFlats)}`);
  return {
    ...chord,
    name: shiftName(chord.name),
    analyzeAs: chord.analyzeAs ? shiftName(chord.analyzeAs) : undefined,
    remark: undefined, // Remarks quote Roland's untransposed chord list.
    root: transposePc(chord.root, semitones, preferFlats),
    notes: chord.notes.map((n) => spellMidi(Note.midi(n) + semitones, preferFlats)),
  };
};

export const chromaSet = (notes) => new Set(notes.map((n) => Note.chroma(n)));

/** Window of at least three octaves that holds the whole voicing. */
export const voicingWindow = (midis) => {
  const low = Math.floor(Math.min(...midis) / 12) - 1;
  const high = Math.floor(Math.max(...midis) / 12) - 1;
  const span = high - low + 1;
  return span >= 3 ? { startOctave: low, octaves: span } : { startOctave: low - Math.floor((3 - span) / 2), octaves: 3 };
};
