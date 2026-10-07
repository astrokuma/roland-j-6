import React from "react";
import { BLACK_KEYS, KEY_NAMES } from "../data/banks";

const KEY_W = 32;
const GAP = 7;
const WHITE = [1, 3, 5, 6, 8, 10, 12];
// Each black key sits over the gap after this many white keys.
const BLACK_POSITION = { 2: 1, 4: 2, 7: 4, 9: 5, 11: 6 };

/** The J-6's twelve key buttons. Shows which steps use each key, and lights up while playing. */
const KeyboardDisplay = ({ chords, stepsByKey, playingKey, litKey, onKeyPress }) => {
  const width = WHITE.length * KEY_W + (WHITE.length - 1) * GAP;

  const renderKey = (key) => {
    const isBlack = BLACK_KEYS.has(key);
    const steps = stepsByKey[key] ?? [];
    const lit = playingKey === key || litKey === key;
    const used = steps.length > 0;
    // Fixed width so the black keys line up over the gaps between white keys.
    const style = isBlack ? { width: KEY_W, left: BLACK_POSITION[key] * (KEY_W + GAP) - GAP / 2 - KEY_W / 2 } : { width: KEY_W };

    return (
      <button
        key={key}
        onClick={() => onKeyPress(key)}
        style={style}
        aria-label={`Key ${KEY_NAMES[key - 1]}: ${chords[key - 1]?.name}${used ? `, steps ${steps.join(", ")}` : ""}`}
        className={`flex flex-col items-center justify-center rounded-md outline outline-2 transition-colors leading-none
          ${isBlack ? "absolute top-0 h-8 outline-secondary" : "h-9 outline-accent"}
          ${lit ? "bg-tertiary text-primary" : used ? (isBlack ? "bg-secondary text-primary" : "bg-accent text-primary") : "bg-primary text-accent"}`}
      >
        {used ? (
          <>
            <span className="text-xs font-black">{steps[0]}</span>
            {steps.length > 1 && <span className="text-[9px] font-black opacity-80">+{steps.length - 1}</span>}
          </>
        ) : (
          <span className="text-[9px] font-bold opacity-60">{KEY_NAMES[key - 1]}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-primary rounded-xl px-3 py-3">
      <div
        className="relative h-8 mb-2"
        style={{ width }}
      >
        {[...BLACK_KEYS].map(renderKey)}
      </div>
      <div
        className="flex"
        style={{ width, gap: GAP }}
      >
        {WHITE.map(renderKey)}
      </div>
    </div>
  );
};

export default KeyboardDisplay;
