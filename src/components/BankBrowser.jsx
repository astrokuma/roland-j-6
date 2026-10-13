import React, { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Note } from "@tonaljs/tonal";
import Modal from "./Modal";
import { BANKS, GENRE_FAMILIES, KEY_NAMES, genreFamily } from "../data/banks";
import { chromaSet } from "../utils/chordTheory";

const NOTE_TOKEN = /^[A-Ga-g][#b]?$/;
// J-6 names are case sensitive: "M" is major, "m" is minor. Roots match enharmonically (Db = C#).
const parseName = (text) => {
  const match = text.trim().match(/^([A-Ga-g][#b]?)(.*)$/);
  if (!match) return null;
  const quality = match[2].replace(/[\s()]/g, "").replace(/maj/gi, "M").replace(/min/g, "m");
  return { chroma: Note.chroma(match[1][0].toUpperCase() + match[1].slice(1)), quality };
};

/**
 * "c e g" (two or more note names) finds chords that contain all those notes.
 * Anything else matches chord names, the genre or the chord set number.
 */
const matchBank = (bank, query) => {
  const q = query.trim();
  if (!q) return { matches: true, chordKeys: [] };

  const tokens = q.split(/[\s,]+/).filter(Boolean);
  if (tokens.length >= 2 && tokens.every((t) => NOTE_TOKEN.test(t))) {
    const wanted = tokens.map((t) => Note.chroma(t[0].toUpperCase() + t.slice(1)));
    const chordKeys = bank.chords.filter((c) => wanted.every((w) => chromaSet(c.notes).has(w))).map((c) => c.key);
    return { matches: chordKeys.length > 0, chordKeys };
  }

  if (/^\d+$/.test(q)) return { matches: String(bank.number) === q, chordKeys: [] };

  const wanted = parseName(q);
  const chordKeys = wanted
    ? bank.chords
        .filter((c) => {
          const chord = parseName(c.name);
          return chord && chord.chroma === wanted.chroma && chord.quality.startsWith(wanted.quality);
        })
        .map((c) => c.key)
    : [];
  const genreHit = bank.genre.toLowerCase().includes(q.toLowerCase());
  return { matches: genreHit || chordKeys.length > 0, chordKeys };
};

const BankBrowser = ({ isOpen, onClose, currentBank, onSelect }) => {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState(null);

  const results = useMemo(
    () =>
      BANKS.filter((bank) => !family || genreFamily(bank.genre) === family)
        .map((bank) => ({ bank, ...matchBank(bank, query) }))
        .filter((r) => r.matches),
    [query, family],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chord sets"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 bg-notes rounded-full px-4 h-11">
          <MagnifyingGlassIcon className="w-5 h-5 text-accent shrink-0" />
          <input
            data-autofocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Genre, chord (Dm9) or notes (C E G)"
            aria-label="Search chord sets"
            className="flex-1 min-w-0 bg-transparent outline-none text-accent placeholder:text-accent/50 font-bold"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {[null, ...GENRE_FAMILIES].map((g) => (
            <button
              key={g ?? "all"}
              onClick={() => setFamily(g)}
              aria-pressed={family === g}
              className={`px-3 py-1 rounded-full text-xs font-black ${family === g ? "bg-tertiary text-primary" : "bg-notes text-accent"}`}
            >
              {g ?? "All"}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-secondary">
          {results.length} chord set{results.length === 1 ? "" : "s"}
        </p>

        <ul className="grid sm:grid-cols-2 gap-2">
          {results.map(({ bank, chordKeys }) => (
            <li key={bank.number}>
              <button
                onClick={() => {
                  onSelect(bank.number);
                  onClose();
                }}
                className={`w-full text-left rounded-xl p-3 bg-notes hover:brightness-110 outline outline-2 ${bank.number === currentBank ? "outline-tertiary" : "outline-transparent"}`}
              >
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-lg font-black text-tertiary">{bank.number}</span>
                  <span className="text-sm font-black text-accent">{bank.genre}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {bank.chords.map((c) => (
                    <span
                      key={c.key}
                      title={`Key ${KEY_NAMES[c.key - 1]}`}
                      className={`text-[11px] font-bold rounded px-1.5 py-0.5 ${chordKeys.includes(c.key) ? "bg-tertiary text-primary" : "bg-primary text-accent"}`}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default BankBrowser;
