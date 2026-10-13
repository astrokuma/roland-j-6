import chordData from "../ChordChart.json";

// J-6 key buttons, in order. Key button n plays chord n of the selected chord set.
export const KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const BLACK_KEYS = new Set([2, 4, 7, 9, 11]);

export const BANKS = chordData.chord_chart.map((bank) => ({
  number: bank.id,
  genre: bank.genre,
  chords: bank.chords.map((chord, index) => ({ ...chord, bank: bank.id, key: index + 1 })),
}));

export const getChord = (bank, key) => BANKS[bank - 1]?.chords[key - 1] ?? null;

// The chord list spells some genres two ways ("Neo Soul" / "Neo-Soul"); group them for filtering.
export const genreFamily = (genre) => genre.split("/")[0].replace(/-/g, " ").replace(/\s+\d+$/, "").trim();

export const GENRE_FAMILIES = [...new Set(BANKS.map((b) => genreFamily(b.genre)))];
