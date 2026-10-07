import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ChordCard from "./ChordCard";
import useSwipe from "../hooks/useSwipe";
import { chromaSet } from "../utils/chordTheory";

const NO_STEPS = [];

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-accent">
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-tertiary" /> Root
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-accent" /> Chord tone
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-accent ring-2 ring-tertiary ring-offset-1 ring-offset-background" /> Bass (lowest note)
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full border border-dashed border-accent" /> Left out of the J-6 voicing
    </span>
  </div>
);

const CardDisplay = ({ bank, stepsByKey, playingKey, litKey, recording, focusScale, onClearFocus, onPress, onSwipe }) => {
  const swipe = useSwipe({ onSwipeLeft: () => onSwipe(1), onSwipeRight: () => onSwipe(-1) });

  const fitsScale = (chord) => {
    if (!focusScale) return true;
    return [...chromaSet(chord.notes)].every((c) => focusScale.chromas.has(c));
  };

  return (
    <section
      aria-label={`Chord set ${bank.number}: ${bank.genre}`}
      className="w-full max-w-7xl mx-auto px-2 mt-3 flex flex-col gap-3"
      {...swipe}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <Legend />
        {focusScale && (
          <button
            onClick={onClearFocus}
            className="flex items-center gap-1 rounded-full bg-tertiary text-primary text-xs font-black pl-3 pr-2 py-1"
          >
            Fits {focusScale.name}
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {bank.chords.map((chord) => (
          <ChordCard
            key={`${bank.number}-${chord.key}`}
            chord={chord}
            stepNumbers={stepsByKey[chord.key] ?? NO_STEPS}
            isPlaying={playingKey === chord.key}
            isLit={litKey === chord.key}
            isDimmed={!fitsScale(chord)}
            recording={recording}
            onPress={onPress}
          />
        ))}
      </div>
    </section>
  );
};

export default CardDisplay;
